import { getAllClothesFromDb, getAllGadgetsFromDb } from "@/lib/database";

export async function GET(): Promise<Response> {
    const clothes = await getAllClothesFromDb();
    const gadgets = await getAllGadgetsFromDb();

    if (clothes) {
        return new Response(JSON.stringify({ success: true, clothes, gadgets }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    return new Response(JSON.stringify({ success: false, message: "Cannot retrieve clothes" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });
}
