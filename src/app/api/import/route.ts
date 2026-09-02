import { createClothingInDb, db, connectDB } from '@/lib/database';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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

    // 1. Extract creator ID
    const creatorId = typeof item.creator === 'object' ? item.creator?._id : item.creator;

    if (!creatorId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing creator ID in item payload' }),
        { status: 400 }
      );
    }

    // 2. Validate user exists in PostgreSQL
    await connectDB();
    const existingUsers = await db.select().from(users).where(eq(users._id, creatorId));

    if (existingUsers.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `User with ID '${creatorId}' does not exist in database.`
        }),
        { status: 400 }
      );
    }

    item.creator = creatorId;

    // 3. Convert Image to Base64 String (No local disk writing)
    const imageFile = formData.get("image") as File | Blob | null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const mimeType = (imageFile as File).type || 'image/png';
      item.image = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    // 4. Convert 3D Model to Base64 String (No local disk writing)
    const modelFile = formData.get("model") as File | Blob | null;
    if (modelFile) {
      const buffer = Buffer.from(await modelFile.arrayBuffer());
      item.modelFile = `data:model/gltf-binary;base64,${buffer.toString('base64')}`;
    }

    const savedItem = await createClothingInDb(item);

    return new Response(
      JSON.stringify({ success: true, message: 'Item saved to DB', item: savedItem }),
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