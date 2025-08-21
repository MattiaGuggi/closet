import { NextResponse } from "next/server";
import { updateOutfitInDb } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const outfitJson = formData.get("outfit") as string;
    const outfit = JSON.parse(outfitJson);

    const updated = await updateOutfitInDb(outfit);
    return NextResponse.json({ success: true, outfit: updated });
  } catch (err) {
    console.error("Error updating clothing", err);
    return NextResponse.json({ success: false, message: "Cannot update clothing" }, { status: 500 });
  }
}
