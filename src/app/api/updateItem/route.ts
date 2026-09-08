import { NextResponse } from "next/server";
import { updateClothingInDb } from "@/lib/database";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN! });

// Helper to extract the unique file key from the URL
const getFileKey = (url: string | undefined | null) => {
    if (!url || !url.includes("utfs.io")) return null;
    return url.split("/").pop(); 
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const itemJson = formData.get("item") as string;
    
    const item = JSON.parse(itemJson); // Old data

    const filesToDelete: string[] = [];

    // Upload New Image
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadRes = await utapi.uploadFiles(imageFile);
      if (uploadRes.data?.url) {
        // Mark old image for deletion
        if (item.image) {
          const oldImgKey = getFileKey(item.image);
          if (oldImgKey) filesToDelete.push(oldImgKey);
        }
        // Overwrite with the new URL
        item.image = uploadRes.data.url;
      }
    }

    // Upload New 3D Model
    const modelFile = formData.get("model") as File | null;
    if (modelFile && modelFile.size > 0) {
      const uploadRes = await utapi.uploadFiles(modelFile);
      if (uploadRes.data?.url) {
        // Mark old model for deletion
        if (item.modelFile) {
          const oldModelKey = getFileKey(item.modelFile);
          if (oldModelKey) filesToDelete.push(oldModelKey);
        }
        // Overwrite with the new URL
        item.modelFile = uploadRes.data.url;
      }
    }

    // Delete the orphaned files from UploadThing in the background
    if (filesToDelete.length > 0) {
      utapi.deleteFiles(filesToDelete).catch((err) => 
        console.error("Failed to delete orphaned files from UploadThing:", err)
      );
    }

    // Save the fully updated item to the database
    const updated = await updateClothingInDb(item);
    
    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    console.error("Error updating clothing", err);
    return NextResponse.json({ success: false, message: "Cannot update clothing" }, { status: 500 });
  }
}