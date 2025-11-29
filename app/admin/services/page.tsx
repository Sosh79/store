'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ServiceCard from '@/components/ServiceCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import { IService } from '@/models/Service';

export default function AdminServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    serviceId: string | null;
    serviceName: string;
  }>({ isOpen: false, serviceId: null, serviceName: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const service = services.find(s => s._id === id);
    setConfirmDialog({
      isOpen: true,
      serviceId: id,
      serviceName: service?.name || 'this service'
    });
  };

  const confirmDelete = async () => {
    const id = confirmDialog.serviceId;
    if (!id) return;

    setConfirmDialog({ isOpen: false, serviceId: null, serviceName: '' });

    // Add fade out animation
    const element = document.getElementById(`service-${id}`);
    if (element) {
      element.style.transition = 'all 0.5s ease-out';
      element.style.opacity = '0';
      element.style.transform = 'scale(0.8)';
    }

    // Wait for animation before making API call
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(services.filter((service) => service._id !== id));
      } else {
        alert('Failed to delete service');
        // Reset animation if failed
        if (element) {
          element.style.opacity = '1';
          element.style.transform = 'scale(1)';
        }
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('An error occurred');
      // Reset animation if failed
      if (element) {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Manage Services</h1>
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium mt-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <Link
              href="/admin/services/add"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
            >
              + Add Service
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">No services found</p>
              <Link
                href="/admin/services/add"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Add Your First Service
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service._id} id={`service-${service._id}`}>
                  <ServiceCard
                    service={service}
                    showActions={true}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        itemName={confirmDialog.serviceName}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, serviceId: null, serviceName: '' })}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </ProtectedRoute>
  );
}
