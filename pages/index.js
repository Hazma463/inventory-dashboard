import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('../components/layout/Navbar'), {
  ssr: false
});

const initialWarehouses = [
  {
    id: 1,
    name: "Mumbai Central Warehouse",
    location: "Mumbai, Maharashtra",
    inventory: [
      {
        id: 101,
        orderNo: "ORD-2025-001",
        orderDate: "15/05/2025",
        customerName: "ABC Enterprises",
        city: "Mumbai",
        state: "Maharashtra",
        shippingAddress: "123 Business Park, Andheri East",
        itemName: "Premium Widgets",
        hsnCode: "847130",
        packing: "10 kgs per box",
        quantity: "5",
        totalQuantity: "50",
        taxPercent: "18",
        taxAmt: "900",
        rate: "1000",
        amount: "5000",
        netPayable: "5900"
      }
    ]
  }
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const storedData = localStorage.getItem('warehouses');
    if (storedData) {
      setWarehouses(JSON.parse(storedData));
    } else {
      setWarehouses(initialWarehouses);
      localStorage.setItem('warehouses', JSON.stringify(initialWarehouses));
    }
    setIsLoading(false);
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Inventory Management System</title>
        <meta name="description" content="Modern Inventory Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="p-8">
          <div className="w-full bg-black py-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 bg-gray-800 rounded-2xl shadow-xl py-12">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Modern</span>
              <span className="block text-white">Inventory Management</span>
            </h1>
            <p className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
                  Streamline your inventory operations with our powerful management system.
            </p>
            <div className="rounded-md shadow mt-6">
              <button
                onClick={handleGoToDashboard}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Go To Dashboard
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative h-64 w-full max-w-md lg:h-96">
              <Image
                src="/warehouse.jpg"
                    alt="Warehouse"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <section className="bg-black py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose InventPro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <svg className="w-10 h-10 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Tracking</h3>
                  <p className="text-white">Monitor your inventory levels in real-time with our intuitive dashboard.</p>
            </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <svg className="w-10 h-10 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>
              <h3 className="text-xl font-semibold text-white mb-2">OCR Integration</h3>
                  <p className="text-white">Automatically extract data from documents using advanced OCR technology.</p>
            </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <svg className="w-10 h-10 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 4v-4a4 4 0 00-8 0v4" /></svg>
              <h3 className="text-xl font-semibold text-white mb-2">Analytics & Reports</h3>
                  <p className="text-white">Get detailed insights and reports about your inventory operations.</p>
            </div>
          </div>
        </div>
      </section>
        </main>
      </div>
    </>
  );
} 