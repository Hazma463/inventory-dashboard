import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DATE_FILTERS = [
  { label: 'Past Month', value: 1 },
  { label: 'Past 3 Months', value: 3 },
  { label: 'Past 6 Months', value: 6 },
  { label: 'Past Year', value: 12 },
  { label: 'All Time', value: 'all' },
];

function filterByDate(items, months) {
  if (months === 'all') return items;
  const now = new Date();
  return items.filter(item => {
    const [day, month, year] = item.orderDate.split('/').map(Number);
    const itemDate = new Date(year, month - 1, day);
    const diffMonths = (now.getFullYear() - itemDate.getFullYear()) * 12 + (now.getMonth() - itemDate.getMonth());
    return diffMonths < months;
  });
}

export default function Charts({ warehouses }) {
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Get warehouse options
  const warehouseOptions = [
    { label: 'All Warehouses', value: 'all' },
    ...warehouses.map(w => ({ label: w.name, value: w.id }))
  ];

  // Filtered inventories
  let filteredWarehouses = warehouses;
  if (selectedWarehouse !== 'all') {
    filteredWarehouses = warehouses.filter(w => w.id === selectedWarehouse);
  }
  // Apply date filter
  filteredWarehouses = filteredWarehouses.map(w => ({
    ...w,
    inventory: filterByDate(w.inventory, dateFilter)
  }));

  // For 'All' warehouses, combine all inventories for some charts
  const allInventories = filteredWarehouses.flatMap(w => w.inventory);

  // Calculate total products
  const totalProducts = filteredWarehouses.reduce((total, warehouse) => {
    return total + warehouse.inventory.reduce((sum, item) => sum + Number(item.totalQuantity), 0);
  }, 0);

  // Most delivered product
  const productCounts = {};
  allInventories.forEach(item => {
    productCounts[item.itemName] = (productCounts[item.itemName] || 0) + Number(item.totalQuantity);
  });
  const mostDeliveredProduct = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Total revenue
  const totalRevenue = allInventories.reduce((sum, item) => sum + Number(item.netPayable), 0);

  // Most delivered location
  const locationCounts = {};
  allInventories.forEach(item => {
    locationCounts[item.shippingAddress] = (locationCounts[item.shippingAddress] || 0) + Number(item.totalQuantity);
  });
  const mostDeliveredLocation = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Pie: Net Payable per Customer (by customer name)
  let customerPayableMap = {};
  allInventories.forEach(item => {
    if (item.customerName) {
      customerPayableMap[item.customerName] = (customerPayableMap[item.customerName] || 0) + Number(item.netPayable);
    }
  });
  const customerNames = Object.keys(customerPayableMap);
  const customerPayables = Object.values(customerPayableMap);
  // Elegant dark color palette for charts
  const elegantDarkPalette = [
    '#22304A', // Deep Blue
    '#2C3E50', // Dark Slate
    '#3B3C36', // Charcoal
    '#4B2E39', // Muted Burgundy
    '#1B3B36', // Deep Teal
    '#2E2D88', // Deep Indigo
    '#3A4D39', // Forest Green
    '#4B3869', // Deep Purple
    '#2D3A3A', // Slate Teal
    '#3C2F2F', // Cocoa
    '#2C3539', // Gunmetal
    '#3E2723', // Dark Brown
    '#263238', // Blue Gray
    '#37474F', // Blue Gray Dark
    '#212121', // Almost Black
    '#424242', // Dark Gray
  ];
  const pieChartData = {
    labels: customerNames,
    datasets: [{
      data: customerPayables,
      backgroundColor: customerNames.map((_, i) => elegantDarkPalette[i % elegantDarkPalette.length]),
    }],
  };

  // Bar: Products Held per Warehouse (x: product names, y: quantity)
  let productNames = [];
  let productQuantities = [];
  if (selectedWarehouse === 'all') {
    // Show all products across all warehouses
    const productMap = {};
    allInventories.forEach(item => {
      productMap[item.itemName] = (productMap[item.itemName] || 0) + Number(item.totalQuantity);
    });
    productNames = Object.keys(productMap);
    productQuantities = Object.values(productMap);
  } else {
    const warehouse = filteredWarehouses[0];
    if (warehouse) {
      productNames = warehouse.inventory.map(item => item.itemName);
      productQuantities = warehouse.inventory.map(item => Number(item.totalQuantity));
    }
  }
  const barChartData = {
    labels: productNames,
    datasets: [{
      label: 'Quantity (kgs)',
      data: productQuantities,
      backgroundColor: productNames.map((_, i) => elegantDarkPalette[i % elegantDarkPalette.length]),
    }],
  };

  // Bar: Products Delivered to Locations (x: shipping address, y: quantity)
  const locationNames = Object.keys(locationCounts);
  const locationQuantities = Object.values(locationCounts);
  const locationBarChartData = {
    labels: locationNames,
    datasets: [{
      label: 'Quantity Delivered (kgs)',
      data: locationQuantities,
      backgroundColor: locationNames.map((_, i) => elegantDarkPalette[i % elegantDarkPalette.length]),
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#333',
        },
        ticks: {
          color: '#fff',
        },
        title: {
          display: true,
          text: '',
          color: '#fff',
        },
      },
      x: {
        grid: {
          color: '#333',
        },
        ticks: {
          color: '#fff',
        },
        title: {
          display: true,
          text: '',
          color: '#fff',
        },
      },
    },
  };

  return (
    <div className="mb-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="text-white font-semibold mr-2">Warehouse:</label>
          <select
            className="bg-gray-800 text-white rounded px-3 py-2"
            value={selectedWarehouse}
            onChange={e => setSelectedWarehouse(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            {warehouseOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-white font-semibold mr-2">Date Range:</label>
          <select
            className="bg-gray-800 text-white rounded px-3 py-2"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            {DATE_FILTERS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">Total Products</h3>
          <p className="text-2xl font-bold text-white">{totalProducts} kgs</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">Most Delivered Product</h3>
          <p className="text-xl font-bold text-white">{mostDeliveredProduct}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-white">₹{totalRevenue}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">Most Delivered Location</h3>
          <p className="text-xl font-bold text-white">{mostDeliveredLocation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-white mb-4">Net Payable per Customer</h3>
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-white mb-4">Products Held per Warehouse</h3>
          <div className="h-80">
            <Bar data={barChartData} options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                x: {
                  ...chartOptions.scales.x,
                  title: { ...chartOptions.scales.x.title, display: true, text: 'Product Name' },
                },
                y: {
                  ...chartOptions.scales.y,
                  title: { ...chartOptions.scales.y.title, display: true, text: 'Quantity (kgs)' },
                },
              },
            }} />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-white mb-4">Products Delivered to Locations</h3>
        <div className="h-80">
          <Bar data={locationBarChartData} options={{
            ...chartOptions,
            scales: {
              ...chartOptions.scales,
              x: {
                ...chartOptions.scales.x,
                title: { ...chartOptions.scales.x.title, display: true, text: 'Shipping Address' },
              },
              y: {
                ...chartOptions.scales.y,
                title: { ...chartOptions.scales.y.title, display: true, text: 'Quantity Delivered (kgs)' },
              },
            },
          }} />
        </div>
      </div>
    </div>
  );
} 