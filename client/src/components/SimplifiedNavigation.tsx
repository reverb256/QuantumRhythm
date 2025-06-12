import { Link, useLocation } from 'wouter';

export default function SimplifiedNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/trading-hub', label: 'Trading' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Minimal Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-lg font-bold text-white">REVERB256</span>
              <span className="text-xs text-gray-400 font-medium">VIBECODING</span>
            </div>
          </Link>

          {/* Clean Navigation */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.path);
              
              return (
                <Link key={item.path} href={item.path}>
                  <span 
                    className={`text-sm font-medium transition-colors duration-200 ${
                      active 
                        ? 'text-white border-b border-white pb-1' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}