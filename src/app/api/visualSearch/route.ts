import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString('base64');

    const visionApiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!visionApiKey) return NextResponse.json({ error: 'Vision API key missing' }, { status: 500 });

    const visionRes = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [{ type: "WEB_DETECTION", maxResults: 10 }]
        }]
      })
    });

    const visionData = await visionRes.json();
    if (visionData.error) return NextResponse.json({ error: visionData.error.message }, { status: 500 });

    const webDetection = visionData.responses?.[0]?.webDetection;
    
    let matchUrls = webDetection?.visuallySimilarImages?.map((img: any) => img.url) || [];
    if (matchUrls.length === 0) {
      matchUrls = webDetection?.partialMatchingImages?.map((img: any) => img.url) || [];
    }

    if (matchUrls.length === 0) {
      return NextResponse.json({ error: 'No matches found' }, { status: 404 });
    }

    // Return up to 10 URLs to the frontend
    return NextResponse.json({ urls: matchUrls.slice(0, 10) });

  } catch (error) {
    console.error('[Visual Search] Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}