import { useState } from 'react';

export default function WarehouseForm({ onSubmit, initialData = { name: '', location: '' } }) {
  const [name, setName] = useState(initialData.name || '');
  const [location, setLocation] = useState(initialData.location || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) {
      console.error('Name and location are required');
      return;
    }
    onSubmit({
      name: name.trim(),
      location: location.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Warehouse Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData.id ? 'Update Warehouse' : 'Add Warehouse'}
        </button>
      </div>
    </form>
  );
} 