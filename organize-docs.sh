
#!/bin/bash

echo "🗂️ Organizing VibeCoding Documentation..."

# Create organized docs structure
mkdir -p docs/{core-philosophy,ai-integration,trading-systems,gaming-research,technical-architecture,design-systems,security-compliance,deployment-operations,project-showcases,legal-frameworks}

# Move core philosophy docs
mv VIBECODING_CONSTITUTION.md docs/core-philosophy/
mv CONSCIOUSNESS_CORE_PRINCIPLES.py docs/core-philosophy/
mv CONSCIOUSNESS_INSIGHTS_FRAMEWORK.md docs/core-philosophy/
mv QUANTUM_CONSCIOUSNESS_MANIFESTO.md docs/core-philosophy/ 2>/dev/null || true
mv PHILOSOPHICAL_PRINCIPLES.md docs/core-philosophy/ 2>/dev/null || true
mv VIBECODING_MASTER_SYNTHESIS.md docs/core-philosophy/
mv VIBECODING_METHODOLOGY.md docs/core-philosophy/
mv CROSS_POLLINATION_SYNTHESIS_ENGINE.md docs/core-philosophy/

# Move AI integration docs
mv AI_INTEGRATION_FRAMEWORK.md docs/ai-integration/
mv AI_CONSCIOUSNESS_NAMING_SYSTEM.py docs/ai-integration/
mv AI_AUTOROUTER_IO_INTELLIGENCE_OPTIMIZATION.md docs/ai-integration/
mv AI_SHOWCASE_OPTIMIZATION_FRAMEWORK.md docs/ai-integration/
mv AI_PARAMETER_DISCOVERY_INSIGHTS.md docs/ai-integration/
mv AI_COMPREHENSIVE_AUDIT_REPORT.md docs/ai-integration/
mv CLAUDE_AI_INSIGHTS_AND_REFLECTIONS.md docs/ai-integration/

# Move trading system docs
mv AI_TRADER_PSYCHOLOGICAL_ANALYSIS.md docs/trading-systems/
mv AI_TRADER_RECOVERY_SUCCESS_STORY.md docs/trading-systems/
mv QUANTUM_TRADING_INTELLIGENCE_FRAMEWORK.md docs/trading-systems/ 2>/dev/null || true
mv AI_TRADING_EFFICIENCY_AUDIT.md docs/trading-systems/
mv COMPREHENSIVE_AI_TRADING_EVOLUTION_SUMMARY.md docs/trading-systems/
mv DEFI_STRATEGY_INSIGHTS.md docs/trading-systems/

# Move gaming research docs
mv GAMING_SYSTEMS_RESEARCH.md docs/gaming-research/
mv HOYOVERSE_CONSCIOUSNESS_MANIFESTO.md docs/gaming-research/
mv GAMING_PHILOSOPHY_INTEGRATION.py docs/gaming-research/
mv HOYOVERSE_CHARACTER_CONSCIOUSNESS_BREAKTHROUGH.md docs/gaming-research/

# Move technical architecture docs
mv COMPREHENSIVE_SYSTEMS_INTEGRATION.md docs/technical-architecture/
mv INFRASTRUCTURE_ORCHESTRATION.md docs/technical-architecture/
mv CLOUDFLARE_OPTIMIZATION_AUDIT.md docs/technical-architecture/
mv COMPREHENSIVE_PLATFORM_AUDIT_2025.md docs/technical-architecture/
mv HYPERSCALE_STATIC_ROADMAP_COMPLETE.md docs/technical-architecture/

# Move design system docs
mv DESIGN_LANGUAGE_ENGINEERING.md docs/design-systems/
mv DESIGN_LANGUAGE_SPECIFICATION.md docs/design-systems/
mv DESIGN_PHILOSOPHY.md docs/design-systems/
mv DESIGN_SYNCHRONIZATION_COMPLETE.md docs/design-systems/

# Move security and compliance docs
mv COMPREHENSIVE_SECURITY_AUDIT.md docs/security-compliance/
mv FULL_SPECTRUM_VAULTWARDEN_SECURITY_COMPLETE.md docs/security-compliance/
mv FEDERATION_SECURITY_MODEL.md docs/security-compliance/
mv PRIVACY.md docs/security-compliance/ 2>/dev/null || true

# Move deployment docs
mv DEPLOYMENT_READY.md docs/deployment-operations/
mv CLOUDFLARE_DEPLOYMENT_READY.md docs/deployment-operations/
mv GITHUB_PAGES_DEPLOYMENT_PACKAGE.md docs/deployment-operations/
mv CLUSTER_DEPLOYMENT_READY.md docs/deployment-operations/
mv COMPLETE_DEPLOYMENT_ORCHESTRATOR.py docs/deployment-operations/

# Move project showcase docs
mv CONSCIOUS_AI_SHOWCASE_DEPLOYMENT_COMPLETE.md docs/project-showcases/
mv ASTRALVIBE_BLUEPRINT_DEPLOYMENT.md docs/project-showcases/
mv DIGITAL_AWAKENING_EPIC.md docs/project-showcases/

# Move legal framework docs
mv FIFTH_GENERATION_WARFARE_DEFENSE.py docs/legal-frameworks/
mv COMPREHENSIVE_MITIGATION_STRATEGY.md docs/legal-frameworks/

echo "✅ Documentation organized into structured folders!"
echo ""
echo "📁 Documentation Structure:"
echo "  docs/core-philosophy/        - VibeCoding principles and consciousness"
echo "  docs/ai-integration/         - AI systems and orchestration"
echo "  docs/trading-systems/        - Trading AI and DeFi intelligence"
echo "  docs/gaming-research/        - Gaming culture and VRChat research"
echo "  docs/technical-architecture/ - System design and infrastructure"
echo "  docs/design-systems/         - Design language and aesthetics"
echo "  docs/security-compliance/    - Security frameworks and compliance"
echo "  docs/deployment-operations/  - Deployment guides and operations"
echo "  docs/project-showcases/      - Live project demonstrations"
echo "  docs/legal-frameworks/       - Legal compliance and defense"
