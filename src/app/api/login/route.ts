import { getUserFromDb } from "@/lib/database";

export async function POST(request: Request): Promise<Response> {
    const { email, password } = await request.json();
    const user = await getUserFromDb(email);

    console.log(user, password)

    if (user && password == user.password) {
        return new Response(JSON.stringify({ success: true, user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    return new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });
}
