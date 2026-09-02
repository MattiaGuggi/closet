// src/app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromDb } from '@/lib/database';
import bcrypt from 'bcrypt';

/**
 * GET: Handles session verification on page refresh
 * Route: /api/user?userId=...
 */
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
      pfp: user.pfp,
    };

    return NextResponse.json({ success: true, user: safeUser }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST: Handles login authentication
 * Route: /api/user
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    const user = await getUserFromDb({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const safeUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        pfp: user.pfp,
      };

      return NextResponse.json({ success: true, user: safeUser }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}