/**
 * Speech Interface Component
 * Visual interface for TTS/STT communication with characters
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X } from 'lucide-react';
import { useSpeechCommunication, ConversationMessage } from '../services/SpeechCommunicationEngine';

interface SpeechInterfaceProps {
  onCharacterSpeak?: (characterName: string, text: string) => void;
  className?: string;
}

export function SpeechInterface({ onCharacterSpeak, className = '' }: SpeechInterfaceProps) {
  const {
    isListening,
    messages,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    speakAsCharacter,
    clearConversation
  } = useSpeechCommunication();

  const [showConversation, setShowConversation] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Notify parent when character speaks
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.speaker === 'character' && latestMessage.characterId && onCharacterSpeak) {
      onCharacterSpeak(latestMessage.characterId, latestMessage.text);
    }
  }, [messages, onCharacterSpeak]);

  const handleMicToggle = () => {
    if (isSupported.speechRecognition) {
      toggleListening();
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      // Mute all speech synthesis
      window.speechSynthesis.cancel();
    }
  };

  const getLatestUserMessage = () => {
    const userMessages = messages.filter(m => m.speaker === 'user');
    return userMessages[userMessages.length - 1];
  };

  const getLatestCharacterMessage = () => {
    const characterMessages = messages.filter(m => m.speaker === 'character');
    return characterMessages[characterMessages.length - 1];
  };

  if (!isSupported.speechRecognition && !isSupported.speechSynthesis) {
    return null; // Hide component if no speech support
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Main Control Panel */}
      <motion.div
        className="bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 
                   backdrop-blur-md border border-cyan-400/30 rounded-xl p-4 
                   shadow-2xl shadow-cyan-400/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          {/* Speech Recognition Button */}
          {isSupported.speechRecognition && (
            <motion.button
              onClick={handleMicToggle}
              className={`p-3 rounded-lg transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500/20 border-red-400 text-red-400 shadow-lg shadow-red-400/20' 
                  : 'bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30'
              } border`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Mic size={20} />
                </motion.div>
              ) : (
                <MicOff size={20} />
              )}
            </motion.button>
          )}

          {/* Mute Button */}
          {isSupported.speechSynthesis && (
            <motion.button
              onClick={handleMuteToggle}
              className={`p-3 rounded-lg transition-all duration-200 ${
                isMuted 
                  ? 'bg-red-500/20 border-red-400 text-red-400' 
                  : 'bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30'
              } border`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>
          )}

          {/* Conversation History Button */}
          <motion.button
            onClick={() => setShowConversation(!showConversation)}
            className="p-3 rounded-lg bg-purple-500/20 border border-purple-400 
                       text-purple-400 hover:bg-purple-500/30 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={20} />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs 
                             rounded-full w-5 h-5 flex items-center justify-center">
                {messages.length > 99 ? '99+' : messages.length}
              </span>
            )}
          </motion.button>
        </div>

        {/* Status Indicators */}
        <div className="mt-3 flex flex-col gap-1">
          {isListening && (
            <motion.div 
              className="text-red-400 text-sm flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Listening...
            </motion.div>
          )}
          
          {getLatestUserMessage() && (
            <motion.div 
              className="text-cyan-400 text-xs max-w-48 truncate"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              You: {getLatestUserMessage().text}
            </motion.div>
          )}
          
          {getLatestCharacterMessage() && (
            <motion.div 
              className="text-purple-400 text-xs max-w-48 truncate"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {getLatestCharacterMessage().characterId}: {getLatestCharacterMessage().text}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Conversation History Panel */}
      <AnimatePresence>
        {showConversation && (
          <motion.div
            className="absolute bottom-full right-0 mb-4 w-96 max-h-96 
                       bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 
                       backdrop-blur-md border border-cyan-400/30 rounded-xl 
                       shadow-2xl shadow-cyan-400/20 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-cyan-400/20 flex items-center justify-between">
              <h3 className="text-cyan-400 font-bold">Conversation History</h3>
              <div className="flex gap-2">
                <button
                  onClick={clearConversation}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowConversation(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 max-h-80 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center text-sm">
                  No conversation yet. Start by speaking or clicking the microphone!
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.speaker === 'user'
                        ? 'bg-cyan-500/20 border-l-4 border-cyan-400 ml-8'
                        : 'bg-purple-500/20 border-l-4 border-purple-400 mr-8'
                    }`}
                    initial={{ opacity: 0, x: message.speaker === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`text-xs mb-1 ${
                      message.speaker === 'user' ? 'text-cyan-400' : 'text-purple-400'
                    }`}>
                      {message.speaker === 'user' ? 'You' : message.characterId}
                      <span className="text-gray-500 ml-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-white text-sm">{message.text}</div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Visualization */}
      {isListening && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2
                     flex gap-1 items-end"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-red-400 rounded-full"
              animate={{
                height: [4, 20, 4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default SpeechInterface;