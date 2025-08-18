

export async function POST (request: Request): Promise<Response> {
  const { item } = await request.json();

  if (!item) {
    return new Response('Missing item', { status: 400 });
  }

  // Creating in db or somewhere the clothes item

  return new Response(JSON.stringify({ message: 'File uploaded successfully', item }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}