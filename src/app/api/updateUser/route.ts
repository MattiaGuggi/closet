import { updateUserInDb } from "@/lib/database";

export async function POST(request: Request): Promise<Response> {
    const { user } = await request.json();

    if (user) {
        await updateUserInDb(user);
        
        return new Response(JSON.stringify({ success: true, user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    return new Response(JSON.stringify({ success: false, message: "Cannot update user" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });
}
