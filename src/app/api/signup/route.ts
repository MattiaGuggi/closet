import { registerUser } from '@/lib/auth';

export async function POST(request: Request): Promise<Response> {
    const { name, email, password } = await request.json();
    const user = await registerUser(name, email, password);
    
    return new Response(JSON.stringify({ success: true, user }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
