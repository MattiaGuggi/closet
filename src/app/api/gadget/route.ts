import { NextResponse } from "next/server";
import { createClothingInDb } from "@/lib/database";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const gadgetStr = formData.get("item") || formData.get("gadget");
    
    if (!gadgetStr) {
      return NextResponse.json({ success: false, error: "Missing gadget data" }, { status: 400 });
    }

    const gadget = JSON.parse(gadgetStr as string);
    const imageFile = formData.get("image") as File | null;

    // TODO: If you use AWS S3 / Vercel Blob, upload the `imageFile` here 
    // and assign the resulting URL to `gadget.image`.

    const newGadget = await createClothingInDb(gadget);

    return NextResponse.json({ success: true, item: newGadget });
  } catch (error: any) {
    console.error("Error creating gadget:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}