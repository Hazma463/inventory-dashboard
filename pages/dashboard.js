'use client';

import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { trpc } from '../utils/trpc';

// Import Layout directly since it's a core component
import Layout from '../components/layout/Layout';
import WarehouseForm from '../components/WarehouseForm';

// Dynamic imports for other components
const WarehouseCard = dynamic(() => import('../components/WarehouseCard'), {
  loading: () => <div className="animate-pulse bg-gray-800 rounded-lg h-32"></div>,
  ssr: false
});

const Charts = dynamic(() => import('../components/Charts'), {
  loading: () => <div className="animate-pulse bg-gray-800 rounded-lg h-32"></div>,
  ssr: false
});

const TestConnection = dynamic(() => import('../components/TestConnection'), {
  loading: () => <div className="animate-pulse bg-gray-800 rounded-lg h-32"></div>,
  ssr: false
});

export default function Dashboard() {
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  // Fetch warehouses from backend
  const { data: warehouses = [], isLoading, error: queryError } = trpc.inventory.getWarehouses.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
    onError: (error) => {
      console.error('🔴 Warehouse Query Error:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    },
  });

  const utils = trpc.useContext();

  // Mutations for warehouse
  const createWarehouse = trpc.inventory.createWarehouse.useMutation({
    onSuccess: (data) => {
      console.log('🟢 Warehouse created successfully:', data);
      utils.inventory.getWarehouses.invalidate();
      setShowWarehouseForm(false);
    },
    onError: (error) => {
      console.error('🔴 Error creating warehouse:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
  });

  const updateWarehouse = trpc.inventory.updateWarehouse.useMutation({
    onSuccess: (data) => {
      console.log('🟢 Warehouse updated successfully:', data);
      utils.inventory.getWarehouses.invalidate();
    },
    onError: (error) => {
      console.error('🔴 Error updating warehouse:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
  });

  const deleteWarehouse = trpc.inventory.deleteWarehouse.useMutation({
    onSuccess: (data) => {
      console.log('🟢 Warehouse deleted successfully:', data);
      utils.inventory.getWarehouses.invalidate();
    },
    onError: (error) => {
      console.error('🔴 Error deleting warehouse:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
  });

  // Mutations for inventory
  const createInventory = trpc.inventory.createInventory.useMutation({
    onSuccess: (data) => {
      console.log('🟢 Inventory created successfully:', data);
      utils.inventory.getWarehouses.invalidate();
    },
    onError: (error) => {
      console.error('🔴 Error creating inventory:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
  });

  const updateInventory = trpc.inventory.updateInventory.useMutation({
    onSuccess: (data) => {
      console.log('🟢 Inventory updated successfully:', data);
      utils.inventory.getWarehouses.invalidate();
    },
    onError: (error) => {
      console.error('🔴 Error updating inventory:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
  });

  const deleteInventory = trpc.inventory.deleteInventory.useMutation({
    onSuccess: (data) => {
      console.log('🟢 Inventory deleted successfully:', data);
      utils.inventory.getWarehouses.invalidate();
    },
    onError: (error) => {
      console.error('🔴 Error deleting inventory:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
  });

  // Handlers for warehouse
  const handleAddWarehouse = async (data) => {
    try {
      console.log('🔵 Adding warehouse with data:', data);
      if (!data || !data.name || !data.location) {
        throw new Error('Name and location are required');
      }
      
      // Ensure we're sending a properly structured object
      const input = {
        name: data.name.trim(),
        location: data.location.trim()
      };
      
      console.log('🔵 Sending mutation with input:', input);
      const result = await createWarehouse.mutateAsync(input);
      console.log('🟢 Warehouse added successfully:', result);
    } catch (error) {
      console.error('🔴 Error in handleAddWarehouse:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        input: data,
      });
    }
  };

  const handleEditWarehouse = async (data) => {
    try {
      console.log('🔵 Editing warehouse with data:', data);
      const result = await updateWarehouse.mutateAsync(data);
      console.log('🟢 Warehouse edited successfully:', result);
      setEditingWarehouse(null);
    } catch (error) {
      console.error('🔴 Error in handleEditWarehouse:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        input: data,
      });
    }
  };

  const handleDeleteWarehouse = async (id) => {
    try {
      console.log('🔵 Deleting warehouse with id:', id);
      const result = await deleteWarehouse.mutateAsync({ id });
      console.log('🟢 Warehouse deleted successfully:', result);
    } catch (error) {
      console.error('🔴 Error in handleDeleteWarehouse:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        input: { id },
      });
    }
  };

  // Handlers for inventory
  const handleAddInventory = async (warehouseId, data) => {
    try {
      console.log('🔵 Adding inventory with data:', { warehouseId, ...data });
      const result = await createInventory.mutateAsync({
        warehouseId,
        ...data
      });
      console.log('🟢 Inventory added successfully:', result);
    } catch (error) {
      console.error('🔴 Error in handleAddInventory:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        input: { warehouseId, ...data },
      });
    }
  };

  const handleEditInventory = async (warehouseId, data) => {
    try {
      console.log('🔵 Editing inventory with data:', { ...data, warehouseId });
      const result = await updateInventory.mutateAsync({
        ...data,
        warehouseId
      });
      console.log('🟢 Inventory edited successfully:', result);
    } catch (error) {
      console.error('🔴 Error in handleEditInventory:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        input: { ...data, warehouseId },
      });
    }
  };

  const handleDeleteInventory = async (warehouseId, inventoryId) => {
    try {
      console.log('🔵 Deleting inventory with id:', inventoryId);
      const result = await deleteInventory.mutateAsync({ id: inventoryId });
      console.log('🟢 Inventory deleted successfully:', result);
    } catch (error) {
      console.error('🔴 Error in handleDeleteInventory:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        input: { id: inventoryId },
      });
    }
  };

  if (queryError) {
    console.error('🔴 Error fetching warehouses:', {
      error: queryError,
      message: queryError.message,
      code: queryError.code,
      stack: queryError.stack,
    });
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Head>
          <title>Inventory Management System</title>
          <meta name="description" content="Inventory Management System" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="text-gray-100">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-3xl font-bold">Inventory Management</h1>
          </div>

          <TestConnection />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {warehouses.length > 0 && <Charts warehouses={warehouses} />}
              {/* Add Warehouse Button */}
              <div className="mb-6">
                {showWarehouseForm ? (
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Add New Warehouse</h2>
                    <WarehouseForm onSubmit={handleAddWarehouse} />
                    <button 
                      onClick={() => setShowWarehouseForm(false)} 
                      className="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowWarehouseForm(true)} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors duration-200"
                  >
                    Add Warehouse
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-6">
                {warehouses.map((warehouse) => (
                  <WarehouseCard
                    key={warehouse.id}
                    warehouse={warehouse}
                    onEdit={setEditingWarehouse}
                    onDelete={handleDeleteWarehouse}
                    onAddInventory={handleAddInventory}
                    onEditInventory={handleEditInventory}
                    onDeleteInventory={handleDeleteInventory}
                  />
                ))}
              </div>
              {editingWarehouse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                    <h2 className="text-xl font-semibold mb-4">Edit Warehouse</h2>
                    <WarehouseForm onSubmit={handleEditWarehouse} initialData={editingWarehouse} />
                    <button 
                      onClick={() => setEditingWarehouse(null)} 
                      className="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </Layout>
  );
} 