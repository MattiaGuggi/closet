import { NextResponse } from "next/server";
import { updateClothingInDb } from "@/lib/database";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN! });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const itemJson = formData.get("item") as string;
    const item = JSON.parse(itemJson);

    // Upload Image
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadRes = await utapi.uploadFiles(imageFile);
      if (uploadRes.data?.url) {
        item.image = uploadRes.data.url;
      }
    }

    // Upload 3D Model
    const modelFile = formData.get("model") as File | null;
    if (modelFile && modelFile.size > 0) {
      const uploadRes = await utapi.uploadFiles(modelFile);
      if (uploadRes.data?.url) {
        item.modelFile = uploadRes.data.url;
      }
    }

    const updated = await updateClothingInDb(item);
    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    console.error("Error updating clothing", err);
    return NextResponse.json({ success: false, message: "Cannot update clothing" }, { status: 500 });
  }
}