import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { updateClothingInDb } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const itemJson = formData.get("item") as string;
    const item = JSON.parse(itemJson);

    // IMAGE FILE
    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
      const bytes = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      await fs.writeFile(uploadPath, bytes);
      item.image = `/uploads/${filename}`;
    }

    // MODEL FILE
    const modelFile = formData.get("model") as File | null;
    if (modelFile) {
      const bytes = Buffer.from(await modelFile.arrayBuffer());
      const filename = `${Date.now()}-${modelFile.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      await fs.writeFile(uploadPath, bytes);
      item.modelFile = `/uploads/${filename}`;
    }

    const updated = await updateClothingInDb(item);
    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    console.error("Error updating clothing", err);
    return NextResponse.json({ success: false, message: "Cannot update clothing" }, { status: 500 });
  }
}
