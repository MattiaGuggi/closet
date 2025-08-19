import { createOutfitInDb } from '@/lib/database';

export async function POST(request: Request): Promise<Response> {
    const { top, mid, bottom } = await request.json();
    const outfit = await createOutfitInDb({ top, mid, bottom });
    
    return new Response(JSON.stringify({ success: true, outfit }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
