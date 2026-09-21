import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

    const externalImageRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    if (!externalImageRes.ok) {
      return NextResponse.json({ error: 'Failed to download external image' }, { status: 502 });
    }
    
    const imageArrayBuffer = await externalImageRes.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': externalImageRes.headers.get('content-type') || 'image/jpeg',
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('[Proxy] Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}