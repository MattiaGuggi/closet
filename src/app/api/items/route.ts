import { getAllClothesFromDb } from "@/lib/database";

export async function GET(): Promise<Response> {
    const clothes = await getAllClothesFromDb();

    if (clothes) {
        return new Response(JSON.stringify({ success: true, clothes }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    return new Response(JSON.stringify({ success: false, message: "Cannot retrieve clothes" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });
}
