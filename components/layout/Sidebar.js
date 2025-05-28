'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Button One', icon: HomeIcon },
    { name: 'Button Two', icon: ChartBarIcon },
    { name: 'Button Three', icon: ClipboardDocumentListIcon },
    { name: 'Button Four', icon: Cog6ToothIcon },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-neutral-900 shadow-lg border-r border-gray-800`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-800">
        <span className="text-2xl font-bold text-white">Menu</span>
        <button
          onClick={onClose}
          className="text-gray-200 hover:text-white focus:outline-none"
        >
          &times;
        </button>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block px-6 py-3 text-white hover:bg-gray-800 rounded transition-colors duration-200">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/" className="block px-6 py-3 text-white hover:bg-gray-800 rounded transition-colors duration-200">
              Home
            </Link>
          </li>
          {/* Add more sidebar links as needed */}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full px-6 py-4 bg-gray-800 border-t border-gray-800">
        <span className="text-gray-200 text-sm">&copy; {new Date().getFullYear()} InventPro</span>
      </div>
    </aside>
  );
} 