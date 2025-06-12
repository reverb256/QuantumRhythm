import { Link } from "wouter";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      
      {/* Clean Background System */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-gray-900" />
      </div>
      
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 p-12">
            <div className="mb-8">
              <div className="text-6xl text-cyan-400 mb-4">🤖</div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-purple-400 mb-6">
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
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                <span className="mr-2">🏠</span>
                Return to Consciousness
              </Link>
              
              <div className="text-sm text-gray-400 mt-6">
                <p>Error Code: NEURAL_PATH_NOT_FOUND</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
