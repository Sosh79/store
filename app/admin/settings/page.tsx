'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ISiteSettings } from '@/models/SiteSettings';

interface QuickLink {
  label: string;
  url: string;
}

interface NavLink {
  label: string;
  url: string;
  order?: number;
}

interface FooterSettings {
  brandName: string;
  brandDescription: string;
  quickLinks: QuickLink[];
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  copyrightText: string;
}

interface NavbarSettings {
  siteName: string;
  navLinks: NavLink[];
}

export default function SiteSettingsPage() {
  const [heroSettings, setHeroSettings] = useState<ISiteSettings>({
    heroImage: '',
    heroTitle: '',
    heroSubtitle: '',
    heroButton: {
      label: '',
      url: '',
    },
    servicesTitle: '',
    noServicesMessage: '',
    noServicesButtonLabel: '',
    noServicesButtonUrl: '',
    portfolioTitle: '',
    ctaTitle: '',
    ctaDescription: '',
    ctaButtons: [],
  });
  const [servicesSettings, setServicesSettings] = useState({
    servicesPageTitle: '',
    servicesPageSubtitle: '',
  });
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    brandName: '',
    brandDescription: '',
    quickLinks: [],
    contactEmail: '',
    contactPhone: '',
    contactLocation: '',
    copyrightText: '',
  });
  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings>({
    siteName: '',
    navLinks: [],
  });
  const [aboutSettings, setAboutSettings] = useState({
    aboutPageTitle: '',
    aboutPageSubtitle: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);
  const [isSavingFooter, setIsSavingFooter] = useState(false);
  const [isSavingNavbar, setIsSavingNavbar] = useState(false);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [heroMessage, setHeroMessage] = useState({ type: '', text: '' });
  const [servicesMessage, setServicesMessage] = useState({ type: '', text: '' });
  const [footerMessage, setFooterMessage] = useState({ type: '', text: '' });
  const [navbarMessage, setNavbarMessage] = useState({ type: '', text: '' });
  const [aboutMessage, setAboutMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [heroRes, footerRes, navbarRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/footer-settings'),
        fetch('/api/navbar-settings'),
      ]);
      
      const heroData = await heroRes.json();
      const footerData = await footerRes.json();
      const navbarData = await navbarRes.json();
      
      if (heroData.success) {
        const { aboutPageTitle, aboutPageSubtitle, servicesPageTitle, servicesPageSubtitle, ...heroOnly } = heroData.data;
        setHeroSettings(heroOnly);
        setAboutSettings({ aboutPageTitle, aboutPageSubtitle });
        setServicesSettings({ servicesPageTitle, servicesPageSubtitle });
      }
      
      if (footerData.success) {
        setFooterSettings(footerData.data);
      }
      
      if (navbarData.success) {
        setNavbarSettings(navbarData.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    setHeroMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroSettings),
      });

      const data = await response.json();
      if (data.success) {
        setHeroMessage({ type: 'success', text: 'Hero settings updated successfully!' });
        setTimeout(() => setHeroMessage({ type: '', text: '' }), 3000);
      } else {
        setHeroMessage({ type: 'error', text: 'Failed to update hero settings' });
      }
    } catch (error) {
      console.error('Error updating hero settings:', error);
      setHeroMessage({ type: 'error', text: 'Error updating hero settings' });
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleSaveServices = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingServices(true);
    setServicesMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicesSettings),
      });

      const data = await response.json();
      if (data.success) {
        setServicesMessage({ type: 'success', text: 'Services page settings updated successfully!' });
        setTimeout(() => setServicesMessage({ type: '', text: '' }), 3000);
      } else {
        setServicesMessage({ type: 'error', text: 'Failed to update services settings' });
      }
    } catch (error) {
      console.error('Error updating services settings:', error);
      setServicesMessage({ type: 'error', text: 'Error updating services settings' });
    } finally {
      setIsSavingServices(false);
    }
  };

  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFooter(true);
    setFooterMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/footer-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerSettings),
      });

      const data = await response.json();
      if (data.success) {
        setFooterMessage({ type: 'success', text: 'Footer settings updated successfully!' });
        setTimeout(() => setFooterMessage({ type: '', text: '' }), 3000);
      } else {
        setFooterMessage({ type: 'error', text: 'Failed to update footer settings' });
      }
    } catch (error) {
      console.error('Error updating footer settings:', error);
      setFooterMessage({ type: 'error', text: 'Error updating footer settings' });
    } finally {
      setIsSavingFooter(false);
    }
  };

  const addQuickLink = () => {
    setFooterSettings({
      ...footerSettings,
      quickLinks: [...footerSettings.quickLinks, { label: '', url: '' }],
    });
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAbout(true);
    setAboutMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutSettings),
      });

      const data = await response.json();
      if (data.success) {
        setAboutMessage({ type: 'success', text: 'About page settings updated successfully!' });
        setTimeout(() => setAboutMessage({ type: '', text: '' }), 3000);
      } else {
        setAboutMessage({ type: 'error', text: 'Failed to update about settings' });
      }
    } catch (error) {
      console.error('Error updating about settings:', error);
      setAboutMessage({ type: 'error', text: 'Error updating about settings' });
    } finally {
      setIsSavingAbout(false);
    }
  };

  const updateQuickLink = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...footerSettings.quickLinks];
    updated[index][field] = value;
    setFooterSettings({ ...footerSettings, quickLinks: updated });
  };

  const removeQuickLink = (index: number) => {
    const updated = footerSettings.quickLinks.filter((_, i) => i !== index);
    setFooterSettings({ ...footerSettings, quickLinks: updated });
  };

  const addCtaButton = () => {
    const newButton = {
      label: '',
      url: '',
      style: 'primary' as const,
      order: (heroSettings.ctaButtons?.length || 0) + 1,
    };
    setHeroSettings({
      ...heroSettings,
      ctaButtons: [...(heroSettings.ctaButtons || []), newButton],
    });
  };

  const updateCtaButton = (index: number, field: string, value: string | number) => {
    const updated = [...(heroSettings.ctaButtons || [])];
    (updated[index] as any)[field] = value;
    setHeroSettings({ ...heroSettings, ctaButtons: updated });
  };

  const removeCtaButton = (index: number) => {
    const updated = (heroSettings.ctaButtons || []).filter((_, i) => i !== index);
    setHeroSettings({ ...heroSettings, ctaButtons: updated });
  };

  const handleSaveNavbar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNavbar(true);
    setNavbarMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/navbar-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(navbarSettings),
      });

      const data = await response.json();
      if (data.success) {
        setNavbarMessage({ type: 'success', text: 'Navbar settings updated successfully!' });
        setTimeout(() => setNavbarMessage({ type: '', text: '' }), 3000);
      } else {
        setNavbarMessage({ type: 'error', text: 'Failed to update navbar settings' });
      }
    } catch (error) {
      console.error('Error updating navbar settings:', error);
      setNavbarMessage({ type: 'error', text: 'Error updating navbar settings' });
    } finally {
      setIsSavingNavbar(false);
    }
  };

  const addNavLink = () => {
    const nextOrder = navbarSettings.navLinks.length + 1;
    setNavbarSettings({
      ...navbarSettings,
      navLinks: [...navbarSettings.navLinks, { label: '', url: '', order: nextOrder }],
    });
  };

  const updateNavLink = (index: number, field: 'label' | 'url' | 'order', value: string | number) => {
    const updated = [...navbarSettings.navLinks];
    if (field === 'order') {
      updated[index][field] = value as number;
    } else {
      updated[index][field] = value as string;
    }
    setNavbarSettings({ ...navbarSettings, navLinks: updated });
  };

  const removeNavLink = (index: number) => {
    const updated = navbarSettings.navLinks.filter((_, i) => i !== index);
    setNavbarSettings({ ...navbarSettings, navLinks: updated });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Site Settings</h1>
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium mt-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading settings...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Navbar Settings Section */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Navigation Bar Settings</h2>
                  <p className="text-gray-600">
                    Customize the navigation menu and site logo
                  </p>
                </div>

                {navbarMessage.text && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      navbarMessage.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {navbarMessage.text}
                  </div>
                )}

                <form onSubmit={handleSaveNavbar} className="space-y-6">
                  {/* Site Name */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Name (Logo)</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={navbarSettings.siteName}
                        onChange={(e) =>
                          setNavbarSettings({ ...navbarSettings, siteName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        placeholder="ModelPro"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        This will appear as the logo/brand name in the navigation bar
                      </p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Navigation Links</h3>
                      <button
                        type="button"
                        onClick={addNavLink}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Nav Link
                      </button>
                    </div>

                    <div className="space-y-4">
                      {navbarSettings.navLinks
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((link, index) => {
                          const actualIndex = navbarSettings.navLinks.findIndex(
                            l => l.label === link.label && l.url === link.url
                          );
                          return (
                            <div key={actualIndex} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Label
                                  </label>
                                  <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => updateNavLink(actualIndex, 'label', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                    placeholder="Home"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL
                                  </label>
                                  <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => updateNavLink(actualIndex, 'url', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                    placeholder="/"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order
                                  </label>
                                  <input
                                    type="number"
                                    value={link.order || 0}
                                    onChange={(e) => updateNavLink(actualIndex, 'order', parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                    placeholder="1"
                                    min="0"
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeNavLink(actualIndex)}
                                className="mt-8 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          );
                        })}

                      {navbarSettings.navLinks.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No navigation links added yet. Click "Add Nav Link" to get started.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingNavbar}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingNavbar ? 'Saving...' : 'Save Navbar Settings'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Hero Settings Section */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Hero Section Settings</h2>
                  <p className="text-gray-600">
                    Customize the hero section on the homepage
                  </p>
                </div>

                {heroMessage.text && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      heroMessage.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {heroMessage.text}
                  </div>
                )}

                <form onSubmit={handleSaveHero} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={heroSettings.heroImage}
                      onChange={(e) =>
                        setHeroSettings({ ...heroSettings, heroImage: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                      placeholder="https://example.com/your-profile-image.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Direct link to your profile/hero image
                    </p>
                  </div>

                  {heroSettings.heroImage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </label>
                      <div className="w-64 h-64 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={heroSettings.heroImage}
                          alt="Hero preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={heroSettings.heroTitle}
                      onChange={(e) =>
                        setHeroSettings({ ...heroSettings, heroTitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                      placeholder="Professional Modeling Services"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Subtitle
                    </label>
                    <textarea
                      value={heroSettings.heroSubtitle}
                      onChange={(e) =>
                        setHeroSettings({ ...heroSettings, heroSubtitle: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                      placeholder="Elevate your brand with experienced, versatile modeling..."
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Button</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Label
                        </label>
                        <input
                          type="text"
                          value={heroSettings.heroButton?.label || ''}
                          onChange={(e) =>
                            setHeroSettings({
                              ...heroSettings,
                              heroButton: { ...heroSettings.heroButton!, label: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          placeholder="Order Service"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button URL
                        </label>
                        <input
                          type="text"
                          value={heroSettings.heroButton?.url || ''}
                          onChange={(e) =>
                            setHeroSettings({
                              ...heroSettings,
                              heroButton: { ...heroSettings.heroButton!, url: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          placeholder="/services"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Services Title
                        </label>
                        <input
                          type="text"
                          value={heroSettings.servicesTitle || ''}
                          onChange={(e) =>
                            setHeroSettings({ ...heroSettings, servicesTitle: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          placeholder="Our Services"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          No Services Message
                        </label>
                        <input
                          type="text"
                          value={heroSettings.noServicesMessage || ''}
                          onChange={(e) =>
                            setHeroSettings({ ...heroSettings, noServicesMessage: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          placeholder="No services available yet. Check back soon!"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            No Services Button Label
                          </label>
                          <input
                            type="text"
                            value={heroSettings.noServicesButtonLabel || ''}
                            onChange={(e) =>
                              setHeroSettings({ ...heroSettings, noServicesButtonLabel: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                            placeholder="Contact Us"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            No Services Button URL
                          </label>
                          <input
                            type="text"
                            value={heroSettings.noServicesButtonUrl || ''}
                            onChange={(e) =>
                              setHeroSettings({ ...heroSettings, noServicesButtonUrl: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                            placeholder="/contact"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Section</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Title
                      </label>
                      <input
                        type="text"
                        value={heroSettings.portfolioTitle || ''}
                        onChange={(e) =>
                          setHeroSettings({ ...heroSettings, portfolioTitle: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                        placeholder="Portfolio"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">CTA Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CTA Title
                        </label>
                        <input
                          type="text"
                          value={heroSettings.ctaTitle || ''}
                          onChange={(e) =>
                            setHeroSettings({ ...heroSettings, ctaTitle: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          placeholder="Ready to Work Together?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CTA Description
                        </label>
                        <textarea
                          value={heroSettings.ctaDescription || ''}
                          onChange={(e) =>
                            setHeroSettings({ ...heroSettings, ctaDescription: e.target.value })
                          }
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          placeholder="Let's create something amazing. Get in touch to discuss your project."
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            CTA Buttons
                          </label>
                          <button
                            type="button"
                            onClick={addCtaButton}
                            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                          >
                            + Add Button
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {heroSettings.ctaButtons?.map((button, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="grid md:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Label
                                  </label>
                                  <input
                                    type="text"
                                    value={button.label}
                                    onChange={(e) => updateCtaButton(index, 'label', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                    placeholder="Button Text"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    URL
                                  </label>
                                  <input
                                    type="text"
                                    value={button.url}
                                    onChange={(e) => updateCtaButton(index, 'url', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                    placeholder="/page"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Style
                                  </label>
                                  <select
                                    value={button.style}
                                    onChange={(e) => updateCtaButton(index, 'style', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                  >
                                    <option value="primary">Primary</option>
                                    <option value="secondary">Secondary</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Order
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="number"
                                      value={button.order}
                                      onChange={(e) => updateCtaButton(index, 'order', parseInt(e.target.value))}
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeCtaButton(index)}
                                      className="text-red-600 hover:text-red-800 px-2"
                                      title="Remove button"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingHero}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingHero ? 'Saving...' : 'Save Hero Settings'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Services Page Settings Section */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Services Page Settings</h2>
                  <p className="text-gray-600">
                    Customize the header section on the services page
                  </p>
                </div>

                {servicesMessage.text && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      servicesMessage.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {servicesMessage.text}
                  </div>
                )}

                <form onSubmit={handleSaveServices} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Title
                    </label>
                    <input
                      type="text"
                      value={servicesSettings.servicesPageTitle}
                      onChange={(e) =>
                        setServicesSettings({ ...servicesSettings, servicesPageTitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Our Services"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Subtitle
                    </label>
                    <input
                      type="text"
                      value={servicesSettings.servicesPageSubtitle}
                      onChange={(e) =>
                        setServicesSettings({ ...servicesSettings, servicesPageSubtitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Professional modeling services tailored to your needs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingServices}
                      className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingServices ? 'Saving...' : 'Save Services Settings'}
                    </button>
                  </div>
                </form>
              </div>

              {/* About Page Settings Section */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">About Page Settings</h2>
                  <p className="text-gray-600">
                    Customize the header section on the About page
                  </p>
                </div>

                {aboutMessage.text && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      aboutMessage.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {aboutMessage.text}
                  </div>
                )}

                <form onSubmit={handleSaveAbout} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={aboutSettings.aboutPageTitle}
                      onChange={(e) =>
                        setAboutSettings({ ...aboutSettings, aboutPageTitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="About Me"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This appears as the main heading on the About page
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Subtitle
                    </label>
                    <input
                      type="text"
                      value={aboutSettings.aboutPageSubtitle}
                      onChange={(e) =>
                        setAboutSettings({ ...aboutSettings, aboutPageSubtitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Professional Model & Content Creator"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This appears below the main heading on the About page
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingAbout}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingAbout ? 'Saving...' : 'Save About Settings'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Footer Settings Section */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Footer Settings</h2>
                  <p className="text-gray-600">
                    Customize the footer section across all pages
                  </p>
                </div>

                {footerMessage.text && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      footerMessage.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {footerMessage.text}
                  </div>
                )}

                <form onSubmit={handleSaveFooter} className="space-y-6">
                  {/* Brand Info */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Brand Name
                        </label>
                        <input
                          type="text"
                          value={footerSettings.brandName}
                          onChange={(e) =>
                            setFooterSettings({ ...footerSettings, brandName: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                          placeholder="ModelPro"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Brand Description
                        </label>
                        <textarea
                          value={footerSettings.brandDescription}
                          onChange={(e) =>
                            setFooterSettings({ ...footerSettings, brandDescription: e.target.value })
                          }
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                          placeholder="Professional modeling services for brands, events, and content creation."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
                      <button
                        type="button"
                        onClick={addQuickLink}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Link
                      </button>
                    </div>

                    <div className="space-y-4">
                      {footerSettings.quickLinks.map((link, index) => (
                        <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Label
                              </label>
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                placeholder="Home"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL
                              </label>
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                placeholder="/home"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeQuickLink(index)}
                            className="mt-8 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {footerSettings.quickLinks.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No quick links added yet. Click "Add Link" to get started.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={footerSettings.contactEmail}
                          onChange={(e) =>
                            setFooterSettings({ ...footerSettings, contactEmail: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                          placeholder="contact@modelpro.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={footerSettings.contactPhone}
                          onChange={(e) =>
                            setFooterSettings({ ...footerSettings, contactPhone: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={footerSettings.contactLocation}
                          onChange={(e) =>
                            setFooterSettings({ ...footerSettings, contactLocation: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                          placeholder="New York, NY"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Copyright Text</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Copyright Text (year will be added automatically)
                      </label>
                      <input
                        type="text"
                        value={footerSettings.copyrightText}
                        onChange={(e) =>
                          setFooterSettings({ ...footerSettings, copyrightText: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                        placeholder="ModelPro. All rights reserved."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingFooter}
                      className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingFooter ? 'Saving...' : 'Save Footer Settings'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
