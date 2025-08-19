import { updateClothingInDb } from "@/lib/database";

export async function POST(request: Request): Promise<Response> {
    const { item } = await request.json();

    if (item) {
        await updateClothingInDb(item);
        
        return new Response(JSON.stringify({ success: true, item }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    return new Response(JSON.stringify({ success: false, message: "Cannot update clothing" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });
}
