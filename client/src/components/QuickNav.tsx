
import React from 'react';
import { Link, useLocation } from 'wouter';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/projects', label: 'Projects', icon: '🚀' },
  { href: '/philosophy', label: 'Philosophy', icon: '🧠' },
  { href: '/values', label: 'Values', icon: '⚖️' },
  { href: '/vrchat', label: 'VRChat', icon: '🌐' },
  { href: '/trading', label: 'Trading', icon: '📈' },
];

export default function QuickNav() {
  const [location] = useLocation();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
            ${location === item.href 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <span className="text-sm">{item.icon}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
