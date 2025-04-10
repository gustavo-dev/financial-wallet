import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function verifyAuth(req: NextRequest): Promise<number | null> {
  try {
    const token = req.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return verified.payload.userId as number;
  } catch (error) {
    return null;
  }
} 