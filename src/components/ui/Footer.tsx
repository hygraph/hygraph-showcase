import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/utils/locale';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="border-t border-[#F9F9F7]/20 bg-[#121212] text-[#F9F9F7]">
      {/* Newsletter + Links */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#F9F9F7]/20">
        <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#F9F9F7]/20">
          <h3 className="text-[#F9F9F7] mb-4">Stay in the loop</h3>
          <p className="text-[#F9F9F7]/60 mb-6" style={{ lineHeight: 1.6 }}>
            New releases, engineering stories, and riding culture. No spam.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-[#F9F9F7]/30 px-4 py-3 text-[#F9F9F7] placeholder-[#F9F9F7]/30 focus:outline-none focus:border-[#FF4F00]"
            />
            <button
              className="bg-[#FF4F00] text-white px-6 py-3 uppercase tracking-[0.1em] hover:bg-[#FF4F00]/90 transition-colors"
              style={{ fontSize: '0.75rem', fontWeight: 700 }}
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3">
          <div className="p-8 border-b sm:border-b-0 border-r border-[#F9F9F7]/20">
            <p className="uppercase tracking-[0.15em] text-[#F9F9F7]/40 mb-6" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
              Shop
            </p>
            <div className="space-y-3">
              {['Road', 'Urban', 'Electric', 'Gravel'].map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/collection`}
                  className="block text-[#F9F9F7]/70 hover:text-[#FF4F00] transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-8 border-b sm:border-b-0 sm:border-r border-[#F9F9F7]/20">
            <p className="uppercase tracking-[0.15em] text-[#F9F9F7]/40 mb-6" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
              Company
            </p>
            <div className="space-y-3">
              <Link href={`/${locale}/blog`} className="block text-[#F9F9F7]/70 hover:text-[#FF4F00] transition-colors">Journal</Link>
              <Link href={`/${locale}/careers`} className="block text-[#F9F9F7]/70 hover:text-[#FF4F00] transition-colors">Careers</Link>
              <Link href={`/${locale}/about`} className="block text-[#F9F9F7]/70 hover:text-[#FF4F00] transition-colors">About</Link>
              <Link href={`/${locale}/contact`} className="block text-[#F9F9F7]/70 hover:text-[#FF4F00] transition-colors">Contact</Link>
            </div>
          </div>
          <div className="p-8 col-span-2 sm:col-span-1">
            <p className="uppercase tracking-[0.15em] text-[#F9F9F7]/40 mb-6" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
              Social
            </p>
            <div className="space-y-3">
              {['Instagram', 'Twitter', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex items-center gap-1 text-[#F9F9F7]/70 hover:text-[#FF4F00] transition-colors"
                >
                  {s}
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom watermark */}
      <div className="flex flex-col items-center justify-between px-8 md:px-12 py-6 gap-4">
        <span
          className="tracking-[-0.05em] uppercase opacity-20 leading-[0.9]"
          style={{ fontWeight: 900, fontSize: '16rem' }}
        >
          HyBikes<span className="text-[#FF4F00]">.</span>
        </span>
        <p className="text-[#F9F9F7]/40" style={{ fontSize: '0.8rem' }}>
          &copy; 2026. All rights reserved. Designed in Berlin.
        </p>
      </div>
    </footer>
  );
}
