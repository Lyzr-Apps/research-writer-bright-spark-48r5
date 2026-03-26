import { authMiddleware, getCurrentUserId } from 'lyzr-architect';
import { NextRequest, NextResponse } from 'next/server';
import getArticleModel from '@/models/Article';

async function handler(req: NextRequest) {
  try {
    const Article = await getArticleModel();

    if (req.method === 'GET') {
      const articles = await Article.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: articles });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const article = await Article.create({
        ...body,
        owner_user_id: getCurrentUserId(),
      });
      return NextResponse.json({ success: true, data: article });
    }

    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const GET = authMiddleware(handler);
export const POST = authMiddleware(handler);
