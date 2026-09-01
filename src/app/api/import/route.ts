import { createClothingInDb, db, connectDB } from '@/lib/database';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import path from "path";
import fs from "fs/promises";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const itemJson = formData.get("item") as string;

    if (!itemJson) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing item data in form' }),
        { status: 400 }
      );
    }

    const item = JSON.parse(itemJson);

    // 1. Extract creator ID (handles both raw string and object shapes)
    const creatorId = typeof item.creator === 'object' ? item.creator?._id : item.creator;

    if (!creatorId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing creator ID in item payload' }),
        { status: 400 }
      );
    }

    // 2. Validate user exists in PostgreSQL before attempting insert
    await connectDB();
    const existingUsers = await db.select().from(users).where(eq(users._id, creatorId));

    if (existingUsers.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `User with ID '${creatorId}' does not exist in database. Please log out and re-login.`
        }),
        { status: 400 }
      );
    }

    // Normalize creator to string UUID
    item.creator = creatorId;

    // Ensure upload directory exists to prevent ENOENT errors
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // IMAGE FILE
    const imageFile = formData.get("image") as File | Blob | null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      
      // Determine file extension (force .png for transparent background uploads)
      const isPng = (imageFile as File).type === 'image/png' || (imageFile as File).name?.endsWith('.png');
      const extension = isPng ? '.png' : path.extname((imageFile as File).name || '.png');
      const baseName = path.basename((imageFile as File).name || 'image', path.extname((imageFile as File).name || ''));
      const filename = `${Date.now()}-${baseName}${extension}`;

      const uploadPath = path.join(uploadDir, filename);
      await fs.writeFile(uploadPath, buffer);
      item.image = `/uploads/${filename}`;
    }

    // MODEL FILE (.glb / .gltf)
    const modelFile = formData.get("model") as File | Blob | null;
    if (modelFile) {
      const buffer = Buffer.from(await modelFile.arrayBuffer());
      const rawName = (modelFile as File).name || 'model.glb';
      const filename = `${Date.now()}-${rawName}`;

      const uploadPath = path.join(uploadDir, filename);
      await fs.writeFile(uploadPath, buffer);
      item.modelFile = `/uploads/${filename}`;
    }

    const savedItem = await createClothingInDb(item);

    return new Response(
      JSON.stringify({ success: true, message: 'File uploaded successfully', item: savedItem }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err: any) {
    console.error('Error in /api/import:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: err.message }),
      { status: 500 }
    );
  }
}