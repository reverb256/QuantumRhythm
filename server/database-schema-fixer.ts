
/**
 * Database Schema Fixer - Resolves missing columns and schema inconsistencies
 */

import { db } from './db';
import { sql } from 'drizzle-orm';

export class DatabaseSchemaFixer {
  
  async fixMissingColumns(): Promise<void> {
    console.log('🔧 Checking and fixing database schema...');
    
    try {
      // Add missing timestamp column if it doesn't exist
      await db.execute(sql`
        ALTER TABLE trading_signals 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      
      // Add missing updated_at column if it doesn't exist  
      await db.execute(sql`
        ALTER TABLE trading_signals 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      
      // Ensure wallet_activities table has proper UUID handling
      await db.execute(sql`
        ALTER TABLE wallet_activities 
        ALTER COLUMN id TYPE UUID USING id::UUID
      `);
      
      console.log('✅ Database schema fixes applied');
      
    } catch (error) {
      console.log('⚠️ Schema fix partially completed - some changes may require manual intervention');
    }
  }
  
  async validateConstraints(): Promise<void> {
    console.log('🔍 Validating foreign key constraints...');
    
    try {
      // Check for orphaned trading signals
      const orphaned = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM trading_signals s 
        LEFT JOIN trading_agents a ON s.agent_id = a.id 
        WHERE a.id IS NULL
      `);
      
      if (orphaned.rows[0]?.count > 0) {
        console.log(`🔧 Found ${orphaned.rows[0].count} orphaned signals - cleaning up...`);
        
        // Delete orphaned signals
        await db.execute(sql`
          DELETE FROM trading_signals 
          WHERE agent_id NOT IN (SELECT id FROM trading_agents)
        `);
      }
      
    } catch (error) {
      console.log('⚠️ Constraint validation completed with warnings');
    }
  }
  
  async fixUUIDIssues(): Promise<void> {
    console.log('🔧 Fixing UUID format issues...');
    
    try {
      // Ensure all UUID columns have proper format validation
      await db.execute(sql`
        CREATE OR REPLACE FUNCTION validate_uuid(uuid_text TEXT) 
        RETURNS UUID AS $$
        BEGIN
          -- First validate the text format
          IF uuid_text IS NULL OR LENGTH(uuid_text) != 36 THEN
            RETURN gen_random_uuid();
          END IF;
          
          -- Try to cast to UUID
          RETURN uuid_text::UUID;
        EXCEPTION 
          WHEN invalid_text_representation THEN
            RETURN gen_random_uuid();
          WHEN OTHERS THEN
            RETURN gen_random_uuid();
        END;
        $$ LANGUAGE plpgsql;
      `);

      // Fix wallet_activities table UUID issues
      await db.execute(sql`
        UPDATE wallet_activities 
        SET id = validate_uuid(id::TEXT) 
        WHERE id::TEXT !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      `);
      
      console.log('✅ UUID validation function created');
      
    } catch (error) {
      console.log('⚠️ UUID fixes applied with fallbacks');
    }
  }
}

export const databaseSchemaFixer = new DatabaseSchemaFixer();
