import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';

const defaultFormData = {
  orderNo: '',
  orderDate: '',
  customerName: '',
  correspondenceAddress: '',
  city: '',
  state: '',
  shippingAddress: '',
  itemName: '',
  hsnCode: '',
  packing: '',
  quantity: '',
  totalQuantity: '',
  taxPercent: '',
  taxAmt: '',
  rate: '',
  amount: '',
  netPayable: ''
};

export default function InventoryForm({ onSubmit, initialData = defaultFormData }) {
  const [formData, setFormData] = useState(initialData);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrImage, setOcrImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // tRPC OCR mutation
  const processDocument = trpc.ocr.processDocument.useMutation({
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, ...data }));
    },
    onError: (error) => {
      alert('Failed to process document: ' + error.message);
    },
    onSettled: () => {
      setOcrLoading(false);
    }
  });

  useEffect(() => {
    setFormData(prev => ({
      ...defaultFormData,
      ...initialData,
      ...prev
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Handling change for:', name, 'New value:', value);
    setFormData(prev => {
      const newData = {
      ...prev,
        [name]: value || ''
      };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSubmit(formData);
    // Don't reset the form data here - let the parent component handle it
  };

  const processFile = async (file) => {
    try {
      setIsLoading(true);
      setError(null);

      // Use tRPC mutation instead of direct fetch
      const result = await processDocument.mutateAsync({ file });
      
      console.log('OCR Result:', result);
      
      if (result) {
        setFormData(prev => ({
          ...prev,
          ...result
        }));
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message || 'Failed to process file');
      // Show error to user
      alert(`Error: ${error.message || 'Failed to process file'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileType = file.type;
    if (fileType === 'application/pdf') {
      setFileType('pdf');
      setOcrImage(null);
      setImageFile(file);
      processFile(file);
    } else if (fileType.startsWith('image/')) {
      setFileType('image');
      setOcrImage(URL.createObjectURL(file));
      setImageFile(file);
      processFile(file);
    } else {
      alert('Please upload a PDF or image file');
    }
  };

  // Add a useEffect to log form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-2xl shadow-xl max-h-[70vh] overflow-y-auto border border-gray-700">
      <div>
        <label className="block text-base font-semibold text-gray-200 mb-2 tracking-wide">Document Processing</label>
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => document.getElementById('fileInput').click()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload Document
          </button>
          <input 
            id="fileInput"
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileInput} 
            className="hidden"
          />
        </div>

        {ocrImage && fileType === 'image' && (
          <div className="mb-4 flex flex-col items-center">
            <img src={ocrImage} alt="Document Preview" className="max-h-48 rounded-xl shadow-lg mb-3 border border-gray-300" />
            <button
              type="button"
              onClick={() => processFile(imageFile)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Process Document'}
            </button>
          </div>
        )}

        {fileType === 'pdf' && (
          <div className="mb-4 flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-xl mb-3 border border-gray-300">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-gray-600 mb-3">PDF Document Selected</span>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-blue-600 text-base font-semibold tracking-wide">Processing document...</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Order No</label>
          <input
            type="text"
            name="orderNo"
            value={formData.orderNo || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Order Date</label>
          <input
            type="text"
            name="orderDate"
            value={formData.orderDate || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Correspondence Address</label>
          <input
            type="text"
            name="correspondenceAddress"
            value={formData.correspondenceAddress || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">City</label>
          <input
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">State</label>
          <input
            type="text"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Shipping Address</label>
          <input
            type="text"
            name="shippingAddress"
            value={formData.shippingAddress || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Item Name</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">HSN Code</label>
          <input
            type="text"
            name="hsnCode"
            value={formData.hsnCode || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Packing</label>
          <input
            type="text"
            name="packing"
            value={formData.packing || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Quantity</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Total Quantity</label>
          <input
            type="text"
            name="totalQuantity"
            value={formData.totalQuantity || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Tax Percent</label>
          <input
            type="text"
            name="taxPercent"
            value={formData.taxPercent || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Tax Amount</label>
          <input
            type="text"
            name="taxAmt"
            value={formData.taxAmt || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Rate</label>
          <input
            type="text"
            name="rate"
            value={formData.rate || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Amount</label>
          <input
            type="text"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Net Payable</label>
          <input
            type="text"
            name="netPayable"
            value={formData.netPayable || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 active:scale-95 font-bold text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500">
        Submit
      </button>
    </form>
  );
} 