'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('./Navbar'), { ssr: false });
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
} 