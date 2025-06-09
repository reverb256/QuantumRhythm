import React from 'react';
import { motion } from 'framer-motion';

// Base SVG wrapper with common properties
const IllustrationWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
}> = ({ children, className = '', width = 200, height = 200 }) => (
  <motion.svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    className={`${className} select-none`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.svg>
);

// 404 Robot Lost Illustration
export const Robot404: React.FC<{ className?: string }> = ({ className }) => (
  <IllustrationWrapper className={className} width={240} height={240}>
    <defs>
      <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1f2937" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>
    
    {/* Robot Body */}
    <motion.rect
      x="80"
      y="120"
      width="80"
      height="90"
      rx="15"
      fill="url(#robotGradient)"
      animate={{ y: [120, 115, 120] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Robot Head */}
    <motion.rect
      x="90"
      y="80"
      width="60"
      height="50"
      rx="25"
      fill="url(#robotGradient)"
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Screen */}
    <rect
      x="95"
      y="90"
      width="50"
      height="30"
      rx="5"
      fill="url(#screenGradient)"
    />
    
    {/* 404 Text on Screen */}
    <text
      x="120"
      y="108"
      textAnchor="middle"
      fill="#ef4444"
      fontSize="12"
      fontWeight="bold"
      fontFamily="monospace"
    >
      404
    </text>
    
    {/* Robot Eyes (Sad) */}
    <motion.circle
      cx="105"
      cy="95"
      r="3"
      fill="#ef4444"
      animate={{ scaleY: [1, 0.3, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle
      cx="135"
      cy="95"
      r="3"
      fill="#ef4444"
      animate={{ scaleY: [1, 0.3, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
    />
    
    {/* Arms */}
    <motion.rect
      x="60"
      y="135"
      width="25"
      height="8"
      rx="4"
      fill="url(#robotGradient)"
      animate={{ rotate: [-10, 10, -10] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.rect
      x="155"
      y="135"
      width="25"
      height="8"
      rx="4"
      fill="url(#robotGradient)"
      animate={{ rotate: [10, -10, 10] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Legs */}
    <rect x="95" y="210" width="12" height="20" rx="6" fill="url(#robotGradient)" />
    <rect x="133" y="210" width="12" height="20" rx="6" fill="url(#robotGradient)" />
    
    {/* Question Marks Floating Around */}
    <motion.text
      x="50"
      y="100"
      fill="#64748b"
      fontSize="20"
      fontWeight="bold"
      animate={{ 
        y: [100, 95, 100],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      ?
    </motion.text>
    <motion.text
      x="190"
      y="120"
      fill="#64748b"
      fontSize="16"
      fontWeight="bold"
      animate={{ 
        y: [120, 115, 120],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      ?
    </motion.text>
  </IllustrationWrapper>
);

// Network Error Illustration
export const NetworkError: React.FC<{ className?: string }> = ({ className }) => (
  <IllustrationWrapper className={className} width={220} height={220}>
    <defs>
      <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e5e7eb" />
        <stop offset="100%" stopColor="#9ca3af" />
      </linearGradient>
    </defs>
    
    {/* Cloud */}
    <motion.path
      d="M60 100 C40 100, 30 85, 45 75 C50 65, 70 65, 75 75 C90 65, 110 65, 115 75 C130 65, 150 65, 155 75 C170 85, 160 100, 140 100 Z"
      fill="url(#cloudGradient)"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Lightning Bolt (Error) */}
    <motion.path
      d="M105 85 L115 100 L108 100 L118 120 L108 105 L115 105 Z"
      fill="#ef4444"
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Disconnected WiFi Signals */}
    <motion.path
      d="M80 140 Q90 130, 100 140"
      stroke="#ef4444"
      strokeWidth="3"
      fill="none"
      strokeDasharray="5,5"
      animate={{ strokeDashoffset: [0, -10] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
    <motion.path
      d="M120 140 Q130 130, 140 140"
      stroke="#ef4444"
      strokeWidth="3"
      fill="none"
      strokeDasharray="5,5"
      animate={{ strokeDashoffset: [0, -10] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.3 }}
    />
    
    {/* Computer/Device */}
    <rect x="90" y="160" width="40" height="25" rx="3" fill="#374151" />
    <rect x="92" y="162" width="36" height="18" rx="2" fill="#1f2937" />
    <rect x="105" y="185" width="10" height="8" fill="#374151" />
    <rect x="100" y="193" width="20" height="3" rx="1" fill="#374151" />
    
    {/* Error Messages */}
    <motion.text
      x="110"
      y="205"
      textAnchor="middle"
      fill="#ef4444"
      fontSize="10"
      fontFamily="monospace"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      Connection Lost
    </motion.text>
  </IllustrationWrapper>
);

// Loading Error (Broken Gear) Illustration
export const LoadingError: React.FC<{ className?: string }> = ({ className }) => (
  <IllustrationWrapper className={className} width={200} height={200}>
    <defs>
      <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6b7280" />
        <stop offset="100%" stopColor="#374151" />
      </linearGradient>
    </defs>
    
    {/* Broken Gear */}
    <motion.g
      animate={{ rotate: [0, 45, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "100px 100px" }}
    >
      {/* Main Gear Body */}
      <circle cx="100" cy="100" r="40" fill="url(#gearGradient)" />
      
      {/* Gear Teeth */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const x = 100 + Math.cos(angle) * 45;
        const y = 100 + Math.sin(angle) * 45;
        
        return (
          <rect
            key={i}
            x={x - 4}
            y={y - 6}
            width="8"
            height="12"
            fill="url(#gearGradient)"
            transform={`rotate(${i * 45} ${x} ${y})`}
            style={{ opacity: i === 3 ? 0.3 : 1 }} // Broken tooth
          />
        );
      })}
      
      {/* Center Hole */}
      <circle cx="100" cy="100" r="15" fill="#1f2937" />
    </motion.g>
    
    {/* Crack Lines */}
    <motion.path
      d="M85 85 L115 115"
      stroke="#ef4444"
      strokeWidth="2"
      animate={{ pathLength: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M115 85 L85 115"
      stroke="#ef4444"
      strokeWidth="2"
      animate={{ pathLength: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    
    {/* Sparks */}
    <motion.circle
      cx="70"
      cy="70"
      r="2"
      fill="#fbbf24"
      animate={{ 
        scale: [0, 1, 0],
        opacity: [0, 1, 0]
      }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.circle
      cx="130"
      cy="130"
      r="1.5"
      fill="#f59e0b"
      animate={{ 
        scale: [0, 1, 0],
        opacity: [0, 1, 0]
      }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
    />
  </IllustrationWrapper>
);

// Server Error (Sad Server) Illustration
export const ServerError: React.FC<{ className?: string }> = ({ className }) => (
  <IllustrationWrapper className={className} width={200} height={240}>
    <defs>
      <linearGradient id="serverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4b5563" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
    </defs>
    
    {/* Server Rack */}
    <rect x="70" y="80" width="60" height="100" rx="8" fill="url(#serverGradient)" />
    
    {/* Server Panels */}
    <rect x="75" y="90" width="50" height="15" rx="2" fill="#374151" />
    <rect x="75" y="110" width="50" height="15" rx="2" fill="#374151" />
    <rect x="75" y="130" width="50" height="15" rx="2" fill="#374151" />
    <rect x="75" y="150" width="50" height="15" rx="2" fill="#374151" />
    
    {/* Error Status Lights */}
    <motion.circle
      cx="80"
      cy="97"
      r="2"
      fill="#ef4444"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle
      cx="80"
      cy="117"
      r="2"
      fill="#ef4444"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
    />
    <circle cx="80" cy="137" r="2" fill="#22c55e" />
    <circle cx="80" cy="157" r="2" fill="#22c55e" />
    
    {/* Server Face (Sad) */}
    <circle cx="90" cy="200" r="3" fill="#ef4444" />
    <circle cx="110" cy="200" r="3" fill="#ef4444" />
    <motion.path
      d="M85 210 Q100 220 115 210"
      stroke="#ef4444"
      strokeWidth="2"
      fill="none"
      animate={{ d: ["M85 210 Q100 220 115 210", "M85 215 Q100 225 115 215", "M85 210 Q100 220 115 210"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Error Code Display */}
    <rect x="87" y="95" width="26" height="8" rx="1" fill="#000" />
    <text x="100" y="101" textAnchor="middle" fill="#ef4444" fontSize="6" fontFamily="monospace">500</text>
    
    {/* Smoke/Steam */}
    <motion.circle
      cx="85"
      cy="75"
      r="3"
      fill="#6b7280"
      opacity="0.6"
      animate={{ 
        y: [75, 60, 75],
        opacity: [0.6, 0, 0.6],
        scale: [1, 1.5, 1]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle
      cx="100"
      cy="70"
      r="2"
      fill="#6b7280"
      opacity="0.4"
      animate={{ 
        y: [70, 55, 70],
        opacity: [0.4, 0, 0.4],
        scale: [1, 1.3, 1]
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.circle
      cx="115"
      cy="75"
      r="2.5"
      fill="#6b7280"
      opacity="0.5"
      animate={{ 
        y: [75, 60, 75],
        opacity: [0.5, 0, 0.5],
        scale: [1, 1.4, 1]
      }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
    />
  </IllustrationWrapper>
);

// Empty State (Floating Astronaut) Illustration
export const EmptyState: React.FC<{ className?: string }> = ({ className }) => (
  <IllustrationWrapper className={className} width={220} height={220}>
    <defs>
      <linearGradient id="astronautGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f3f4f6" />
        <stop offset="100%" stopColor="#d1d5db" />
      </linearGradient>
      <radialGradient id="helmetGradient" cx="50%" cy="30%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.3" />
      </radialGradient>
    </defs>
    
    {/* Floating Motion Container */}
    <motion.g
      animate={{ 
        y: [0, -10, 0],
        rotate: [-2, 2, -2]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut"
      }}
    >
      {/* Astronaut Body */}
      <ellipse cx="110" cy="140" rx="25" ry="35" fill="url(#astronautGradient)" />
      
      {/* Helmet */}
      <circle cx="110" cy="100" r="30" fill="url(#helmetGradient)" opacity="0.9" />
      <circle cx="110" cy="100" r="25" fill="none" stroke="#d1d5db" strokeWidth="2" />
      
      {/* Face */}
      <circle cx="105" cy="95" r="2" fill="#374151" />
      <circle cx="115" cy="95" r="2" fill="#374151" />
      <motion.path
        d="M105 105 Q110 108 115 105"
        stroke="#374151"
        strokeWidth="1.5"
        fill="none"
        animate={{ d: ["M105 105 Q110 108 115 105", "M105 107 Q110 105 115 107", "M105 105 Q110 108 115 105"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Arms */}
      <ellipse cx="85" cy="130" rx="8" ry="20" fill="url(#astronautGradient)" transform="rotate(-20 85 130)" />
      <ellipse cx="135" cy="130" rx="8" ry="20" fill="url(#astronautGradient)" transform="rotate(20 135 130)" />
      
      {/* Legs */}
      <ellipse cx="100" cy="180" rx="8" ry="22" fill="url(#astronautGradient)" />
      <ellipse cx="120" cy="180" rx="8" ry="22" fill="url(#astronautGradient)" />
      
      {/* Control Panel */}
      <rect x="100" y="125" width="20" height="15" rx="3" fill="#374151" />
      <circle cx="105" cy="130" r="1.5" fill="#22c55e" />
      <circle cx="110" cy="130" r="1.5" fill="#eab308" />
      <circle cx="115" cy="130" r="1.5" fill="#ef4444" />
    </motion.g>
    
    {/* Floating Particles */}
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.circle
        key={i}
        cx={60 + i * 20}
        cy={50 + (i % 2) * 120}
        r="1"
        fill="#60a5fa"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{ 
          duration: 3 + i * 0.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: i * 0.2
        }}
      />
    ))}
    
    {/* Empty Text */}
    <motion.text
      x="110"
      y="210"
      textAnchor="middle"
      fill="#6b7280"
      fontSize="12"
      fontWeight="500"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      Nothing here yet...
    </motion.text>
  </IllustrationWrapper>
);

// Maintenance Mode Illustration
export const MaintenanceMode: React.FC<{ className?: string }> = ({ className }) => (
  <IllustrationWrapper className={className} width={240} height={200}>
    <defs>
      <linearGradient id="toolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    
    {/* Toolbox */}
    <rect x="80" y="120" width="80" height="40" rx="5" fill="#374151" />
    <rect x="85" y="125" width="70" height="8" rx="2" fill="#4b5563" />
    <circle cx="90" cy="140" r="2" fill="#6b7280" />
    <circle cx="100" cy="140" r="2" fill="#6b7280" />
    <rect x="110" y="138" width="15" height="4" rx="1" fill="#6b7280" />
    
    {/* Wrench */}
    <motion.g
      animate={{ rotate: [-10, 10, -10] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "140px 100px" }}
    >
      <rect x="130" y="95" width="4" height="30" fill="url(#toolGradient)" />
      <rect x="127" y="95" width="10" height="8" rx="2" fill="url(#toolGradient)" />
      <rect x="127" y="120" width="10" height="8" rx="2" fill="url(#toolGradient)" />
    </motion.g>
    
    {/* Screwdriver */}
    <motion.g
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      <rect x="100" y="75" width="3" height="25" fill="url(#toolGradient)" />
      <rect x="98" y="75" width="7" height="10" rx="1" fill="#1f2937" />
    </motion.g>
    
    {/* Hammer */}
    <motion.g
      animate={{ rotate: [0, -15, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      style={{ transformOrigin: "70px 110px" }}
    >
      <rect x="65" y="85" width="4" height="30" fill="#8b5cf6" />
      <rect x="60" y="80" width="14" height="8" rx="2" fill="#6b7280" />
    </motion.g>
    
    {/* Gears */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "180px 80px" }}
    >
      <circle cx="180" cy="80" r="12" fill="#6b7280" />
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const x = 180 + Math.cos(angle) * 15;
        const y = 80 + Math.sin(angle) * 15;
        return (
          <rect
            key={i}
            x={x - 2}
            y={y - 3}
            width="4"
            height="6"
            fill="#6b7280"
            transform={`rotate(${i * 60} ${x} ${y})`}
          />
        );
      })}
      <circle cx="180" cy="80" r="4" fill="#374151" />
    </motion.g>
    
    <motion.g
      animate={{ rotate: -360 }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "200px 100px" }}
    >
      <circle cx="200" cy="100" r="8" fill="#6b7280" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const x = 200 + Math.cos(angle) * 10;
        const y = 100 + Math.sin(angle) * 10;
        return (
          <rect
            key={i}
            x={x - 1.5}
            y={y - 2}
            width="3"
            height="4"
            fill="#6b7280"
            transform={`rotate(${i * 45} ${x} ${y})`}
          />
        );
      })}
      <circle cx="200" cy="100" r="3" fill="#374151" />
    </motion.g>
    
    {/* Progress Bar */}
    <rect x="60" y="170" width="120" height="6" rx="3" fill="#374151" />
    <motion.rect
      x="60"
      y="170"
      width="120"
      height="6"
      rx="3"
      fill="url(#toolGradient)"
      animate={{ scaleX: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "60px 173px" }}
    />
    
    {/* Status Text */}
    <text x="120" y="190" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="monospace">
      Maintenance in progress...
    </text>
  </IllustrationWrapper>
);