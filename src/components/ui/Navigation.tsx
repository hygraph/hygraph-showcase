'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { Locale } from '@/lib/utils/locale';

const navItems = [
  { label: 'Collection', path: 'collection' },
  { label: 'Journal', path: 'blog' },
  { label: 'Careers', path: 'careers' },
  { label: 'About', path: 'about' },
  { label: 'Contact', path: 'contact' },
];

interface NavigationProps {
  locale: Locale;
}

export default function Navigation({ locale }: NavigationProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#F9F9F7] border-b border-t border-[#121212]">
      <div className="flex items-stretch h-[56px]">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center px-6 border-r border-[#121212] hover:bg-[#121212] hover:text-[#F9F9F7] transition-colors"
        >
          <span className="uppercase" style={{ fontWeight: 900, fontSize: '1rem' }}>
            HyBikes<span className="text-[#FF4F00]">.</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-stretch">
          {navItems.map((item) => {
            const href = `/${locale}/${item.path}`;
            const isActive = pathname === href;
            return (
              <Link
                key={item.path}
                href={href}
                className={`flex items-center px-6 border-r border-[#121212] transition-colors hover:bg-[#121212] hover:text-[#F9F9F7] ${
                  isActive ? 'bg-[#121212] text-[#F9F9F7]' : ''
                }`}
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Cart */}
        <Link
          href={`/${locale}/collection`}
          className="flex items-center px-6 border-l border-[#121212] hover:bg-[#121212] hover:text-[#F9F9F7] transition-colors gap-2"
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          <span className="hidden sm:inline">Cart (0)</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center px-5 border-l border-[#121212] hover:bg-[#121212] hover:text-[#F9F9F7] transition-colors"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#121212]">
          {navItems.map((item) => {
            const href = `/${locale}/${item.path}`;
            const isActive = pathname === href;
            return (
              <Link
                key={item.path}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block px-6 py-4 border-b border-[#121212] transition-colors hover:bg-[#121212] hover:text-[#F9F9F7] ${
                  isActive ? 'bg-[#121212] text-[#F9F9F7]' : ''
                }`}
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
