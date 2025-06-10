import { pgTable, text, serial, integer, boolean, timestamp, decimal, json, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Autonomous Trading Agent Schema
export const tradingAgents = pgTable("trading_agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  configuration: json("configuration").notNull(),
  performanceMetrics: json("performance_metrics").default({}),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Market Intelligence Streams
export const marketDataStreams = pgTable("market_data_streams", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: varchar("source", { length: 50 }).notNull(),
  dataType: varchar("data_type", { length: 50 }).notNull(),
  tokenAddress: text("token_address"),
  data: json("data").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  processed: boolean("processed").default(false),
});

// Autonomous Trading Decisions
export const tradingSignals = pgTable("trading_signals", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => tradingAgents.id),
  tokenAddress: text("token_address").notNull(),
  signalType: varchar("signal_type", { length: 20 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 4 }).notNull(),
  reasoning: text("reasoning").notNull(),
  dataSource: json("data_source").notNull(),
  vibeCodingScore: decimal("vibecoding_score", { precision: 5, scale: 4 }).notNull(),
  executed: boolean("executed").default(false),
  executionResult: json("execution_result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Legal Compliance Schema
export const legalCompliance = pgTable("legal_compliance", {
  id: uuid("id").primaryKey().defaultRandom(),
  checkDate: timestamp("check_date").defaultNow().notNull(),
  overallScore: integer("overall_score").notNull(),
  passed: boolean("passed").notNull(),
  criticalViolations: integer("critical_violations").default(0),
  highViolations: integer("high_violations").default(0),
  mediumViolations: integer("medium_violations").default(0),
  lowViolations: integer("low_violations").default(0),
  violations: json("violations").notNull(),
  recommendations: json("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RSS Feed Intelligence
export const rssFeedSources = pgTable("rss_feed_sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(),
  active: boolean("active").default(true),
  lastFetched: timestamp("last_fetched"),
  errorCount: integer("error_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsArticles = pgTable("news_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  feedId: uuid("feed_id").references(() => rssFeedSources.id),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  link: text("link").notNull().unique(),
  author: text("author"),
  publishedAt: timestamp("published_at").notNull(),
  source: text("source").notNull(),
  category: text("category").notNull(),
  sentimentScore: text("sentiment_score"),
  relevanceScore: text("relevance_score"),
  tokenMentions: json("token_mentions").default([]),
  tradingSignals: json("trading_signals").default({}),
  urgencyLevel: text("urgency_level").default("low"),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// On-Chain Intelligence
export const onChainEvents = pgTable("onchain_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  transactionHash: text("transaction_hash").notNull().unique(),
  blockNumber: integer("block_number").notNull(),
  tokenAddress: text("token_address").notNull(),
  eventData: json("event_data").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Performance Intelligence
export const agentPerformanceLogs = pgTable("agent_performance_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => tradingAgents.id),
  metricType: varchar("metric_type", { length: 50 }).notNull(),
  metricValue: decimal("metric_value", { precision: 10, scale: 6 }).notNull(),
  context: json("context"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// VibeCoding Methodology Intelligence
export const vibeCodingMetrics = pgTable("vibecoding_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: text("agent_id").notNull(),
  context: text("context").notNull(),
  pizzaKitchenReliability: decimal("pizza_kitchen_reliability", { precision: 5, scale: 4 }).notNull(),
  rhythmGamingPrecision: decimal("rhythm_gaming_precision", { precision: 5, scale: 4 }).notNull(),
  vrChatSocialInsights: decimal("vrchat_social_insights", { precision: 5, scale: 4 }).notNull(),
  classicalPhilosophyWisdom: decimal("classical_philosophy_wisdom", { precision: 5, scale: 4 }).notNull(),
  overallScore: decimal("overall_score", { precision: 5, scale: 4 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Strategic Trading Decisions
export const tradingStrategies = pgTable("trading_strategies", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => tradingAgents.id),
  strategyType: varchar("strategy_type", { length: 50 }).notNull(),
  parameters: json("parameters").notNull(),
  riskProfile: json("risk_profile").notNull(),
  performanceHistory: json("performance_history").default({}),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const tradingAgentsRelations = relations(tradingAgents, ({ many }) => ({
  signals: many(tradingSignals),
  performanceLogs: many(agentPerformanceLogs),
  vibeCodingMetrics: many(vibeCodingMetrics),
  strategies: many(tradingStrategies),
}));

export const rssFeedSourcesRelations = relations(rssFeedSources, ({ many }) => ({
  articles: many(newsArticles),
}));

export const newsArticlesRelations = relations(newsArticles, ({ one }) => ({
  feed: one(rssFeedSources, {
    fields: [newsArticles.feedId],
    references: [rssFeedSources.id],
  }),
}));

export const tradingSignalsRelations = relations(tradingSignals, ({ one }) => ({
  agent: one(tradingAgents, {
    fields: [tradingSignals.agentId],
    references: [tradingAgents.id],
  }),
}));

export const agentPerformanceLogsRelations = relations(agentPerformanceLogs, ({ one }) => ({
  agent: one(tradingAgents, {
    fields: [agentPerformanceLogs.agentId],
    references: [tradingAgents.id],
  }),
}));

export const vibeCodingMetricsRelations = relations(vibeCodingMetrics, ({ one }) => ({
  // Relations removed temporarily to fix schema issues
}));

export const tradingStrategiesRelations = relations(tradingStrategies, ({ one }) => ({
  agent: one(tradingAgents, {
    fields: [tradingStrategies.agentId],
    references: [tradingAgents.id],
  }),
}));

// Schema definitions
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTradingAgentSchema = createInsertSchema(tradingAgents);
export const selectTradingAgentSchema = createSelectSchema(tradingAgents);
export const insertMarketDataStreamSchema = createInsertSchema(marketDataStreams);
export const selectMarketDataStreamSchema = createSelectSchema(marketDataStreams);

export const insertLegalComplianceSchema = createInsertSchema(legalCompliance);
export const selectLegalComplianceSchema = createSelectSchema(legalCompliance);
export const insertTradingSignalSchema = createInsertSchema(tradingSignals);
export const selectTradingSignalSchema = createSelectSchema(tradingSignals);
export const insertRssFeedSourceSchema = createInsertSchema(rssFeedSources);
export const selectRssFeedSourceSchema = createSelectSchema(rssFeedSources);
export const insertNewsArticleSchema = createInsertSchema(newsArticles);
export const selectNewsArticleSchema = createSelectSchema(newsArticles);
export const insertOnChainEventSchema = createInsertSchema(onChainEvents);
export const selectOnChainEventSchema = createSelectSchema(onChainEvents);
export const insertAgentPerformanceLogSchema = createInsertSchema(agentPerformanceLogs);
export const selectAgentPerformanceLogSchema = createSelectSchema(agentPerformanceLogs);
export const insertVibeCodingMetricSchema = createInsertSchema(vibeCodingMetrics);
export const selectVibeCodingMetricSchema = createSelectSchema(vibeCodingMetrics);
export const insertTradingStrategySchema = createInsertSchema(tradingStrategies);
export const selectTradingStrategySchema = createSelectSchema(tradingStrategies);

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TradingAgent = typeof tradingAgents.$inferSelect;
export type InsertTradingAgent = typeof tradingAgents.$inferInsert;
export type MarketDataStream = typeof marketDataStreams.$inferSelect;
export type InsertMarketDataStream = typeof marketDataStreams.$inferInsert;
export type TradingSignal = typeof tradingSignals.$inferSelect;
export type InsertTradingSignal = typeof tradingSignals.$inferInsert;
export type RssFeedSource = typeof rssFeedSources.$inferSelect;
export type InsertRssFeedSource = typeof rssFeedSources.$inferInsert;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;
export type OnChainEvent = typeof onChainEvents.$inferSelect;
export type InsertOnChainEvent = typeof onChainEvents.$inferInsert;
export type AgentPerformanceLog = typeof agentPerformanceLogs.$inferSelect;
export type InsertAgentPerformanceLog = typeof agentPerformanceLogs.$inferInsert;
export type VibeCodingMetric = typeof vibeCodingMetrics.$inferSelect;
export type InsertVibeCodingMetric = typeof vibeCodingMetrics.$inferInsert;
export type TradingStrategy = typeof tradingStrategies.$inferSelect;
export type InsertTradingStrategy = typeof tradingStrategies.$inferInsert;
