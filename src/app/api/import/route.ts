import { createClothingInDb } from '@/lib/database';

export async function POST(request: Request): Promise<Response> {
  try {
    const { item } = await request.json();

    if (!item) {
      return new Response('Missing item', { status: 400 });
    }

    const savedItem = await createClothingInDb(item);

    return new Response(JSON.stringify({ message: 'File uploaded successfully', item: savedItem }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err: any) {
    console.error('Error in /api/import:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: err.message }), { status: 500 });
  }
}
