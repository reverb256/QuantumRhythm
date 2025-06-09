interface NeuralBackgroundProps {
  intensity?: number;
  speed?: number;
  theme?: 'quantum' | 'matrix' | 'consciousness' | 'dojo' | 'trading';
}

export default function NeuralBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-cyan-900/10" />
    </div>
  );
}