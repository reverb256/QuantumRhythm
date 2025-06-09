export default function Footer() {
  return (
    <footer className="py-12 bg-[var(--space-black)] border-t border-[var(--synthwave-cyan)]/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="font-bold text-lg md:text-xl text-[var(--synthwave-cyan)] mb-4 md:mb-0 flex items-center">
            <i className="fas fa-code mr-2"></i>
            reverb256
          </div>
          
          <div className="text-gray-400 text-center md:text-right">
            <p className="mb-2 text-sm md:text-base">VibeCoder & Digital Architect</p>
            <p className="text-xs md:text-sm">Built with 🇨🇦 Canadian values & 🚀 AI-enhanced development</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[var(--synthwave-cyan)]/20 text-center text-gray-500 text-xs md:text-sm">
          <p>&copy; 2024 reverb256. Crafted with classical wisdom and cybernetic precision.</p>
        </div>
      </div>
    </footer>
  );
}
