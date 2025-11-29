'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConfirmDialog from '@/components/ConfirmDialog';
import { IPortfolio } from '@/models/Portfolio';

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [portfolioImages, setPortfolioImages] = useState<IPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    imageId: string | null;
    imageName: string;
  }>({ isOpen: false, imageId: null, imageName: '' });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      if (data.success) {
        setPortfolioImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const image = portfolioImages.find(img => img._id === id);
    setConfirmDialog({
      isOpen: true,
      imageId: id,
      imageName: image?.title || image?.imageUrl || 'this image'
    });
  };

  const confirmDelete = async () => {
    const id = confirmDialog.imageId;
    if (!id) return;

    setConfirmDialog({ isOpen: false, imageId: null, imageName: '' });
    setDeletingId(id);
    
    // Add fade out animation
    const element = document.getElementById(`portfolio-${id}`);
    if (element) {
      element.style.transition = 'all 0.5s ease-out';
      element.style.opacity = '0';
      element.style.transform = 'translateY(-20px) scale(0.9)';
    }

    // Wait for animation before making API call
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setPortfolioImages(portfolioImages.filter(img => img._id !== id));
      } else {
        alert('Failed to delete image');
        // Reset animation if failed
        if (element) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) scale(1)';
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
      // Reset animation if failed
      if (element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Portfolio Gallery</h1>
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium mt-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <button
              onClick={() => router.push('/admin/portfolio/add')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
            >
              Add New Image
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading portfolio...</p>
            </div>
          ) : portfolioImages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">No portfolio images yet</p>
              <button
                onClick={() => router.push('/admin/portfolio/add')}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
              >
                Add Your First Image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {portfolioImages.map((image) => (
                <div
                  key={image._id}
                  id={`portfolio-${image._id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-64 bg-gray-200">
                    <img
                      src={image.imageUrl}
                      alt={image.title || 'Portfolio image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    {image.title && (
                      <h3 className="font-bold text-gray-900 mb-1">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                    )}
                    <button
                      onClick={() => handleDelete(image._id!)}
                      disabled={deletingId === image._id}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === image._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Portfolio Image"
        message="Are you sure you want to delete this image from your portfolio?"
        itemName={confirmDialog.imageName}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, imageId: null, imageName: '' })}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </ProtectedRoute>
  );
}
