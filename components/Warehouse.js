import { trpc } from '../utils/trpc';
import { useState } from 'react';

export default function Warehouse() {
  const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '' });
  
  // Query to get warehouses
  const { data: warehouses, isLoading } = trpc.inventory.getWarehouses.useQuery();
  
  // Mutation to create warehouse
  const createWarehouse = trpc.inventory.createWarehouse.useMutation({
    onSuccess: () => {
      // Refetch warehouses after creating new one
      utils.inventory.getWarehouses.invalidate();
    },
  });

  const utils = trpc.useContext();

  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    try {
      await createWarehouse.mutateAsync(newWarehouse);
      setNewWarehouse({ name: '', location: '' });
    } catch (error) {
      console.error('Failed to create warehouse:', error);
    }
  };

  if (isLoading) return <div>Loading warehouses...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Warehouses</h2>
      
      {/* Create Warehouse Form */}
      <form onSubmit={handleCreateWarehouse} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Warehouse Name"
            value={newWarehouse.name}
            onChange={(e) => setNewWarehouse(prev => ({ ...prev, name: e.target.value }))}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={newWarehouse.location}
            onChange={(e) => setNewWarehouse(prev => ({ ...prev, location: e.target.value }))}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Warehouse
          </button>
        </div>
      </form>

      {/* Warehouses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses?.map((warehouse) => (
          <div key={warehouse.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{warehouse.name}</h3>
            <p className="text-gray-600">{warehouse.location}</p>
            <p className="text-sm text-gray-500">
              Items: {warehouse.inventory.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 