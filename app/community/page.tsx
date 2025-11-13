'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PostSummary {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  commentCount: number;
}

function CreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('CurrentUser'); // 实际应用中应从 useAuth 获取
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-post',
          payload: { title, content, author },
        }),
      });
      if (!response.ok) throw new Error('Failed to create post');
      setTitle('');
      setContent('');
      onPostCreated(); // 通知父组件刷新帖子列表
    } catch (error) {
      console.error(error);
      alert('게시물 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">새 게시물 작성</h2>
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
        required
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
        rows={4}
        required
      />
      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
        {isSubmitting ? '작성 중...' : '게시하기'}
      </button>
    </form>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/community');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">커뮤니티</h1>
      <CreatePostForm onPostCreated={fetchPosts} />
      {isLoading ? <p>Loading posts...</p> : (
        <div className="space-y-4">
          {posts.map(post => (
            <Link key={post.id} href={`/community/${post.id}`} className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-sm text-gray-500">by {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="mt-4 text-right">{post.commentCount} comments</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}