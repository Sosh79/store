import Link from 'next/link';
import Gallery from '@/components/Gallery';
import ServiceCard from '@/components/ServiceCard';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import Portfolio from '@/models/Portfolio';
import SiteSettings from '@/models/SiteSettings';
import { IService } from '@/models/Service';
import { ISiteSettings } from '@/models/SiteSettings';

async function getLatestServices(): Promise<IService[]> {
  try {
    await connectDB();
    // Get the 6 most recent services
    const services = await Service.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(6)
      .lean();
    
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function getPortfolioImages(): Promise<string[]> {
  try {
    await connectDB();
    const portfolioItems = await Portfolio.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return portfolioItems.map(item => item.imageUrl);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
}

async function getSiteSettings(): Promise<ISiteSettings> {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({
        heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        heroTitle: 'Professional Modeling Services',
        heroSubtitle: 'Elevate your brand with experienced, versatile modeling for fashion, events, and content creation.',
        heroButton: {
          label: 'Order Service',
          url: '/services',
        },
        servicesTitle: 'Our Services',
        noServicesMessage: 'No services available yet. Check back soon!',
        noServicesButtonLabel: 'Contact Us',
        noServicesButtonUrl: '/contact',
        portfolioTitle: 'Portfolio',
        ctaTitle: 'Ready to Work Together?',
        ctaDescription: 'Let\'s create something amazing. Get in touch to discuss your project.',
        ctaButtons: [
          { label: 'View Services', url: '/services', style: 'primary', order: 1 },
          { label: 'Contact Us', url: '/contact', style: 'secondary', order: 2 },
        ],
      });
    }
    
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      heroTitle: 'Professional Modeling Services',
      heroSubtitle: 'Elevate your brand with experienced, versatile modeling for fashion, events, and content creation.',
      heroButton: {
        label: 'Order Service',
        url: '/services',
      },
      servicesTitle: 'Our Services',
      noServicesMessage: 'No services available yet. Check back soon!',
      noServicesButtonLabel: 'Contact Us',
      noServicesButtonUrl: '/contact',
      portfolioTitle: 'Portfolio',
      ctaTitle: 'Ready to Work Together?',
      ctaDescription: 'Let\'s create something amazing. Get in touch to discuss your project.',
      ctaButtons: [
        { label: 'View Services', url: '/services', style: 'primary', order: 1 },
        { label: 'Contact Us', url: '/contact', style: 'secondary', order: 2 },
      ],
    };
  }
}

export default async function HomePage() {
  const latestServices = await getLatestServices();
  const portfolioImages = await getPortfolioImages();
  const siteSettings = await getSiteSettings();

  // Fallback images if no portfolio images exist
  const defaultImages = [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
  ];

  const displayImages = portfolioImages.length > 0 ? portfolioImages : defaultImages;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                {siteSettings.heroTitle || 'Professional Modeling Services'}
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                {siteSettings.heroSubtitle || 'Elevate your brand with experienced, versatile modeling for fashion, events, and content creation.'}
              </p>
              <Link
                href={siteSettings.heroButton?.url || '/services'}
                className="inline-block bg-accent text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
              >
                {siteSettings.heroButton?.label || 'Order Service'}
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                {siteSettings.heroImage ? (
                  <img
                    src={siteSettings.heroImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-8xl">👤</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {siteSettings.servicesTitle || 'Our Services'}
          </h2>
          
          {latestServices.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestServices.map((service) => (
                  <ServiceCard key={service._id} service={service} showActions={false} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/services"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  View All Services
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-8">
                {siteSettings.noServicesMessage || 'No services available yet. Check back soon!'}
              </p>
              <Link
                href={siteSettings.noServicesButtonUrl || '/contact'}
                className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
              >
                {siteSettings.noServicesButtonLabel || 'Contact Us'}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {siteSettings.portfolioTitle || 'Portfolio'}
          </h2>
          <Gallery images={displayImages} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            {siteSettings.ctaTitle || 'Ready to Work Together?'}
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            {siteSettings.ctaDescription || 'Let\'s create something amazing. Get in touch to discuss your project.'}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {siteSettings.ctaButtons && siteSettings.ctaButtons.length > 0 ? (
              siteSettings.ctaButtons
                .sort((a, b) => a.order - b.order)
                .map((button, index) => (
                  <Link
                    key={index}
                    href={button.url}
                    className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                      button.style === 'primary'
                        ? 'bg-accent text-gray-900 hover:bg-opacity-90'
                        : 'bg-white text-primary hover:bg-gray-100'
                    }`}
                  >
                    {button.label}
                  </Link>
                ))
            ) : (
              <>
                <Link
                  href="/services"
                  className="bg-accent text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  View Services
                </Link>
                <Link
                  href="/contact"
                  className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all"
                >
                  Contact Us
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

