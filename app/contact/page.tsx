'use client';

import { useEffect, useState } from 'react';

interface SocialMedia {
  name: string;
  url: string;
  icon: string;
}

interface ContactInfoData {
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

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Failed to load contact information</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{contactInfo.headerTitle}</h1>
          <p className="text-xl text-gray-100">
            {contactInfo.headerSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">📧</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-3xl mr-4">📱</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-3xl mr-4">📍</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">{contactInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-3xl mr-4">⏰</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">{contactInfo.businessHours.weekday}</p>
                    <p className="text-gray-600">{contactInfo.businessHours.weekend}</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Follow Me
                </h3>
                <div className="flex flex-wrap gap-4">
                  {contactInfo.socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <span className="text-2xl">{social.icon}</span>
                      <span className="font-semibold text-gray-900">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal Terms */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Legal Terms
              </h2>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">⚠️</span>
                    Copyright & Usage
                  </h3>
                  <p className="leading-relaxed">
                    {contactInfo.legalTerms.copyright}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">💰</span>
                    No Refund Policy
                  </h3>
                  <p className="leading-relaxed">
                    {contactInfo.legalTerms.refundPolicy}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">📋</span>
                    Service Agreement
                  </h3>
                  <p className="leading-relaxed">
                    {contactInfo.legalTerms.serviceAgreement}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">🔒</span>
                    Privacy & Confidentiality
                  </h3>
                  <p className="leading-relaxed">
                    {contactInfo.legalTerms.privacy}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 italic">
                  By using our services, you acknowledge that you have read,
                  understood, and agree to these terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
