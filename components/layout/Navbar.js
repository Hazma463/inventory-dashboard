import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-neutral-900 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white hover:text-gray-200 transition-colors">
                InventPro
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center max-w-lg mx-8">
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full bg-gray-800 text-white placeholder-gray-400 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:bg-gray-700 focus:text-white transition-colors"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Search"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-gray-300 font-medium transition-colors">Settings</button>
            <button className="text-white hover:text-gray-300 font-medium transition-colors">Profile</button>
          </div>
        </div>
      </div>
    </nav>
  );
} 