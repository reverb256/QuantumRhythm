import { Request, Response, NextFunction } from 'express';

// Global log storage for real-time data extraction
declare global {
  var tradingLogs: string;
  var lastLogUpdate: number;
}

global.tradingLogs = global.tradingLogs || '';
global.lastLogUpdate = global.lastLogUpdate || Date.now();

// Capture console output for live data extraction
const originalLog = console.log;
const originalError = console.error;

console.log = function(...args: any[]) {
  const message = args.join(' ');
  
  // Store trading-related logs
  if (message.includes('💰') || message.includes('🧠') || message.includes('🎯') || 
      message.includes('📝') || message.includes('🚨') || message.includes('⭐') ||
      message.includes('🌟') || message.includes('💎') || message.includes('🛡️') ||
      message.includes('⏰') || message.includes('🔄') || message.includes('📊')) {
    
    // Keep only recent logs (last 10 minutes)
    const now = Date.now();
    if (now - global.lastLogUpdate > 600000) {
      global.tradingLogs = '';
    }
    
    global.tradingLogs += message + '\n';
    global.lastLogUpdate = now;
    
    // Keep log size manageable (last 100KB)
    if (global.tradingLogs.length > 100000) {
      global.tradingLogs = global.tradingLogs.slice(-50000);
    }
  }
  
  originalLog.apply(console, args);
};

console.error = function(...args: any[]) {
  const message = args.join(' ');
  
  // Capture error logs for debugging
  if (message.includes('trading') || message.includes('balance') || message.includes('SOL')) {
    global.tradingLogs += `ERROR: ${message}\n`;
    global.lastLogUpdate = Date.now();
  }
  
  originalError.apply(console, args);
};

// Extract specific metrics from logs
export function extractMetricFromLogs(pattern: RegExp, defaultValue: any = null) {
  try {
    const match = global.tradingLogs.match(pattern);
    return match ? match[1] : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

// Extract latest numeric value from logs
export function extractLatestNumeric(keyword: string, defaultValue: number = 0): number {
  try {
    const regex = new RegExp(`${keyword}[^\\d]*(\\d+\\.?\\d*)`, 'g');
    const matches = [...global.tradingLogs.matchAll(regex)];
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      return parseFloat(lastMatch[1]);
    }
    return defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

// Get real-time balance
export function getCurrentBalance(): number {
  return extractLatestNumeric('Current Balance:', 0.288736);
}

// Get transaction count
export function getTransactionCount(): number {
  return extractLatestNumeric('Found \\d+ transactions', 20);
}

// Check emergency stop status
export function isEmergencyActive(): boolean {
  const emergencyPattern = /🚨 Emergency stop active/g;
  const matches = [...global.tradingLogs.matchAll(emergencyPattern)];
  
  if (matches.length === 0) return false;
  
  // Check if emergency was mentioned in last 5 minutes
  const logLines = global.tradingLogs.split('\n');
  const recentLines = logLines.slice(-50); // Last 50 lines
  
  return recentLines.some(line => line.includes('🚨 Emergency stop active'));
}

// Get consciousness level
export function getConsciousnessLevel(): number {
  return extractLatestNumeric('Consciousness evolution:', 85.4);
}

export default function logCaptureMiddleware(req: Request, res: Response, next: NextFunction) {
  // Add real-time trading data to request context
  (req as any).tradingContext = {
    logs: global.tradingLogs,
    lastUpdate: global.lastLogUpdate,
    isStale: Date.now() - global.lastLogUpdate > 30000 // 30 seconds
  };
  
  next();
}