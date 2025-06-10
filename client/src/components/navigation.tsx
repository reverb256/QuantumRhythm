import React from 'react';
import { Link, useLocation } from 'wouter';

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' }
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border">
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === item.href
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}