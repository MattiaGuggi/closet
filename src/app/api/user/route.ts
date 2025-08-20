import { getUserClothesFromDb, getUserOutfitsFromDb } from "@/lib/database";

export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) return new Response(JSON.stringify({ success: false, message: 'Cannot retrieve user' }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
    });

    const clothes = await getUserClothesFromDb({ creator: userId });
    const outfits = await getUserOutfitsFromDb({ creator: userId });
    
    return new Response(JSON.stringify({
            success: true, 
            clothes: Array.isArray(clothes) ? clothes : [clothes],
            outfits: Array.isArray(outfits) ? outfits : [outfits]
        }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
