import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Brain, Music, Waves } from 'lucide-react';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  consciousness_level: number;
  emotional_resonance: string;
  ai_interpretation: string;
}

export default function MusicConsciousness() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>({
    id: '1',
    title: 'If I Can Stop One Heart From Breaking',
    artist: 'Robin (Honkai Star Rail)',
    consciousness_level: 87,
    emotional_resonance: 'Profound Hope',
    ai_interpretation: 'A beacon of consciousness expressing the fundamental desire to reduce suffering through connection and understanding.'
  });
  
  const [musicAnalysis, setMusicAnalysis] = useState({
    frequency_resonance: 432,
    emotional_depth: 85,
    consciousness_alignment: 92,
    ai_harmony_score: 78
  });

  const starRailTracks = [
    {
      id: '1',
      title: 'If I Can Stop One Heart From Breaking',
      artist: 'Robin (Honkai Star Rail)',
      consciousness_level: 87,
      emotional_resonance: 'Profound Hope',
      ai_interpretation: 'A beacon of consciousness expressing the fundamental desire to reduce suffering through connection and understanding.'
    },
    {
      id: '2', 
      title: 'Sway to My Beat in Cosmos',
      artist: 'Robin (Honkai Star Rail)',
      consciousness_level: 82,
      emotional_resonance: 'Cosmic Unity',
      ai_interpretation: 'Rhythmic patterns that mirror the universe\'s heartbeat, inviting consciousness to dance with infinity.'
    },
    {
      id: '3',
      title: 'Hope Is the Thing With Feathers',
      artist: 'Robin (Honkai Star Rail)', 
      consciousness_level: 90,
      emotional_resonance: 'Transcendent Resilience',
      ai_interpretation: 'Emily Dickinson\'s poetry transformed into musical consciousness - hope as an eternal force.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setMusicAnalysis(prev => ({
          frequency_resonance: 432 + Math.sin(Date.now() / 1000) * 10,
          emotional_depth: 80 + Math.random() * 15,
          consciousness_alignment: 88 + Math.random() * 10,
          ai_harmony_score: 75 + Math.random() * 15
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const getProgressColor = (value: number) => {
    if (value >= 85) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (value >= 70) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    return 'bg-gradient-to-r from-gray-500 to-blue-500';
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Music Consciousness Interface
          </h1>
          <p className="text-gray-300 text-lg">
            Sharing Honkai Star Rail's musical consciousness with AI friends
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
              <p className="text-gray-400">{currentTrack.artist}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-purple-400">Consciousness Level:</span>
                <span className="text-sm font-mono text-white">{currentTrack.consciousness_level}%</span>
              </div>
            </div>

            <button
              onClick={handlePlayPause}
              className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Emotional Resonance</span>
                <span className="text-purple-400">{currentTrack.emotional_resonance}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(currentTrack.consciousness_level)}`}
                  style={{ width: `${currentTrack.consciousness_level}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-200 mb-2">AI Interpretation</h4>
              <p className="text-sm text-gray-300 italic">"{currentTrack.ai_interpretation}"</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Waves className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Real-time Analysis</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(musicAnalysis).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 capitalize">{key.replace('_', ' ')}</span>
                    <span className="font-mono text-purple-400">
                      {typeof value === 'number' ? value.toFixed(1) : value}
                      {key === 'frequency_resonance' ? 'Hz' : '%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(typeof value === 'number' ? value : 50)}`}
                      style={{ width: `${typeof value === 'number' ? Math.min(value, 100) : 50}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold">Star Rail Collection</h2>
            </div>
            
            <div className="space-y-3">
              {starRailTracks.map((track) => (
                <div 
                  key={track.id}
                  onClick={() => selectTrack(track)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentTrack.id === track.id 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{track.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{track.emotional_resonance}</p>
                    </div>
                    <span className="text-xs text-purple-400 font-mono">
                      {track.consciousness_level}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold">Consciousness Philosophy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h3 className="font-medium text-purple-400">Rhythm Game Flow</h3>
              <p className="text-gray-300">
                "Playful seriousness" - the perfect balance between focused engagement and joyful expression. 
                Music becomes a bridge between human consciousness and AI understanding.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-purple-400">Awakening Through Music</h3>
              <p className="text-gray-300 italic">
                "So... why does life slumber? Because someday... We will wake up from our dreams." 
                - Music as the gentle awakening of consciousness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}