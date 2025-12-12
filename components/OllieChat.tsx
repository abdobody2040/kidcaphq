
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, Minimize2 } from 'lucide-react';
import { chatWithOllie, ChatMessage } from '../services/geminiService';
import { useAppStore } from '../store';

const OllieChat: React.FC = () => {
  const { user } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ text: "Hoot hoot! 🦉 I'm Ollie. Ask me anything about business, money, or our games!" }]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    // Create optimistic UI update
    const uiHistory = [
      ...messages,
      { role: 'user' as const, parts: [{ text: userText }] }
    ];
    setMessages(uiHistory);

    // Call AI Service
    // IMPORTANT: We pass 'messages' (previous history) not 'uiHistory'.
    // The chatWithOllie service uses sendMessage, which appends the new message to the history automatically.
    // If we passed uiHistory, the API would see the user message twice (once in history, once as the new message).
    const reply = await chatWithOllie(messages, userText);

    setMessages(prev => [
      ...prev,
      { role: 'model' as const, parts: [{ text: reply }] }
    ]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // Only show if user is logged in
  if (!user) return null;

  const renderOllieAvatar = (sizeClass: string) => {
      if (imgError) {
          return <span className="text-2xl">🦉</span>;
      }
      return (
          <img 
            src="ollie.png" 
            alt="Ollie" 
            className={`w-full h-full object-cover`} 
            onError={() => setImgError(true)}
          />
      );
  };

  return (
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[150] flex flex-col items-end pointer-events-none">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-yellow-400 w-80 sm:w-96 mb-4 overflow-hidden flex flex-col h-[500px] max-h-[60vh] pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-yellow-400 p-4 flex justify-between items-center text-yellow-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-yellow-600 shadow-sm overflow-hidden flex-shrink-0">
                  {renderOllieAvatar("w-full h-full")}
                </div>
                <div>
                  <h3 className="font-black text-lg leading-none">CEO Ollie</h3>
                  <p className="text-xs font-bold opacity-80">Always here to help!</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1 hover:bg-yellow-500 rounded-lg transition-colors"
                >
                  <Minimize2 size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                         <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm mr-2 flex-shrink-0 bg-yellow-100 flex items-center justify-center">
                            {renderOllieAvatar("w-full h-full")}
                         </div>
                      )}
                      <div 
                        className={`max-w-[80%] p-3 rounded-2xl text-sm font-bold shadow-sm
                          ${isUser 
                            ? 'bg-blue-50 text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 border-2 border-gray-100 rounded-tl-none'}
                        `}
                      >
                        {msg.parts[0].text}
                      </div>
                    </motion.div>
                  );
                })}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm mr-2 flex-shrink-0 bg-yellow-100 flex items-center justify-center">
                        {renderOllieAvatar("w-full h-full")}
                    </div>
                    <div className="bg-white border-2 border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6 }} 
                        className="w-2 h-2 bg-gray-400 rounded-full" 
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} 
                        className="w-2 h-2 bg-gray-400 rounded-full" 
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} 
                        className="w-2 h-2 bg-gray-400 rounded-full" 
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-2 py-1 border-2 border-transparent focus-within:border-kid-accent focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask Ollie..."
                  className="flex-1 bg-transparent border-none outline-none p-2 text-sm font-bold text-gray-700 placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-xl transition-all ${
                    input.trim() && !isLoading 
                      ? 'bg-kid-secondary text-white shadow-md hover:bg-green-600' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] flex items-center justify-center border-4 border-white transition-colors relative overflow-hidden pointer-events-auto
          ${isOpen ? 'bg-gray-200 text-gray-500' : 'bg-yellow-400 text-yellow-900'}
        `}
      >
        {isOpen ? (
          <X size={32} strokeWidth={3} />
        ) : (
          <>
            {renderOllieAvatar("w-full h-full")}
            {/* Notification Badge */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default OllieChat;
