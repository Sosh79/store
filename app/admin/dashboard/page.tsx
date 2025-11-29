'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [servicesRes, ordersRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/orders'),
        ]);

        const servicesData = await servicesRes.json();
        const ordersData = await ordersRes.json();

        if (servicesData.success && ordersData.success) {
          const pendingCount = ordersData.data.filter(
            (order: { status: string }) => order.status === 'pending'
          ).length;

          setStats({
            totalServices: servicesData.data.length,
            totalOrders: ordersData.data.length,
            pendingOrders: pendingCount,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your site.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-700 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{isLoading ? '...' : stats.totalServices}</p>
              </div>
              <h3 className="text-sm font-medium opacity-90">Total Services</h3>
              <Link href="/admin/services" className="text-xs mt-2 inline-block opacity-90 hover:opacity-100">
                View all →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-700 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{isLoading ? '...' : stats.totalOrders}</p>
              </div>
              <h3 className="text-sm font-medium opacity-90">Total Orders</h3>
              <Link href="/admin/orders" className="text-xs mt-2 inline-block opacity-90 hover:opacity-100">
                View all →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-700 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{isLoading ? '...' : stats.pendingOrders}</p>
              </div>
              <h3 className="text-sm font-medium opacity-90">Pending Orders</h3>
              <Link href="/admin/orders?filter=pending" className="text-xs mt-2 inline-block opacity-90 hover:opacity-100">
                View pending →
              </Link>
            </div>
          </div>

          {/* Content Management */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Management</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/services"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Services</h3>
                <p className="text-sm text-gray-600">Manage your services</p>
              </Link>

              <Link
                href="/admin/orders"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Orders</h3>
                <p className="text-sm text-gray-600">View customer orders</p>
              </Link>

              <Link
                href="/admin/portfolio"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Portfolio</h3>
                <p className="text-sm text-gray-600">Manage gallery images</p>
              </Link>

              <Link
                href="/admin/about"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">About Page</h3>
                <p className="text-sm text-gray-600">Edit your profile & story</p>
              </Link>

              <Link
                href="/admin/contact"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                    <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Contact Info</h3>
                <p className="text-sm text-gray-600">Manage contact & social</p>
              </Link>
            </div>
          </div>

          {/* Settings - Separate */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Site Settings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/settings"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Page Settings</h3>
                <p className="text-sm text-gray-600">Hero & Services pages</p>
              </Link>

              <Link
                href="/admin/users"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Admin Users</h3>
                <p className="text-sm text-gray-600">Manage admin accounts</p>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/services/add"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Add Service</h3>
                    <p className="text-sm text-gray-600">Create new service</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/portfolio/add"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-pink-500 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Add Portfolio Image</h3>
                    <p className="text-sm text-gray-600">Upload to gallery</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/register"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Add Admin</h3>
                    <p className="text-sm text-gray-600">Create admin account</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Footer Link */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">View Your Website</h3>
                <p className="text-sm opacity-90">See how your site looks to visitors</p>
              </div>
              <Link
                href="/"
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Visit Site →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
