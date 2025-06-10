-- Initialize Quantum AI Trading Platform Database
-- This script sets up the core tables for production deployment

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trading agents table
CREATE TABLE IF NOT EXISTS trading_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    configuration JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trading signals table
CREATE TABLE IF NOT EXISTS trading_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES trading_agents(id),
    token_address VARCHAR(255) NOT NULL,
    signal_type VARCHAR(10) CHECK (signal_type IN ('BUY', 'SELL', 'HOLD')),
    confidence DECIMAL(5,2) CHECK (confidence >= 0 AND confidence <= 100),
    reasoning TEXT,
    data_source JSONB DEFAULT '{}',
    vibecoding_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent performance logs table
CREATE TABLE IF NOT EXISTS agent_performance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES trading_agents(id),
    trade_outcome VARCHAR(20),
    profit_loss DECIMAL(20,8),
    confidence_score DECIMAL(5,2),
    reasoning TEXT,
    market_conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet activities table
CREATE TABLE IF NOT EXISTS wallet_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(255) NOT NULL,
    transaction_hash VARCHAR(255),
    activity_type VARCHAR(50),
    amount DECIMAL(20,8),
    token_symbol VARCHAR(20),
    usd_value DECIMAL(20,2),
    gas_used DECIMAL(20,8),
    block_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trading_signals_agent_id ON trading_signals(agent_id);
CREATE INDEX IF NOT EXISTS idx_trading_signals_created_at ON trading_signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_performance_logs_agent_id ON agent_performance_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_performance_logs_created_at ON agent_performance_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_activities_wallet_address ON wallet_activities(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_activities_created_at ON wallet_activities(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for trading_agents
CREATE TRIGGER update_trading_agents_updated_at 
    BEFORE UPDATE ON trading_agents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default trading agent
INSERT INTO trading_agents (id, name, status, configuration) 
VALUES (
    'quantum-ai-trader-001',
    'Quantum AI Trader',
    'active',
    '{"targetTokens": ["SOL", "BONK", "JUP", "ORCA", "RAY"], "riskLevel": "moderate", "maxPositionSize": 0.15}'
) ON CONFLICT (id) DO NOTHING;