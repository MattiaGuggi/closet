import { NextResponse } from "next/server";
import { createGadgetInDb } from "@/lib/database";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN! });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const gadgetStr = formData.get("item") || formData.get("gadget");
    
    if (!gadgetStr) {
      return NextResponse.json({ success: false, error: "Missing gadget data" }, { status: 400 });
    }

    const gadget = JSON.parse(gadgetStr as string);
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const uploadRes = await utapi.uploadFiles(imageFile);
      if (uploadRes.data?.url) {
        gadget.image = uploadRes.data.url;
      }
    }

    const newGadget = await createGadgetInDb(gadget);

    return NextResponse.json({ success: true, item: newGadget });
  } catch (error: any) {
    console.error("Error creating gadget:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}