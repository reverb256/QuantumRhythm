import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface UnifiedPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  variant?: 'default' | 'dashboard' | 'minimal';
  className?: string;
}

export default function UnifiedPageLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = true,
  variant = 'default',
  className = ''
}: UnifiedPageLayoutProps) {
  
  const backgroundVariants = {
    default: 'bg-[var(--space-black)]',
    dashboard: 'bg-gradient-to-br from-[var(--space-black)] via-[var(--space-void)] to-[var(--space-deep)]',
    minimal: 'bg-[var(--space-black)]'
  };

  return (
    <div className={`min-h-screen ${backgroundVariants[variant]} text-white pt-16 ${className}`}>
      {/* Unified Quantum Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Back Button (if needed) */}
      {showBackButton && (
        <div className="relative z-40 pt-20 pb-4">
          <div className="max-w-7xl mx-auto px-6">
            <Link href="/">
              <Button variant="ghost" className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 pt-8">
        <div className="container mx-auto px-6">
          {/* Unified Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 font-space">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-300 leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Page Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Unified Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-400/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

// Unified Card Component
export function UnifiedCard({ 
  children, 
  className = '',
  variant = 'default'
}: { 
  children: ReactNode; 
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
}) {
  const cardVariants = {
    default: 'bg-black/40 border-cyan-400/30',
    glass: 'bg-[var(--glass-primary)] border-[var(--glass-border)] backdrop-blur-xl',
    solid: 'bg-[var(--space-void)] border-cyan-400/20'
  };

  return (
    <div className={`rounded-xl p-6 border ${cardVariants[variant]} ${className}`}>
      {children}
    </div>
  );
}

// Unified Section Component
export function UnifiedSection({ 
  children, 
  className = '',
  id
}: { 
  children: ReactNode; 
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`mb-16 ${className}`}
      id={id}
    >
      {children}
    </motion.section>
  );
}