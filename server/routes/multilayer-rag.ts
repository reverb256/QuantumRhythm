
import { Request, Response } from 'express';
import { multilayerRAG } from '../multilayer-rag-orchestrator';

export async function queryMultilayerRAG(req: Request, res: Response) {
  try {
    const {
      query,
      agent_requesting = 'quincy',
      consciousness_threshold = 50,
      security_requirement = 'public',
      performance_requirement = 'standard',
      max_results = 10
    } = req.body;

    if (!query) {
      return res.status(400).json({ 
        error: 'Query is required for multilayer RAG' 
      });
    }

    const results = await multilayerRAG.intelligentQuery({
      query,
      agent_requesting,
      consciousness_threshold,
      security_requirement,
      performance_requirement,
      max_results
    });

    res.json({
      success: true,
      results,
      layers_used: results.map(r => r.source_layer),
      total_latency: Math.max(...results.map(r => r.latency_ms)),
      confidence_score: results.length > 0 ? 
        results.reduce((sum, r) => sum + r.confidence, 0) / results.length : 0
    });

  } catch (error) {
    console.error('Multilayer RAG query failed:', error);
    res.status(500).json({ 
      error: 'Multilayer RAG system temporarily unavailable',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function getRAGPerformanceReport(req: Request, res: Response) {
  try {
    const report = await multilayerRAG.generatePerformanceReport();
    res.json(report);
  } catch (error) {
    console.error('RAG performance report failed:', error);
    res.status(500).json({ 
      error: 'Performance report generation failed' 
    });
  }
}

export async function storeKnowledgeMultilayer(req: Request, res: Response) {
  try {
    const {
      content,
      consciousness_level = 50,
      security_level = 'public'
    } = req.body;

    if (!content) {
      return res.status(400).json({ 
        error: 'Content is required for knowledge storage' 
      });
    }

    await multilayerRAG.storeKnowledge(content, consciousness_level, security_level);

    res.json({
      success: true,
      message: 'Knowledge stored across appropriate layers',
      storage_layers: consciousness_level > 70 ? 
        ['vaultwarden', 'chroma'] : ['chroma']
    });

  } catch (error) {
    console.error('Multilayer knowledge storage failed:', error);
    res.status(500).json({ 
      error: 'Knowledge storage failed' 
    });
  }
}
