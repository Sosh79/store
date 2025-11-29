import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import About from '@/models/About';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Default site settings
const defaultSiteSettings = {
  aboutPageTitle: 'About Me',
  aboutPageSubtitle: 'Professional Model & Content Creator',
};

// Default about data
const defaultAboutData = {
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
  storyTitle: 'My Story',
  storyContent: 'I am a professional model with years of experience in the fashion industry. My passion for modeling started at a young age, and I have worked with numerous brands and designers around the world.',
  experiences: [
    {
      year: '2020-Present',
      title: 'Professional Model',
      description: 'Working with international brands and fashion houses',
      order: 0,
    },
    {
      year: '2018-2020',
      title: 'Fashion Model',
      description: 'Runway and editorial modeling',
      order: 1,
    },
  ],
  skills: [
    { name: 'Runway Modeling', level: 95, order: 0 },
    { name: 'Photo Shoots', level: 90, order: 1 },
    { name: 'Commercial Modeling', level: 85, order: 2 },
  ],
};

async function getSiteSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne().lean();
    return settings || defaultSiteSettings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return defaultSiteSettings;
  }
}

async function getAboutData() {
  try {
    await dbConnect();
    const aboutData = await About.findOne().lean();
    
    // If data exists, return it
    if (aboutData) {
      return aboutData;
    }
    
    // If no about data exists, try to create default
    try {
      const newAbout = await About.create(defaultAboutData);
      return newAbout.toObject();
    } catch (createError) {
      console.log('Could not create about data, using defaults:', createError);
      return defaultAboutData;
    }
  } catch (error) {
    console.error('Error fetching about data:', error);
    return defaultAboutData;
  }
}

export default async function AboutPage() {
  const [siteSettings, aboutData] = await Promise.all([
    getSiteSettings(),
    getAboutData(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center mb-4">
            {siteSettings?.aboutPageTitle || 'About Me'}
          </h1>
          <p className="text-xl text-center text-gray-100">
            {siteSettings?.aboutPageSubtitle || 'Professional Model & Content Creator'}
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">{aboutData.storyTitle}</h2>
              <div className="text-lg text-gray-700 mb-6 whitespace-pre-line">
                {aboutData.storyContent}
              </div>
              <Link
                href="/contact"
                className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              >
                Get In Touch
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={aboutData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Experience
          </h2>
          <div className="space-y-8 max-w-3xl mx-auto">
            {aboutData.experiences
              .sort((a: any, b: any) => a.order - b.order)
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className="border-l-4 border-primary pl-8 pb-8 relative"
                >
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px] top-0"></div>
                  <span className="text-accent font-bold text-lg">{item.year}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Skills & Expertise
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {aboutData.skills
              .sort((a: any, b: any) => a.order - b.order)
              .map((skill: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-900">{skill.name}</span>
                    <span className="text-sm font-medium text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Let's Collaborate</h2>
          <p className="text-xl mb-8 text-gray-100">
            Interested in working together? I'd love to hear about your project.
          </p>
          <Link
            href="/services"
            className="inline-block bg-accent text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
          >
            View My Services
          </Link>
        </div>
      </section>
    </div>
  );
}
