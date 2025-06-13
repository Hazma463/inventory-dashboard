import { useState } from 'react';

export default function WarehouseForm({ onSubmit, initialData = { name: '', location: '' }, onTestDirect }) {
  const [name, setName] = useState(initialData.name || '');
  const [location, setLocation] = useState(initialData.location || '');

  console.log('🔵 WarehouseForm rendered with:', { name, location, initialData });

  const handleNameChange = (e) => {
    console.log('🔵 Name changing from:', name, 'to:', e.target.value);
    setName(e.target.value);
  };

  const handleLocationChange = (e) => {
    console.log('🔵 Location changing from:', location, 'to:', e.target.value);
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    console.log('🔵 Form submit event triggered');
    e.preventDefault();
    
    try {
      console.log('🔵 WarehouseForm handleSubmit called');
      console.log('🔵 Current name state:', name);
      console.log('🔵 Current location state:', location);
      console.log('🔵 Name type:', typeof name);
      console.log('🔵 Location type:', typeof location);
      console.log('🔵 Name length:', name?.length);
      console.log('🔵 Location length:', location?.length);
      
      if (!name || !location) {
        console.error('🔴 Name and location are required', { name, location });
        alert('Please fill in both name and location fields');
        return;
      }
      
      const formData = {
        name: String(name).trim(),
        location: String(location).trim()
      };
      
      console.log('🔵 Submitting form data:', formData);
      console.log('🔵 Form data stringified:', JSON.stringify(formData));
      console.log('🔵 Calling onSubmit with formData...');
      
      if (typeof onSubmit !== 'function') {
        console.error('🔴 onSubmit is not a function:', typeof onSubmit);
        return;
      }
      
      onSubmit(formData);
      console.log('🔵 onSubmit called successfully');
      
    } catch (error) {
      console.error('🔴 Error in WarehouseForm handleSubmit:', error);
    }
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
            onChange={handleNameChange}
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
            onChange={handleLocationChange}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2"
        >
          {initialData.id ? 'Update Warehouse' : 'Add Warehouse'}
        </button>
        
        {onTestDirect && (
          <button
            type="button"
            onClick={() => {
              const formData = {
                name: String(name).trim(),
                location: String(location).trim()
              };
              onTestDirect(formData);
            }}
            className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Test Direct API (Bypass tRPC)
          </button>
        )}
      </div>
    </form>
  );
} 