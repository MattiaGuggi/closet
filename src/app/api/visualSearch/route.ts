import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString('base64');

    // 1. Upload to ImgBB to get a reliable public URL for Google Lens
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    if (!imgbbApiKey) {
      console.error("[Visual Search] IMGBB_API_KEY missing");
      return NextResponse.json({ error: 'Image host config missing' }, { status: 500 });
    }

    console.log("[Visual Search] Uploading crop to ImgBB...");
    const imgbbFormData = new FormData();
    imgbbFormData.append("key", imgbbApiKey);
    imgbbFormData.append("image", base64Image);

    const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbFormData
    });

    const imgbbData = await imgbbRes.json();
    if (!imgbbData.success) {
      console.error("[Visual Search] ImgBB Error:", imgbbData);
      return NextResponse.json({ error: 'Failed to upload crop' }, { status: 502 });
    }

    const publicImageUrl = imgbbData.data.url;
    console.log(`[Visual Search] Crop uploaded: ${publicImageUrl}`);

    // 2. Pass the public URL to SerpApi's Google Lens Engine
    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey) {
      console.error("[Visual Search] SERPAPI_KEY missing");
      return NextResponse.json({ error: 'Lens API key missing' }, { status: 500 });
    }

    console.log("[Visual Search] Searching Google Lens via SerpApi...");
    const serpRes = await fetch(`https://serpapi.com/search.json?engine=google_lens&url=${publicImageUrl}&api_key=${serpApiKey}`);
    const serpData = await serpRes.json();

    if (serpData.error) {
      console.error("[Visual Search] SerpApi Error:", serpData.error);
      return NextResponse.json({ error: serpData.error }, { status: 500 });
    }

    // 3. Extract the clean e-commerce thumbnails from the visual matches
    const matchUrls = serpData.visual_matches?.map((match: any) => match.thumbnail) || [];

    if (matchUrls.length === 0) {
      return NextResponse.json({ error: 'No matches found' }, { status: 404 });
    }

    console.log(`[Visual Search] Found ${matchUrls.length} Google Lens matches!`);
    
    // Return up to 50 URLs to the frontend for pagination
    return NextResponse.json({ urls: matchUrls.slice(0, 50) });

  } catch (error) {
    console.error('[Visual Search] Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}