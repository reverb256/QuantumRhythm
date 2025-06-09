import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Gamepad2, Heart, Star } from "lucide-react";

export default function VRChat() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-cyan-300 hover:text-cyan-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              VRChat Social Dynamics
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exploring virtual social intelligence, community building, and human connection in digital spaces
            </p>
          </motion.div>

          {/* VRChat Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-400/20">
              <Users className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">Social Intelligence</h3>
              <p className="text-gray-300">
                Understanding community dynamics, avatar psychology, and virtual presence through thousands of hours in VRChat environments.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-purple-400/20">
              <Gamepad2 className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-purple-300 mb-3">Gaming Philosophy</h3>
              <p className="text-gray-300">
                Applying gaming methodologies to real-world problems, from rhythm game precision to strategic thinking patterns.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-pink-400/20">
              <Heart className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-pink-300 mb-3">Human Connection</h3>
              <p className="text-gray-300">
                Building meaningful relationships and communities in virtual spaces, understanding the future of digital interaction.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-yellow-400/20">
              <Star className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-300 mb-3">Innovation Insights</h3>
              <p className="text-gray-300">
                Extracting innovation patterns from virtual world experiences and applying them to technological development.
              </p>
            </div>
          </motion.div>

          {/* VRChat Gallery Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-cyan-400/20 text-center"
          >
            <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Virtual Experiences Gallery</h3>
            <p className="text-gray-300 mb-6">
              A curated collection of meaningful moments and insights from virtual world exploration
            </p>
            <div className="text-cyan-400/60 text-sm">
              Coming soon: Interactive VRChat experience showcase
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}