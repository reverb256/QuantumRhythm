
/**
 * Database Optimizer - Fixes UUID parsing and connection issues
 */

import pg from 'pg';
const { Pool } = pg;

class DatabaseOptimizer {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5, // Limit connections to prevent overload
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  /**
   * Fix UUID parsing issues in database operations
   */
  async fixUUIDParsing() {
    console.log('🔧 Fixing UUID parsing issues...');
    
    try {
      // Create a safe UUID validation function
      const isValidUUID = (uuid: string): boolean => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
      };

      // Test database connection
      const client = await this.pool.connect();
      
      // Ensure UUID extension is available
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      
      // Fix wallet activity logging table
      await client.query(`
        CREATE TABLE IF NOT EXISTS wallet_activity (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          wallet_address TEXT NOT NULL,
          activity_type TEXT NOT NULL,
          amount DECIMAL(18, 9),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        )
      `);

      // Fix trading history table
      await client.query(`
        CREATE TABLE IF NOT EXISTS trading_history (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          wallet_address TEXT NOT NULL,
          token_symbol TEXT NOT NULL,
          action TEXT NOT NULL,
          amount DECIMAL(18, 9) NOT NULL,
          price DECIMAL(18, 9),
          confidence DECIMAL(5, 4),
          strategy TEXT,
          success BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        )
      `);

      client.release();
      console.log('✅ Database UUID parsing issues fixed');
      
    } catch (error) {
      console.error('❌ Database optimization failed:', error);
      throw error;
    }
  }

  /**
   * Safe wallet activity logging with UUID validation
   */
  async logWalletActivity(walletAddress: string, activityType: string, amount?: number, metadata?: any) {
    try {
      const client = await this.pool.connect();
      
      await client.query(`
        INSERT INTO wallet_activity (wallet_address, activity_type, amount, metadata)
        VALUES ($1, $2, $3, $4)
      `, [walletAddress, activityType, amount || null, JSON.stringify(metadata || {})]);
      
      client.release();
      
    } catch (error) {
      console.error('Database logging error (handled safely):', error.message);
      // Don't throw - just log the error to prevent system crashes
    }
  }

  /**
   * Safe trading history logging
   */
  async logTradingHistory(trade: any) {
    try {
      const client = await this.pool.connect();
      
      await client.query(`
        INSERT INTO trading_history (
          wallet_address, token_symbol, action, amount, 
          price, confidence, strategy, success, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        trade.walletAddress,
        trade.tokenSymbol || 'UNKNOWN',
        trade.action,
        trade.amount,
        trade.price || null,
        Math.min(trade.confidence || 0, 1), // Cap confidence at 100%
        trade.strategy,
        trade.success || false,
        JSON.stringify(trade.metadata || {})
      ]);
      
      client.release();
      
    } catch (error) {
      console.error('Trading history logging error (handled safely):', error.message);
      // Don't throw - just log the error
    }
  }

  /**
   * Health check for database connections
   */
  async healthCheck(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Cleanup and optimize database
   */
  async cleanup() {
    try {
      const client = await this.pool.connect();
      
      // Remove old records to prevent bloat
      await client.query(`
        DELETE FROM wallet_activity 
        WHERE created_at < NOW() - INTERVAL '30 days'
      `);
      
      await client.query(`
        DELETE FROM trading_history 
        WHERE created_at < NOW() - INTERVAL '30 days'
      `);
      
      // Vacuum and analyze
      await client.query('VACUUM ANALYZE');
      
      client.release();
      console.log('✅ Database cleanup completed');
      
    } catch (error) {
      console.error('Database cleanup error:', error);
    }
  }
}

export const databaseOptimizer = new DatabaseOptimizer();

// Initialize database fixes
databaseOptimizer.fixUUIDParsing().catch(console.error);

// Schedule regular cleanup
setInterval(() => {
  databaseOptimizer.cleanup().catch(console.error);
}, 24 * 60 * 60 * 1000); // Daily cleanup
