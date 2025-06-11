/**
 * Database Migration Fixer - Resolves UUID and Schema Issues
 * Fixes the critical wallet activity logging errors
 */

import { db } from './db';
import { sql } from 'drizzle-orm';

export class DatabaseMigrationFixer {
  async fixUUIDIssues(): Promise<void> {
    console.log('🔧 FIXING DATABASE UUID ISSUES');
    
    try {
      // Enable UUID extension if not exists
      await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
      console.log('✅ UUID extension enabled');

      // Fix wallet_activity table if it exists with wrong UUID format
      await db.execute(sql`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wallet_activity') THEN
            -- Check if id column needs fixing
            IF EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'wallet_activity' 
              AND column_name = 'id' 
              AND data_type != 'uuid'
            ) THEN
              -- Recreate table with proper UUID
              DROP TABLE IF EXISTS wallet_activity_backup;
              CREATE TABLE wallet_activity_backup AS SELECT * FROM wallet_activity;
              DROP TABLE wallet_activity;
              
              CREATE TABLE wallet_activity (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                wallet_address TEXT NOT NULL,
                activity_type VARCHAR(50) NOT NULL,
                amount DECIMAL(18, 9),
                token_address TEXT,
                transaction_hash TEXT,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                metadata JSONB DEFAULT '{}',
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
              );
              
              -- Restore data with new UUIDs
              INSERT INTO wallet_activity (wallet_address, activity_type, amount, token_address, transaction_hash, status, metadata, timestamp)
              SELECT wallet_address, activity_type, amount, token_address, transaction_hash, status, metadata, timestamp
              FROM wallet_activity_backup;
              
              DROP TABLE wallet_activity_backup;
            END IF;
          END IF;
        END $$;
      `);
      
      console.log('✅ wallet_activity table UUID structure fixed');

      // Create other missing tables with proper UUID structure
      await this.createMissingTables();
      
      console.log('✅ Database migration fixes completed');
      
    } catch (error) {
      console.log('⚠️ Database migration fix failed, continuing with fallback:', (error as Error).message);
    }
  }

  private async createMissingTables(): Promise<void> {
    // Create api_endpoints table if missing
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS api_endpoints (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        provider TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'unknown',
        response_time INTEGER,
        success_count INTEGER NOT NULL DEFAULT 0,
        error_count INTEGER NOT NULL DEFAULT 0,
        rate_limit INTEGER,
        last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Create trading_agents table if missing
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS trading_agents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        configuration JSONB NOT NULL,
        performance_metrics JSONB DEFAULT '{}',
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Create trading_signals table if missing
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS trading_signals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_id UUID NOT NULL REFERENCES trading_agents(id),
        token_address TEXT NOT NULL,
        signal_type VARCHAR(20) NOT NULL,
        confidence DECIMAL(5, 4) NOT NULL,
        reasoning TEXT NOT NULL,
        data_source JSONB NOT NULL,
        vibecoding_score DECIMAL(5, 4) NOT NULL,
        executed BOOLEAN DEFAULT FALSE,
        execution_result JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Create market_data_streams table if missing
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS market_data_streams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source VARCHAR(50) NOT NULL,
        data_type VARCHAR(50) NOT NULL,
        token_address TEXT,
        data JSONB NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        processed BOOLEAN DEFAULT FALSE
      );
    `);

    console.log('✅ All required tables created with proper UUID structure');
  }

  async validateDatabaseHealth(): Promise<boolean> {
    try {
      // Test wallet activity insertion
      const testResult = await db.execute(sql`
        INSERT INTO wallet_activity (wallet_address, activity_type, status, metadata)
        VALUES ('test_wallet', 'health_check', 'completed', '{"test": true}')
        RETURNING id;
      `);

      if (testResult.rowCount && testResult.rowCount > 0) {
        // Clean up test record
        await db.execute(sql`
          DELETE FROM wallet_activity 
          WHERE wallet_address = 'test_wallet' AND activity_type = 'health_check';
        `);
        
        console.log('✅ Database health check passed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('❌ Database health check failed:', (error as Error).message);
      return false;
    }
  }
}

export const databaseFixer = new DatabaseMigrationFixer();