import dbConnect from '@/lib/mongodb';
import ContactInfo from '@/models/ContactInfo';

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

// Default contact data
const defaultContactData: ContactInfoData = {
  headerTitle: 'Get In Touch',
  headerSubtitle: "Let's discuss how we can work together",
  email: 'contact@modelpro.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  businessHours: {
    weekday: 'Monday - Friday: 9AM - 6PM EST',
    weekend: 'Weekend: By Appointment',
  },
  socialMedia: [
    { name: 'Facebook', url: 'https://facebook.com', icon: '📘' },
    { name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
    { name: 'TikTok', url: 'https://tiktok.com', icon: '🎵' },
  ],
  legalTerms: {
    copyright: 'All content, photographs, videos, and materials created during our collaboration remain the intellectual property of ModelPro. The customer may not republish, redistribute, or resell any content without explicit written permission.',
    refundPolicy: 'All services are final sale. Once a service has been booked and scheduled, no refunds will be issued. In case of cancellation, credits may be offered for future services at our discretion.',
    serviceAgreement: 'By requesting a service, you agree to our terms and conditions. All projects require a signed agreement before work begins. Payment terms and schedules will be outlined in the service agreement.',
    privacy: 'We respect your privacy and maintain confidentiality of all client information. Personal data is protected in accordance with applicable privacy laws.',
  },
};

async function getContactInfo(): Promise<ContactInfoData> {
  try {
    await dbConnect();
    const contactInfo = await ContactInfo.findOne().lean();

    // If data exists in database, use it
    if (contactInfo) {
      return contactInfo as ContactInfoData;
    }

    // If no data exists, try to create it
    try {
      const newContactInfo = await ContactInfo.create(defaultContactData);
      return newContactInfo.toObject() as ContactInfoData;
    } catch (createError) {
      console.log('Could not create contact info, using defaults:', createError);
      return defaultContactData;
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    // Always return default data if there's any error
    return defaultContactData;
  }
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo();

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
