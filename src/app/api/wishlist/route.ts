import { NextRequest, NextResponse } from "next/server";
import { updateWishlist } from "@/lib/database";

export async function POST(req: NextRequest) {
    try {
        const { userId, itemId, itemType, isWishlisted } = await req.json();

        if (!userId || !itemId || !itemType) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const item = await updateWishlist(userId, itemId, itemType, isWishlisted);

        return NextResponse.json(item);
    } catch(err) {
        console.error("Error parsing request body:", err);
        return NextResponse.json({ success: false, message: "Failed to update wishlist" }, { status: 500 });
    }
}
