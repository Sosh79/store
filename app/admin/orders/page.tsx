'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { IOrder } from '@/models/Order';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Service Orders</h1>
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium mt-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 bg-white rounded-lg shadow-md p-2 flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({statusCounts.completed})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({statusCounts.cancelled})
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600">
                {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {order.serviceName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order ID: {order._id}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-gray-600">
                        <p>
                          <span className="font-medium">Name:</span> {order.fullName}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> {order.email}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span> {order.phone}
                        </p>
                        <p>
                          <span className="font-medium">Address:</span>{' '}
                          {order.address}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Order Details
                      </h4>
                      <div className="space-y-2 text-gray-600">
                        <p>
                          <span className="font-medium">Service ID:</span>{' '}
                          {order.serviceId}
                        </p>
                        <p>
                          <span className="font-medium">Submitted:</span>{' '}
                          {formatDate(order.createdAt?.toString())}
                        </p>
                        {order.notes && (
                          <div>
                            <span className="font-medium">Notes:</span>
                            <p className="mt-1 text-sm bg-gray-50 p-3 rounded">
                              {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status === 'pending' && (
                    <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3 flex-wrap">
                      <button
                        onClick={() => updateOrderStatus(order._id!, 'completed')}
                        disabled={updatingOrderId === order._id}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingOrderId === order._id ? 'Updating...' : 'Mark as Completed'}
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id!, 'cancelled')}
                        disabled={updatingOrderId === order._id}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingOrderId === order._id ? 'Updating...' : 'Cancel Order'}
                      </button>
                    </div>
                  )}

                  {order.status === 'completed' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Order completed successfully</span>
                      </div>
                    </div>
                  )}

                  {order.status === 'cancelled' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-red-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Order cancelled</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
