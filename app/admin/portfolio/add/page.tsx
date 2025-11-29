'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AddPortfolioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    description: '',
    order: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const handleAddUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out empty URLs
      const validUrls = imageUrls.filter(url => url.trim() !== '');

      if (validUrls.length === 0) {
        alert('Please enter at least one image URL');
        setIsLoading(false);
        return;
      }

      // Create multiple portfolio entries
      const promises = validUrls.map((url, index) =>
        fetch('/api/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: url,
            title: formData.title || undefined,
            description: formData.description || undefined,
            order: formData.order + index,
          }),
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));

      const allSuccessful = results.every(r => r.success);

      if (allSuccessful) {
        alert(`Successfully added ${validUrls.length} image(s)`);
        router.push('/admin/portfolio');
      } else {
        alert('Some images failed to upload. Please try again.');
      }
    } catch (error) {
      console.error('Error creating portfolio images:', error);
      alert('Error adding images');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Add Portfolio Images</h1>
            <Link
              href="/admin/portfolio"
              className="text-gray-600 hover:text-gray-900 font-medium mt-2 inline-block"
            >
              ← Back to Portfolio
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  placeholder="e.g., Fashion Campaign 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  placeholder="Brief description of the images..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Lower numbers appear first (0 = highest priority)
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image URLs *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="text-primary hover:text-secondary font-semibold text-sm"
                  >
                    + Add Another URL
                  </button>
                </div>

                <div className="space-y-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                        placeholder="https://example.com/image.jpg"
                        required={index === 0}
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUrl(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Add direct image URLs (e.g., from Imgur, Cloudinary, or your own hosting)
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : `Add ${imageUrls.filter(u => u.trim()).length} Image(s)`}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
