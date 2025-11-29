'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface NavLink {
  label: string;
  url: string;
  order?: number;
}

interface NavbarData {
  siteName: string;
  navLinks: NavLink[];
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = pathname?.startsWith('/admin');

  const [navbarData, setNavbarData] = useState<NavbarData>({
    siteName: 'ModelPro',
    navLinks: [
      { label: 'Home', url: '/', order: 1 },
      { label: 'About', url: '/about', order: 2 },
      { label: 'Services', url: '/services', order: 3 },
      { label: 'Contact', url: '/contact', order: 4 },
    ],
  });

  useEffect(() => {
    fetchNavbarSettings();
  }, []);

  const fetchNavbarSettings = async () => {
    try {
      const response = await fetch('/api/navbar-settings');
      const data = await response.json();
      if (data.success) {
        setNavbarData(data.data);
      }
    } catch (error) {
      console.error('Error fetching navbar settings:', error);
    }
  };

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/orders', label: 'Orders' },
  ];

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            {navbarData.siteName}
          </Link>

          <div className="hidden md:flex space-x-8">
            {isAdmin && session ? (
              <>
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`hover:text-accent transition-colors ${
                      pathname === link.href ? 'text-accent' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navbarData.navLinks
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((link, index) => (
                    <Link
                      key={index}
                      href={link.url}
                      className={`hover:text-accent transition-colors ${
                        pathname === link.url ? 'text-accent' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                <Link
                  href="/admin/login"
                  className="hover:text-accent transition-colors"
                >
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-accent">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
