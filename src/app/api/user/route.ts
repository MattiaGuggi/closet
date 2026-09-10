import { NextRequest, NextResponse } from 'next/server';
import { getUserClothesFromDb, getUserFromDb, getUserOutfitsFromDb, getUserGadgetsFromDb } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const user = await getUserFromDb({ _id: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      pfp: user.pfp || null,
    };

    const clothes = await getUserClothesFromDb({ creator: userId });
    const outfits = await getUserOutfitsFromDb({ creator: userId });
    const gadgets = await getUserGadgetsFromDb({ creator: userId });

    return NextResponse.json({
        success: true,
        user: safeUser,
        clothes: Array.isArray(clothes) ? clothes : [clothes],
        outfits: Array.isArray(outfits) ? outfits : [outfits],
        gadgets: Array.isArray(gadgets) ? gadgets : [gadgets]
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}