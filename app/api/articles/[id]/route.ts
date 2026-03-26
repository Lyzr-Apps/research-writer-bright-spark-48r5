import { authMiddleware } from 'lyzr-architect';
import { NextRequest, NextResponse } from 'next/server';
import getArticleModel from '@/models/Article';

async function handler(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const Article = await getArticleModel();

    if (req.method === 'GET') {
      const article = await Article.findById(id);
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: article });
    }

    if (req.method === 'PUT') {
      const body = await req.json();
      const article = await Article.findByIdAndUpdate(id, body, { new: true });
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: article });
    }

    if (req.method === 'DELETE') {
      const article = await Article.findByIdAndDelete(id);
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: { deleted: true } });
    }

    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const GET = authMiddleware(handler);
export const PUT = authMiddleware(handler);
export const DELETE = authMiddleware(handler);
