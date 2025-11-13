import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'lib', 'data', 'community-db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回一个初始结构
    return { posts: [] };
  }
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// 获取所有帖子
export async function GET() {
  try {
    const db = await readDb();
    // 为了性能，只返回帖子的摘要信息
    const postsSummary = db.posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      author: post.author,
      createdAt: post.createdAt,
      commentCount: post.comments.length,
    }));
    return NextResponse.json(postsSummary.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  } catch (error) {
    console.error('API Community GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// 创建新帖子或添加评论
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const db = await readDb();

    switch (action) {
      case 'create-post': {
        const { title, content, author } = payload;
        if (!title || !content || !author) {
          return NextResponse.json({ error: 'Title, content, and author are required' }, { status: 400 });
        }
        const newPost = {
          id: `post-${Date.now()}`,
          title,
          content,
          author,
          createdAt: new Date().toISOString(),
          comments: [],
        };
        db.posts.push(newPost);
        await writeDb(db);
        return NextResponse.json(newPost, { status: 201 });
      }

      case 'add-comment': {
        // 这个功能应该在 [postId] 路由中实现，这里只是一个占位符
        return NextResponse.json({ error: 'This action should be handled by /api/community/[postId]' }, { status: 400 });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error('API Community POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}