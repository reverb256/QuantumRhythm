import { Link } from "wouter";
import Navigation from "@/components/navigation";
import GeometricBackground from "@/components/geometric-background";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white relative">
      <Navigation />
      <GeometricBackground />
      
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="glass-morphism p-12 rounded-2xl cyber-border">
            <div className="mb-8">
              <i className="fas fa-robot text-6xl text-[var(--synthwave-cyan)] mb-4 block"></i>
              <h1 className="text-6xl font-bold text-gradient-cyan mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-[var(--synthwave-pink)] mb-6">
                Neural Network Disconnected
              </h2>
            </div>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              The requested data pathway could not be established. The cybernetic matrix 
              has no record of this digital location in the neural networks.
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                <i className="fas fa-home mr-2"></i>
                Return to Base Station
              </Link>
              
              <div className="text-sm text-gray-400 mt-6">
                <p>Error Code: NEURAL_PATH_NOT_FOUND</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
