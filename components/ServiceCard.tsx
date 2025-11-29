'use client';

import Link from 'next/link';
import { IService } from '@/models/Service';
import { useState } from 'react';

interface ServiceCardProps {
  service: IService;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export default function ServiceCard({ service, showActions = false, onDelete }: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {service.images && service.images.length > 0 && !imageError && (
        <div className="h-48 bg-secondary flex items-center justify-center">
          <img
            src={service.images[0]}
            alt={service.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">${service.price}</span>
        </div>
        
        {showActions ? (
          <div className="flex gap-2">
            <Link
              href={`/admin/services/edit/${service._id}`}
              className="flex-1 bg-secondary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-center"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete && service._id && onDelete(service._id)}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link
            href={`/request-service?serviceId=${service._id}`}
            className="block w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-center"
          >
            Request Service
          </Link>
        )}
      </div>
    </div>
  );
}
