import { createOutfitInDb, getOutfitFromDb } from '@/lib/database';

export async function POST(request: Request): Promise<Response> {
    const { top, mid, bottom, creator } = await request.json();
    const outfit = await getOutfitFromDb({ creator: creator._id, top, mid, bottom });

    if (outfit) 
        return new Response(JSON.stringify({ success: false }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });

    const newOutfit = await createOutfitInDb({ top, mid, bottom, creator });
    
    return new Response(JSON.stringify({ success: true, outfit: newOutfit }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
