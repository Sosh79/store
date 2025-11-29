'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import { IService } from '@/models/Service';

interface PageSettings {
  headerTitle: string;
  headerSubtitle: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    headerTitle: 'Our Services',
    headerSubtitle: 'Professional modeling services tailored to your needs',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, settingsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/settings'),
        ]);
        
        const servicesData = await servicesRes.json();
        const settingsData = await settingsRes.json();
        
        if (servicesData.success) {
          setServices(servicesData.data);
        }
        
        if (settingsData.success) {
          setPageSettings({
            headerTitle: settingsData.data.servicesPageTitle || 'Our Services',
            headerSubtitle: settingsData.data.servicesPageSubtitle || 'Professional modeling services tailored to your needs',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{pageSettings.headerTitle}</h1>
          <p className="text-xl text-gray-100 mb-6">
            {pageSettings.headerSubtitle}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">
                No services available at the moment
              </p>
              <Link
                href="/contact"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Contact Us
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>

              {/* CTA Section */}
              <div className="bg-primary text-white rounded-lg p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Need a Custom Package?
                </h2>
                <p className="text-xl mb-6 text-gray-100">
                  Contact us to discuss your specific requirements and get a
                  personalized quote
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-accent text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
