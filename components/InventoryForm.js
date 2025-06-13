'use client';

import React, { useState } from 'react';

export default function BillUploadForm() {
  const [formData, setFormData] = useState({
    vendor: '',
    billDate: '',
    billNumber: '',
    materialName: '',
    quantity: '',
    rate: '',
    amount: '',
    netPayable: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace with actual logic (API call, state update, etc.)
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-white">Upload Bill Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300">Vendor</label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Bill Date</label>
        <input
          type="date"
          name="billDate"
          value={formData.billDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Bill Number</label>
        <input
          type="text"
          name="billNumber"
          value={formData.billNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Material Name</label>
        <input
          type="text"
          name="materialName"
          value={formData.materialName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Rate</label>
        <input
          type="number"
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Net Payable</label>
        <input
          type="number"
          name="netPayable"
          value={formData.netPayable}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold tracking-wide"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
