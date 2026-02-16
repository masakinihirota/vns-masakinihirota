import { generateContent } from '@/lib/vertex-ai';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Vertex AI の接続確認用 API
 * GET: 固定のプロンプトで生成テスト
 * POST: ボディに含まれる prompt で生成テスト
 */
export async function GET() {
  try {
    const responseText = await generateContent('「こんにちは、Vertex AIです！」という挨拶に続けて、自己紹介をしてください。');
    return NextResponse.json({
      status: 'success',
      message: 'Vertex AI connection established.',
      data: {
        response: responseText
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({
        status: 'error',
        message: 'Prompt is required in the request body.',
      }, { status: 400 });
    }

    const responseText = await generateContent(prompt);
    return NextResponse.json({
      status: 'success',
      data: {
        response: responseText
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
