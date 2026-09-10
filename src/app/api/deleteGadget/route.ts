import { NextResponse } from "next/server";
import { deleteGadgetFromDb, getClothingFromDb } from "@/lib/database";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN! });

const getFileKey = (url: string | undefined | null) => {
  if (!url || !url.includes("utfs.io")) return null;
  return url.split("/").pop(); 
};

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    const itemToDelete = await getClothingFromDb(id);

    if (!itemToDelete) {
      return NextResponse.json({ 
        success: true, 
        message: 'Gadget già eliminato' 
      });
    }

    const filesToDelete: string[] = [];
    const imageKey = getFileKey(itemToDelete.image);
    
    if (imageKey) filesToDelete.push(imageKey);

    const modelKey = getFileKey(itemToDelete.modelFile);
    if (modelKey) filesToDelete.push(modelKey);

    if (filesToDelete.length > 0) {
      await utapi.deleteFiles(filesToDelete).catch(err => 
        console.error("Failed to delete files from UploadThing:", err)
      );
    }

    const result = await deleteGadgetFromDb(id);
    
    if (!result.success) throw new Error(result.error);

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("Error deleting gadget API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}