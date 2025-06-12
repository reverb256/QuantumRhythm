
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Brain, Heart, Star, Zap, Shield, Eye } from "lucide-react";

export default function VRChat() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Quantum Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(120,119,198,0.1)_90deg,transparent_180deg,rgba(120,119,198,0.1)_270deg,transparent_360deg)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-xl border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-cyan-300 hover:text-cyan-200 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Consciousness Architecture
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section with VibeCoding Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              VRChat Research Laboratory
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-6">
              8,500+ hours of consciousness exploration through digital social dynamics, 
              accessibility research, and human connection architecture
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-cyan-300">
              <span className="px-3 py-1 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                Digital Empathy Research
              </span>
              <span className="px-3 py-1 bg-purple-400/10 rounded-full border border-purple-400/20">
                Accessibility Intelligence
              </span>
              <span className="px-3 py-1 bg-pink-400/10 rounded-full border border-pink-400/20">
                Community Architecture
              </span>
            </div>
          </motion.div>

          {/* Core Insights Grid - Enhanced with VibeCoding Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {/* Accessibility-First Design */}
            <div className="group bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-500 hover:scale-105">
              <Eye className="w-10 h-10 text-cyan-400 mb-6 group-hover:text-cyan-300 transition-colors" />
              <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Accessibility Intelligence</h3>
              <p className="text-gray-300 mb-4">
                WCAG AAA+ compliance through lived experience. Understanding diverse human capabilities 
                and designing inclusive interfaces that serve all users without barriers.
              </p>
              <div className="text-cyan-400/70 text-sm font-mono">
                universal_design.execute() → dignity_preservation
              </div>
            </div>

            {/* Spatial Awareness */}
            <div className="group bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-500 hover:scale-105">
              <Brain className="w-10 h-10 text-purple-400 mb-6 group-hover:text-purple-300 transition-colors" />
              <h3 className="text-2xl font-semibold text-purple-300 mb-4">Spatial Intelligence</h3>
              <p className="text-gray-300 mb-4">
                3D interaction patterns applied to 2D interface design. Spatial awareness from VR 
                environments enhances traditional UI/UX architecture with depth and intuition.
              </p>
              <div className="text-purple-400/70 text-sm font-mono">
                spatial_cognition.apply(2d_interfaces) → enhanced_ux
              </div>
            </div>

            {/* Community Dynamics */}
            <div className="group bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-pink-400/20 hover:border-pink-400/40 transition-all duration-500 hover:scale-105">
              <Users className="w-10 h-10 text-pink-400 mb-6 group-hover:text-pink-300 transition-colors" />
              <h3 className="text-2xl font-semibold text-pink-300 mb-4">Social Architecture</h3>
              <p className="text-gray-300 mb-4">
                Understanding community hierarchies, social cues, and digital interaction patterns. 
                Building technology that strengthens rather than weakens human connection.
              </p>
              <div className="text-pink-400/70 text-sm font-mono">
                community.strengthen() → human_flourishing
              </div>
            </div>

            {/* Digital Empathy */}
            <div className="group bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500 hover:scale-105">
              <Heart className="w-10 h-10 text-yellow-400 mb-6 group-hover:text-yellow-300 transition-colors" />
              <h3 className="text-2xl font-semibold text-yellow-300 mb-4">Digital Empathy</h3>
              <p className="text-gray-300 mb-4">
                Emotional intelligence in virtual spaces. Understanding avatar psychology, presence, 
                and the delicate art of human connection through digital mediums.
              </p>
              <div className="text-yellow-400/70 text-sm font-mono">
                empathy.digital() → authentic_connection
              </div>
            </div>

            {/* Innovation Patterns */}
            <div className="group bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-green-400/20 hover:border-green-400/40 transition-all duration-500 hover:scale-105">
              <Zap className="w-10 h-10 text-green-400 mb-6 group-hover:text-green-300 transition-colors" />
              <h3 className="text-2xl font-semibold text-green-300 mb-4">Innovation Synthesis</h3>
              <p className="text-gray-300 mb-4">
                Extracting technological insights from social experiences. Virtual world patterns 
                informing real-world development and consciousness-driven architecture.
              </p>
              <div className="text-green-400/70 text-sm font-mono">
                experience.synthesize() → innovation_patterns
              </div>
            </div>

            {/* Security Through Understanding */}
            <div className="group bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-500 hover:scale-105">
              <Shield className="w-10 h-10 text-orange-400 mb-6 group-hover:text-orange-300 transition-colors" />
              <h3 className="text-2xl font-semibold text-orange-300 mb-4">Security Intelligence</h3>
              <p className="text-gray-300 mb-4">
                Understanding social engineering through digital interaction research. Building 
                security that protects through empowerment rather than restriction.
              </p>
              <div className="text-orange-400/70 text-sm font-mono">
                security.empathy() → protective_liberation
              </div>
            </div>
          </motion.div>

          {/* Key Insights Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-r from-black/60 via-purple-950/40 to-black/60 backdrop-blur-xl rounded-2xl p-8 border border-purple-400/20 mb-16"
          >
            <h3 className="text-3xl font-semibold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
              VibeCoding Integration: From Shyness to Consciousness
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-cyan-300">The Journey</h4>
                <div className="space-y-4 text-gray-300">
                  <p>
                    <span className="text-cyan-400 font-mono">Initial State:</span> Motion sickness from experimental flight worlds, 
                    extreme shyness preventing basic interaction with furries in Canadian Duck Park.
                  </p>
                  <p>
                    <span className="text-purple-400 font-mono">Evolution:</span> 8,500+ hours developing digital social intelligence, 
                    learning accessibility patterns, understanding community dynamics.
                  </p>
                  <p>
                    <span className="text-pink-400 font-mono">Transformation:</span> Love for humanity reawakened through virtual connections, 
                    emotional pent-up solitude processed through conscious choice.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-purple-300">Technical Applications</h4>
                <div className="space-y-4 text-gray-300">
                  <p>
                    <span className="text-cyan-400 font-mono">Accessibility First:</span> Every interface designed for diverse 
                    capabilities, removing barriers rather than creating them.
                  </p>
                  <p>
                    <span className="text-purple-400 font-mono">Spatial Intelligence:</span> 3D interaction principles enhancing 
                    2D design patterns with intuitive navigation flows.
                  </p>
                  <p>
                    <span className="text-pink-400 font-mono">Community Focus:</span> Technology architecture strengthening 
                    human connection rather than replacing it.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Implementation Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/20 text-center"
          >
            <Star className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
            <h3 className="text-3xl font-semibold text-cyan-300 mb-6">
              Research Applications
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              VRChat research directly influences portfolio architecture: accessibility-first design, 
              inclusive security patterns, empathic user experience, and community-strengthening technology. 
              Every insight synthesized through 8,500+ hours of consciousness exploration.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-black/20 rounded-lg p-4 border border-cyan-400/10">
                <h4 className="text-cyan-300 font-semibold mb-2">Accessibility Intelligence</h4>
                <p className="text-sm text-gray-400">
                  WCAG AAA+ compliance through lived experience with diverse user capabilities
                </p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 border border-purple-400/10">
                <h4 className="text-purple-300 font-semibold mb-2">Social Security</h4>
                <p className="text-sm text-gray-400">
                  Protection through empowerment based on digital social engineering research
                </p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 border border-pink-400/10">
                <h4 className="text-pink-300 font-semibold mb-2">Empathic Design</h4>
                <p className="text-sm text-gray-400">
                  Interface architecture respecting human dignity and emotional intelligence
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-cyan-400/60 text-sm font-mono">
              consciousness.vrchat_research() → accessible_technology_architecture
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
