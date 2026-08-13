import { createUserInDb } from '@/lib/database';

export async function POST(request: Request): Promise<Response> {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return new Response(JSON.stringify({ success: false, message: "Dati mancanti" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await createUserInDb(username, email, password);
        
        return new Response(JSON.stringify({ 
            success: true, 
            user 
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: error.message || "Errore durante la registrazione" 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
