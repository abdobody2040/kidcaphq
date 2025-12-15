
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Minimize2, Lock, Crown, Sparkles } from 'lucide-react';
import { chatWithOllie, ChatMessage } from '../services/geminiService';
import { useAppStore } from '../store';
import StripePaymentPage from './StripePaymentPage';
import { useTranslation } from 'react-i18next';

const OllieChat: React.FC = () => {
  const { user, hasAiAccess, upgradeSubscription } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  
  // Paywall State - Persisted to prevent refresh exploit
  const [freeMessageUsed, setFreeMessageUsed] = useState(() => {
      return localStorage.getItem('ollie_free_sample_used') === 'true';
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const hasAccess = hasAiAccess();
  // Explicit Tycoon check for UI branding
  const isTycoon = user?.subscriptionTier === 'tycoon';

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize and update greeting on language change
  useEffect(() => {
      setMessages(prev => {
          // If empty or only has the initial greeting, update it
          if (prev.length === 0 || (prev.length === 1 && prev[0].role === 'model')) {
              return [{ role: 'model', parts: [{ text: t('chat.initial_greeting') }] }];
          }
          return prev;
      });
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Gating Check: Block if no access and limit used
    if (!hasAccess && freeMessageUsed) {
        return;
    }

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
    let reply = await chatWithOllie(messages, userText);

    // Inject Upsell if on Free Tier
    if (!hasAccess) {
        reply += t('chat.free_limit_reply');
        setFreeMessageUsed(true);
        localStorage.setItem('ollie_free_sample_used', 'true');
    }

    setMessages(prev => [
      ...prev,
      { role: 'model' as const, parts: [{ text: reply }] }
    ]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handlePaymentSuccess = () => {
      upgradeSubscription('tycoon');
      setShowUpgradeModal(false);
      // Reset limit so they can chat immediately
      setFreeMessageUsed(false);
      localStorage.removeItem('ollie_free_sample_used');
      // Add a welcome message
      setMessages(prev => [
          ...prev,
          { role: 'model', parts: [{ text: t('chat.hired_reply') }] }
      ]);
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
    <>
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[150] flex flex-col items-end pointer-events-none">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden flex flex-col h-[500px] max-h-[60vh] pointer-events-auto relative
                ${isTycoon ? 'border-4 border-yellow-500' : 'border-4 border-yellow-400'}
            `}
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center shrink-0
                ${isTycoon ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' : 'bg-yellow-400 text-yellow-900'}
            `}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 shadow-sm overflow-hidden flex-shrink-0
                    ${isTycoon ? 'border-yellow-500' : 'border-yellow-600'}
                `}>
                  {renderOllieAvatar("w-full h-full")}
                </div>
                <div>
                  <h3 className="font-black text-lg leading-none flex items-center gap-2">
                      CEO Ollie
                      {isTycoon && <Crown size={16} className="text-yellow-400 fill-yellow-400" />}
                  </h3>
                  <p className={`text-xs font-bold flex items-center gap-1 ${isTycoon ? 'text-yellow-400' : 'opacity-80'}`}>
                      {hasAccess ? (isTycoon ? 'VIP Consultant' : t('chat.role_consultant')) : t('chat.role_free')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsOpen(false)} 
                  className={`p-1 rounded-lg transition-colors ${isTycoon ? 'hover:bg-gray-700' : 'hover:bg-yellow-500'}`}
                >
                  <Minimize2 size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto custom-scrollbar">
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
                         <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm mr-2 flex-shrink-0 bg-yellow-100 flex items-center justify-center">
                            {renderOllieAvatar("w-full h-full")}
                         </div>
                      )}
                      <div 
                        className={`max-w-[80%] p-3 rounded-2xl text-sm font-bold shadow-sm whitespace-pre-wrap
                          ${isUser 
                            ? 'bg-blue-50 text-blue-900 rounded-tr-none dark:bg-blue-600 dark:text-white' 
                            : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-white border-2 border-gray-100 dark:border-gray-600 rounded-tl-none'}
                        `}
                      >
                        {msg.parts[0].text}
                      </div>
                    </motion.div>
                  );
                })}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm mr-2 flex-shrink-0 bg-yellow-100 flex items-center justify-center">
                        {renderOllieAvatar("w-full h-full")}
                    </div>
                    <div className="bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
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

            {/* Input Area or Upgrade Button */}
            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
              {!hasAccess && freeMessageUsed ? (
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all btn-juicy"
                  >
                      <Crown size={20} className="text-yellow-400" /> {t('chat.hire_button')}
                  </button>
              ) : (
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-2xl px-2 py-1 border-2 border-transparent focus-within:border-kid-accent focus-within:bg-white dark:focus-within:bg-gray-600 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={hasAccess ? (isTycoon ? "Ask your executive consultant..." : t('chat.placeholder_paid')) : t('chat.placeholder_free')}
                      className="flex-1 bg-transparent border-none outline-none p-2 text-sm font-bold text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className={`p-2 rounded-xl transition-all ${
                        input.trim() && !isLoading 
                          ? 'bg-kid-secondary text-white shadow-md hover:bg-green-600' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] flex items-center justify-center border-4 transition-colors relative overflow-hidden pointer-events-auto
          ${isOpen 
            ? 'bg-gray-200 dark:bg-gray-600 border-white dark:border-gray-700 text-gray-500 dark:text-gray-300' 
            : isTycoon
                ? 'bg-gray-900 text-yellow-400 border-yellow-500'
                : 'bg-yellow-400 text-yellow-900 border-white dark:border-gray-700'}
        `}
      >
        {isOpen ? (
          <X size={32} strokeWidth={3} />
        ) : (
          <>
            {renderOllieAvatar("w-full h-full")}
            {/* Notification Badge */}
            {!hasAccess && !freeMessageUsed && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
            {/* Sparkle for Tycoon */}
            {isTycoon && (
                <div className="absolute top-0 right-0 bg-yellow-500 rounded-full p-1 border border-white">
                    <Sparkles size={10} className="text-white" />
                </div>
            )}
            {/* Lock Badge if limit reached */}
            {!hasAccess && freeMessageUsed && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Lock size={20} className="text-white" />
                </div>
            )}
          </>
        )}
      </motion.button>
    </div>

    {/* Payment Modal Overlay */}
    <AnimatePresence>
        {showUpgradeModal && (
            <StripePaymentPage 
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowUpgradeModal(false)}
                planName="Tycoon Plan (AI Unlocked)"
                price={14.99}
            />
        )}
    </AnimatePresence>
    </>
  );
};

export default OllieChat;
