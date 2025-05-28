'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function Navbar({ toggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-neutral-900 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center">
              <Link href="/" className="text-xl font-bold text-white">
                InventPro
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full bg-gray-800 text-white placeholder-gray-400 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:bg-gray-700 focus:text-white"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-gray-300 font-medium">Button One</button>
            <button className="text-white hover:text-gray-300 font-medium">Button Two</button>
            <button className="text-white hover:text-gray-300 font-medium">Button Three</button>
          </div>
        </div>
      </div>
    </nav>
  );
} 