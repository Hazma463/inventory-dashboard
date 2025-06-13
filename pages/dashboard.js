'use client';

import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { trpc } from '../utils/trpc';

// Dynamic import for Layout to prevent hydration issues
const Layout = dynamic(() => import('../components/layout/Layout'), {
  loading: () => <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-white">Loading...</div>
  </div>,
  ssr: false
});
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
  const { data: warehousesData, isLoading, error: queryError } = trpc.inventory.getWarehouses.useQuery(undefined, {
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

  // Ensure warehouses is always an array
  const warehouses = Array.isArray(warehousesData) ? warehousesData : [];
  
  // Log for debugging
  console.log('🔵 Warehouses data:', { warehousesData, warehouses, isLoading, queryError });

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

  // Test function to bypass tRPC
  const testDirectAPI = async (data) => {
    console.log('🔵 Testing direct API call with data:', data);
    try {
      const response = await fetch('/api/test-warehouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log('🟢 Direct API response:', result);
      alert(`Direct API test successful: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error('🔴 Direct API test failed:', error);
      alert(`Direct API test failed: ${error.message}`);
    }
  };

  // Handlers for warehouse
  const handleAddWarehouse = async (data) => {
    console.log('🔵 handleAddWarehouse function called');
    console.log('🔵 Function arguments:', arguments);
    console.log('🔵 Data parameter:', data);
    
    try {
      console.log('🔵 handleAddWarehouse called');
      console.log('🔵 Raw data received:', data);
      console.log('🔵 Data type:', typeof data);
      console.log('🔵 Data stringified:', JSON.stringify(data));
      console.log('🔵 Data properties:', Object.keys(data || {}));
      console.log('🔵 Data is object:', typeof data === 'object' && data !== null);
      console.log('🔵 Data instanceof Object:', data instanceof Object);
      
      if (!data) {
        console.error('🔴 Data is null or undefined');
        throw new Error('Data is required');
      }
      
      if (typeof data !== 'object') {
        console.error('🔴 Data is not an object, type:', typeof data);
        throw new Error('Data must be an object');
      }
      
      if (!data.name || !data.location) {
        console.error('🔴 Missing required fields:', { name: data.name, location: data.location });
        throw new Error('Name and location are required');
      }
      
      // Ensure we're sending a properly structured object
      const input = {
        name: String(data.name).trim(),
        location: String(data.location).trim()
      };
      
      console.log('🔵 Prepared input for mutation:', input);
      console.log('🔵 Input type:', typeof input);
      console.log('🔵 Input stringified:', JSON.stringify(input));
      console.log('🔵 Input validation - name:', input.name, 'location:', input.location);
      console.log('🔵 createWarehouse mutation function:', typeof createWarehouse.mutateAsync);
      console.log('🔵 Calling createWarehouse.mutateAsync...');
      
      const result = await createWarehouse.mutateAsync(input);
      console.log('🟢 Warehouse added successfully:', result);
    } catch (error) {
      console.error('🔴 Error in handleAddWarehouse:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        input: data,
        errorType: typeof error,
      });
      alert(`Error creating warehouse: ${error.message}`);
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
      console.log('🔵 Data type check:', typeof data, 'warehouseId type:', typeof warehouseId);
      
      // Validate input data
      if (!data) {
        throw new Error('Inventory data is required');
      }
      
      if (!warehouseId) {
        throw new Error('Warehouse ID is required');
      }
      
      // Ensure we have a proper object, not a string
      let parsedData = data;
      if (typeof data === 'string') {
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          throw new Error('Invalid data format');
        }
      }
      
      // Ensure all required fields are present and properly typed
      const inventoryData = {
        warehouseId: Number(warehouseId),
        orderNo: String(parsedData.orderNo || ''),
        orderDate: String(parsedData.orderDate || ''),
        customerName: String(parsedData.customerName || ''),
        correspondenceAddress: String(parsedData.correspondenceAddress || ''),
        city: String(parsedData.city || ''),
        state: String(parsedData.state || ''),
        shippingAddress: String(parsedData.shippingAddress || ''),
        itemName: String(parsedData.itemName || ''),
        hsnCode: String(parsedData.hsnCode || ''),
        packing: String(parsedData.packing || ''),
        quantity: String(parsedData.quantity || ''),
        totalQuantity: String(parsedData.totalQuantity || ''),
        taxPercent: String(parsedData.taxPercent || ''),
        taxAmt: String(parsedData.taxAmt || ''),
        rate: String(parsedData.rate || ''),
        amount: String(parsedData.amount || ''),
        netPayable: String(parsedData.netPayable || '')
      };
      
      console.log('🔵 Sending cleaned inventory data:', inventoryData);
      console.log('🔵 Final data type check:', typeof inventoryData);
      
      const result = await createInventory.mutateAsync(inventoryData);
      console.log('🟢 Inventory added successfully:', result);
    } catch (error) {
      console.error('🔴 Error in handleAddInventory:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        input: { warehouseId, data },
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
          ) : queryError ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Data</div>
                <div className="text-gray-400 mb-4">{queryError.message}</div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {warehouses.length > 0 && <Charts warehouses={warehouses} />}
              {/* Add Warehouse Button */}
              <div className="mb-6">
                {showWarehouseForm ? (
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Add New Warehouse</h2>
                    <WarehouseForm onSubmit={handleAddWarehouse} onTestDirect={testDirectAPI} />
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
                {warehouses && warehouses.length > 0 ? (
                  warehouses.map((warehouse) => (
                    <WarehouseCard
                      key={warehouse.id}
                      warehouse={warehouse}
                      onEdit={setEditingWarehouse}
                      onDelete={handleDeleteWarehouse}
                      onAddInventory={handleAddInventory}
                      onEditInventory={handleEditInventory}
                      onDeleteInventory={handleDeleteInventory}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-xl mb-2">📦 No warehouses found</div>
                    <div>Click "Add Warehouse" to get started</div>
                  </div>
                )}
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