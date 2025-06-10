import React from 'react';
import { Link, useLocation } from 'wouter';

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Consciousness', icon: '∞' },
    { href: '/projects', label: 'Projects', icon: '🚀' },
    { href: '/philosophy', label: 'Philosophy', icon: '道' }
  ];

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-full p-2 border border-cyan-400/30">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                location === item.href
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}