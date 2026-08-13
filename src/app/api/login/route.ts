import { getUserFromDb } from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(request: Request): Promise<Response> {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return new Response(JSON.stringify({ success: false, message: "Email e password obbligatorie" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await getUserFromDb(email);

        // Verifica della password in chiaro con l'hash bcrypt presente a DB
        if (user && await bcrypt.compare(password, user.password)) {
            const safeUser = {
                _id: user._id,
                username: user.username,
                email: user.email,
            };

            return new Response(JSON.stringify({ success: true, user: safeUser }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        return new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "Errore interno del server" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
