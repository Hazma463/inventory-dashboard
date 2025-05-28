'use client';

import { trpc } from '../utils/trpc';

export default function TestConnection() {
  const { data, isLoading, error } = trpc.inventory.getWarehouses.useQuery(undefined, {
    retry: false,
    onError: (error) => {
      console.error('Database connection error:', error);
    },
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Database Connection Test</h2>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-yellow-800">🔄 Testing connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Database Connection Test</h2>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-800">❌ Error: {error.message}</p>
          <p className="text-sm text-red-600 mt-2">
            Please check your database connection and environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Database Connection Test</h2>
      <div className="bg-green-100 p-4 rounded">
        <p className="text-green-800">✅ Successfully connected to database!</p>
        <p className="text-sm text-gray-600 mt-2">
          Found {data?.length || 0} warehouses
        </p>
      </div>
    </div>
  );
} 