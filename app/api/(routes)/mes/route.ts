import db from '@/lib/prisma/db';
import { checkAuth } from '@/lib/utils';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const user = await checkAuth();
    const { searchParams } = new URL(req.url);
    const { content } = (await req.json()) as { content: string };
    const channelId = searchParams.get('channelId');

    const message = await db.message.create({
      data: {
        channelId: channelId || '',
        userId: user?.userId || '',
        content: content
      }
    });

    return NextResponse.json(message, { status: 200 });
  } catch (e) {
    console.log(e);
  }
};
