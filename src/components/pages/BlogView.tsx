'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Post } from '@/types/hybike';

interface BlogViewProps {
  posts: Post[];
}

export default function BlogView({ posts }: BlogViewProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[#121212]">
        <div className="p-8 md:p-12 lg:p-16">
          <p className="uppercase tracking-[0.2em] text-[#6B6B6B] mb-6" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
            Journal
          </p>
          <h1>
            Stories &amp;
            <br />
            ideas<span className="text-[#FF4F00]">.</span>
          </h1>
          <p className="text-[#6B6B6B] mt-8 max-w-[480px]" style={{ lineHeight: 1.7 }}>
            Engineering deep-dives, riding culture, and the thinking behind the bikes we build.
          </p>
        </div>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="border-b border-[#121212]">
          <Link href={`/${locale}/blog/${featured.slug}`} className="grid grid-cols-1 lg:grid-cols-12 group">
            <div className="lg:col-span-7 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#121212]">
              {featured.imageUrl ? (
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover min-h-[360px] lg:min-h-[480px] group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full min-h-[360px] lg:min-h-[480px] bg-[#E8E8E4]" />
              )}
            </div>
            <div className="lg:col-span-5 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className="bg-[#FF4F00] text-white px-3 py-1 uppercase tracking-[0.15em]"
                    style={{ fontSize: '0.6rem', fontWeight: 700 }}
                  >
                    {featured.category}
                  </span>
                  <span className="uppercase tracking-[0.15em] text-[#6B6B6B]" style={{ fontSize: '0.6rem', fontWeight: 700 }}>
                    {featured.publishedDate}
                  </span>
                </div>
                <h2 className="mb-6 group-hover:text-[#FF4F00] transition-colors">
                  {featured.title}
                  <span className="text-[#FF4F00]">.</span>
                </h2>
                <p className="text-[#6B6B6B]" style={{ lineHeight: 1.7 }}>
                  {featured.summary}
                </p>
              </div>
              <div className="mt-10 flex items-center gap-3 text-[#FF4F00] uppercase tracking-[0.1em] group-hover:gap-4 transition-all self-start">
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Read article</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Remaining articles */}
      {rest.length > 0 && (
        <section className="border-b border-[#121212]">
          <div className="p-8 md:p-12 lg:px-16 border-b border-[#121212]">
            <p className="uppercase tracking-[0.2em] text-[#6B6B6B]" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
              More articles
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {rest.map((post, i) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className={`group flex flex-col ${i === 0 ? 'md:border-r border-[#121212]' : ''}`}
              >
                <div className="overflow-hidden border-b border-[#121212]">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full object-cover h-[260px] group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-[260px] bg-[#E8E8E4]" />
                  )}
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-5">
                    <span
                      className="bg-[#121212] text-[#F9F9F7] px-3 py-1 uppercase tracking-[0.15em]"
                      style={{ fontSize: '0.6rem', fontWeight: 700 }}
                    >
                      {post.category}
                    </span>
                    <span className="uppercase tracking-[0.15em] text-[#6B6B6B]" style={{ fontSize: '0.6rem', fontWeight: 700 }}>
                      {post.publishedDate}
                    </span>
                  </div>
                  <h3 className="mb-4 group-hover:text-[#FF4F00] transition-colors">
                    {post.title}
                    <span className="text-[#FF4F00]">.</span>
                  </h3>
                  <p className="text-[#6B6B6B] mb-6 flex-1" style={{ lineHeight: 1.7 }}>
                    {post.summary}
                  </p>
                  <div className="flex items-center gap-2 text-[#FF4F00] uppercase tracking-[0.1em] group-hover:gap-3 transition-all self-start">
                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Read article</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <div className="p-16 text-center">
          <p className="text-[#6B6B6B]">No articles yet.</p>
        </div>
      )}
    </div>
  );
}
