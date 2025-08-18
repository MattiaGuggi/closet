import { createUserInDb } from '@/lib/database';

export async function POST(request: Request): Promise<Response> {
    const { username, email, password } = await request.json();
    const user = await createUserInDb(username, email, password);
    
    return new Response(JSON.stringify({ success: true, user }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
