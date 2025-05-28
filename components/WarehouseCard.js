import { useState } from 'react';
import InventoryForm from './InventoryForm';

export default function WarehouseCard({ 
  warehouse, 
  onEdit, 
  onDelete, 
  onAddInventory, 
  onEditInventory, 
  onDeleteInventory 
}) {
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);

  const handleAddInventory = (data) => {
    onAddInventory(warehouse.id, data);
    setShowInventoryForm(false);
  };

  const handleEditInventory = (data) => {
    onEditInventory(warehouse.id, data);
    setEditingInventory(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {/* Warehouse Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">{warehouse.name}</h2>
            <p className="text-gray-400">{warehouse.location}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInventoryForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Add Inventory
            </button>
            <button
              onClick={() => onEdit(warehouse)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Edit Warehouse
            </button>
            <button
              onClick={() => onDelete(warehouse.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Delete Warehouse
            </button>
          </div>
        </div>
      </div>

      {/* Add Inventory Form */}
      {showInventoryForm && (
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Add New Inventory Item</h3>
          <InventoryForm 
            onSubmit={handleAddInventory}
          />
          <button 
            onClick={() => setShowInventoryForm(false)} 
            className="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Edit Inventory Form */}
      {editingInventory && (
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Edit Inventory Item</h3>
          <InventoryForm 
            initialData={editingInventory}
            onSubmit={handleEditInventory}
          />
          <button 
            onClick={() => setEditingInventory(null)} 
            className="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Inventory Table */}
      {warehouse.inventory && warehouse.inventory.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Correspondence Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Shipping Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">HSN Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Packaging</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tax %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tax Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Net Payable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {warehouse.inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.orderNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.orderDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.correspondenceAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.shippingAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.hsnCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.packing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.totalQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.taxPercent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item.taxAmt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item.netPayable}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => setEditingInventory(item)}
                      className="text-indigo-400 hover:text-indigo-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteInventory(warehouse.id, item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 