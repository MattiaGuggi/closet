import { NextRequest, NextResponse } from "next/server";
import { updateWishlist } from "@/lib/database";

export async function POST(req: NextRequest) {
    try {
        const { userId, itemId, itemType } = await req.json();

        if (!userId || !itemId || !itemType) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const item = await updateWishlist(userId, itemId, itemType);

        console.log("Wishlist update result:", item);

        if (item) {
            return NextResponse.json({ success: true, item });
        }
    } catch(err) {
        console.error("Error parsing request body:", err);
    }
}
