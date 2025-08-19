import { getClothingFromDb, getOutfitFromDb } from "@/lib/database";

export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user");

    if (!userId) return new Response(JSON.stringify({ success: false, message: 'Cannot retrieve user' }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
    });

    const clothes = await getClothingFromDb({ creator: userId });
    const outfits = await getOutfitFromDb({ creator: userId });
    
    return new Response(JSON.stringify({ success: true, clothes, outfits }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
