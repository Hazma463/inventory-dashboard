import { useState } from 'react';
import { useRouter } from 'next/router';

export default function WarehouseList({ warehouses, onDeleteWarehouse }) {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDeleteWarehouse(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      {warehouses.map(warehouse => (
        <div key={warehouse.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{warehouse.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/warehouse/${warehouse.id}`)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View
              </button>
              <button
                onClick={() => handleDeleteClick(warehouse.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Warehouse
              </button>
            </div>
          </div>
          {deleteConfirm === warehouse.id && (
            <div className="mt-2 p-2 bg-yellow-100 rounded">
              <p className="text-yellow-800">Are you sure you want to delete this warehouse?</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleConfirmDelete}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 