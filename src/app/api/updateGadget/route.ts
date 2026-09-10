import { NextResponse } from "next/server";
import { updateClothingInDb } from "@/lib/database";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN! });

const getFileKey = (url: string | undefined | null) => {
  if (!url || !url.includes("utfs.io")) return null;
  return url.split("/").pop(); 
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const gadgetStr = formData.get("gadget") as string;
    
    if (!gadgetStr) {
      return NextResponse.json({ success: false, error: "Missing gadget data" }, { status: 400 });
    }

    const gadget = JSON.parse(gadgetStr);
    const filesToDelete: string[] = [];

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadRes = await utapi.uploadFiles(imageFile);
      if (uploadRes.data?.url) {
        if (gadget.image) {
          const oldImgKey = getFileKey(gadget.image);
          if (oldImgKey) filesToDelete.push(oldImgKey);
        }
        gadget.image = uploadRes.data.url;
      }
    }

    if (filesToDelete.length > 0) {
      utapi.deleteFiles(filesToDelete).catch((err) => 
        console.error("Failed to delete orphaned files from UploadThing:", err)
      );
    }

    const updated = await updateClothingInDb(gadget);
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating gadget:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}