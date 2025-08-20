import { createClothingInDb } from '@/lib/database';
import path from "path";
import fs from "fs/promises";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const itemJson = formData.get("item") as string;
    const item = JSON.parse(itemJson);

    // IMAGE FILE
    const imageFile = formData.get("image") as Blob | null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer?.() ?? await imageFile.text().then(t => new TextEncoder().encode(t)));
      const filename = `${Date.now()}-${(imageFile as any).name ?? 'image'}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      await fs.writeFile(uploadPath, buffer);
      item.image = `/uploads/${filename}`;
    }

    // MODEL FILE
    const modelFile = formData.get("model") as Blob | null;
    if (modelFile) {
      const buffer = Buffer.from(await modelFile.arrayBuffer?.() ?? await modelFile.text().then(t => new TextEncoder().encode(t)));
      const filename = `${Date.now()}-${(modelFile as any).name ?? 'model'}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      await fs.writeFile(uploadPath, buffer);
      item.modelFile = `/uploads/${filename}`;
    }

    const savedItem = await createClothingInDb(item);

    return new Response(JSON.stringify({ success: true, message: 'File uploaded successfully', item: savedItem }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err: any) {
    console.error('Error in /api/import:', err);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error', error: err.message }), { status: 500 });
  }
}
