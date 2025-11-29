import Link from 'next/link';

async function getSiteSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/settings`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

async function getAboutData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/about`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('Failed to fetch about data:', res.status);
      return null;
    }
    
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

export default async function AboutPage() {
  const [siteSettings, aboutData] = await Promise.all([
    getSiteSettings(),
    getAboutData(),
  ]);

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about page...</p>
          <p className="text-gray-500 text-sm mt-2">If this persists, please contact the administrator.</p>
        </div>
      </div>
    );
  }

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
