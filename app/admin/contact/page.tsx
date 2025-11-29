'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SocialMedia {
  name: string;
  url: string;
  icon: string;
}

interface ContactInfoData {
  _id?: string;
  headerTitle: string;
  headerSubtitle: string;
  email: string;
  phone: string;
  location: string;
  businessHours: {
    weekday: string;
    weekend: string;
  };
  socialMedia: SocialMedia[];
  legalTerms: {
    copyright: string;
    refundPolicy: string;
    serviceAgreement: string;
    privacy: string;
  };
}

export default function AdminContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData>({
    headerTitle: '',
    headerSubtitle: '',
    email: '',
    phone: '',
    location: '',
    businessHours: {
      weekday: '',
      weekend: '',
    },
    socialMedia: [],
    legalTerms: {
      copyright: '',
      refundPolicy: '',
      serviceAgreement: '',
      privacy: '',
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      const data = await response.json();
      if (data.success) {
        setContactInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/contact-info', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Contact information updated successfully!' });
        setContactInfo(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update contact info' });
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating' });
    } finally {
      setIsSaving(false);
    }
  };

  const addSocialMedia = () => {
    setContactInfo({
      ...contactInfo,
      socialMedia: [...contactInfo.socialMedia, { name: '', url: '', icon: '' }],
    });
  };

  const updateSocialMedia = (index: number, field: keyof SocialMedia, value: string) => {
    const updated = [...contactInfo.socialMedia];
    updated[index][field] = value;
    setContactInfo({ ...contactInfo, socialMedia: updated });
  };

  const removeSocialMedia = (index: number) => {
    const updated = contactInfo.socialMedia.filter((_, i) => i !== index);
    setContactInfo({ ...contactInfo, socialMedia: updated });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Manage Contact Information</h1>
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium mt-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Page Header</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Title
                  </label>
                  <input
                    type="text"
                    value={contactInfo.headerTitle}
                    onChange={(e) => setContactInfo({ ...contactInfo, headerTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Get In Touch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Subtitle
                  </label>
                  <input
                    type="text"
                    value={contactInfo.headerSubtitle}
                    onChange={(e) => setContactInfo({ ...contactInfo, headerSubtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Let's discuss how we can work together"
                  />
                </div>
              </div>
            </div>

            {/* Basic Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={contactInfo.location}
                    onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekday Hours
                  </label>
                  <input
                    type="text"
                    value={contactInfo.businessHours.weekday}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        businessHours: { ...contactInfo.businessHours, weekday: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Monday - Friday: 9AM - 6PM EST"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekend Hours
                  </label>
                  <input
                    type="text"
                    value={contactInfo.businessHours.weekend}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        businessHours: { ...contactInfo.businessHours, weekend: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Weekend: By Appointment"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Social Media Links</h2>
                <button
                  type="button"
                  onClick={addSocialMedia}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Social Media
                </button>
              </div>

              <div className="space-y-4">
                {contactInfo.socialMedia.map((social, index) => (
                  <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={social.name}
                          onChange={(e) => updateSocialMedia(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Facebook"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL
                        </label>
                        <input
                          type="url"
                          value={social.url}
                          onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="https://facebook.com/yourpage"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Icon (Emoji)
                        </label>
                        <input
                          type="text"
                          value={social.icon}
                          onChange={(e) => updateSocialMedia(index, 'icon', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="📘"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSocialMedia(index)}
                      className="mt-8 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}

                {contactInfo.socialMedia.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No social media links added yet. Click "Add Social Media" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Legal Terms */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Terms</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Copyright & Usage
                  </label>
                  <textarea
                    value={contactInfo.legalTerms.copyright}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        legalTerms: { ...contactInfo.legalTerms, copyright: e.target.value },
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Policy
                  </label>
                  <textarea
                    value={contactInfo.legalTerms.refundPolicy}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        legalTerms: { ...contactInfo.legalTerms, refundPolicy: e.target.value },
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Agreement
                  </label>
                  <textarea
                    value={contactInfo.legalTerms.serviceAgreement}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        legalTerms: { ...contactInfo.legalTerms, serviceAgreement: e.target.value },
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy & Confidentiality
                  </label>
                  <textarea
                    value={contactInfo.legalTerms.privacy}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        legalTerms: { ...contactInfo.legalTerms, privacy: e.target.value },
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
