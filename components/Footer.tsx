'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface QuickLink {
  label: string;
  url: string;
}

interface FooterData {
  brandName: string;
  brandDescription: string;
  quickLinks: QuickLink[];
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  copyrightText: string;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData>({
    brandName: 'ModelPro',
    brandDescription: 'Professional modeling services for brands, events, and content creation.',
    quickLinks: [
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
      { label: 'Services', url: '/services' },
      { label: 'Contact', url: '/contact' },
    ],
    contactEmail: 'contact@modelpro.com',
    contactPhone: '+1 (555) 123-4567',
    contactLocation: 'New York, NY',
    copyrightText: 'ModelPro. All rights reserved.',
  });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await fetch('/api/footer-settings');
      const data = await response.json();
      if (data.success) {
        setFooterData(data.data);
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    }
  };

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{footerData.brandName}</h3>
            <p className="text-gray-200">
              {footerData.brandDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.url} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-200">
              <li>Email: {footerData.contactEmail}</li>
              <li>Phone: {footerData.contactPhone}</li>
              <li>Location: {footerData.contactLocation}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-400 mt-8 pt-8 text-center text-gray-200">
          <p>&copy; {currentYear} {footerData.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
