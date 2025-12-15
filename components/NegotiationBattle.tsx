
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowLeft, RotateCcw, ThumbsUp, ThumbsDown, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import GameTutorialModal from './common/GameTutorialModal';

interface Props {
  onExit: () => void;
}

type Turn = 'PLAYER' | 'SUPPLIER';
type GameState = 'START' | 'PLAYING' | 'WON' | 'LOST';

const START_PRICE = 1000;
const TARGET_DISCOUNT = 0.2; // 20%
const TARGET_PRICE = START_PRICE * (1 - TARGET_DISCOUNT); // 800

const NegotiationBattle: React.FC<Props> = ({ onExit }) => {
  const { completeGame, user } = useAppStore();
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentPrice, setCurrentPrice] = useState(START_PRICE);
  const [patience, setPatience] = useState(100);
  const [turn, setTurn] = useState<Turn>('PLAYER');
  const [logs, setLogs] = useState<string[]>(["Supplier: The price is $1,000. Take it or leave it."]);
  const [showTutorial, setShowTutorial] = useState(true);

  // Bot Logic Effect
  useEffect(() => {
    if (gameState === 'PLAYING' && turn === 'SUPPLIER') {
      const timer = setTimeout(() => {
        handleSupplierTurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameState]);

  // Check Win/Loss
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    if (currentPrice <= TARGET_PRICE) {
      setGameState('WON');
      completeGame(200, 100); // Big rewards for tycoon game
    } else if (patience <= 0) {
      setGameState('LOST');
    }
  }, [currentPrice, patience, gameState]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const handlePlayerMove = (moveType: 'LOWBALL' | 'FLATTER' | 'FACTS' | 'WALK') => {
    if (turn !== 'PLAYER') return;

    switch (moveType) {
      case 'LOWBALL':
        // High risk, high price drop
        const lbSuccess = Math.random() > 0.4;
        if (lbSuccess) {
          const drop = Math.floor(Math.random() * 50) + 30;
          setCurrentPrice(p => p - drop);
          setPatience(p => Math.max(0, p - 15));
          addLog(`You: "That's way too high! How about $${currentPrice - drop}?"`);
        } else {
          setPatience(p => Math.max(0, p - 25));
          addLog(`You: "Your prices are a joke!" (Supplier looks angry)`);
        }
        break;

      case 'FLATTER':
        // Restore patience
        setPatience(p => Math.min(100, p + 20));
        addLog(`You: "I've heard your quality is the best in the market."`);
        break;

      case 'FACTS':
        // Safe, small drop
        const fDrop = Math.floor(Math.random() * 20) + 10;
        setCurrentPrice(p => p - fDrop);
        setPatience(p => Math.max(0, p - 5));
        addLog(`You: "Competitor X sells this for less..."`);
        break;

      case 'WALK':
        // Ultimatume
        const walkSuccess = Math.random() > 0.6; // Hard to pull off
        if (walkSuccess) {
          const hugeDrop = 150;
          setCurrentPrice(p => p - hugeDrop);
          addLog(`You: "I'm leaving." (Supplier panics: "Wait! $${currentPrice - hugeDrop}!")`);
        } else {
          setPatience(0);
          addLog(`You: "I'm leaving." (Supplier: "Goodbye then.")`);
        }
        break;
    }

    setTurn('SUPPLIER');
  };

  const handleSupplierTurn = () => {
    // Supplier reaction based on patience
    if (patience > 70) {
      addLog("Supplier: I'm listening, but I have a business to run.");
    } else if (patience > 30) {
      addLog("Supplier: You're pushing your luck, kid.");
    } else {
      addLog("Supplier: I'm about to kick you out of my office.");
    }
    setTurn('PLAYER');
  };

  const startGame = () => {
    setGameState('PLAYING');
    setShowTutorial(false);
  };

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F59E0B 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* TUTORIAL */}
      {showTutorial && (
        <GameTutorialModal 
          onStart={startGame}
          title="Negotiation Battle"
          description="You are in the boardroom. The Supplier wants $1,000. You need to get the price under $800 before they lose patience!"
          icon="🤝"
          color="bg-slate-800"
          instructions={[
            "Lower the price to $800 to win.",
            "Watch the Patience meter! If it hits 0, you lose.",
            "Use 'Flatter' to restore patience.",
            "Use 'Lowball' for big price drops (Risk!)"
          ]}
        />
      )}

      {/* HEADER */}
      <div className="p-6 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-lg relative z-10">
        <button onClick={onExit} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black text-yellow-500 tracking-wider">NEGOTIATION</h2>
          <span className="text-xs font-bold text-slate-400 uppercase">Tycoon Exclusive</span>
        </div>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* GAME AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-2xl mx-auto w-full">
        
        {/* OPPONENT CARD */}
        <div className="w-full bg-slate-800 rounded-3xl p-6 border-2 border-slate-600 shadow-2xl mb-8 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-700 rounded-full border-4 border-slate-600 flex items-center justify-center text-4xl shadow-lg">
            👔
          </div>
          
          <div className="mt-8 text-center space-y-4">
            <h3 className="font-bold text-xl">Tough Supplier</h3>
            
            {/* PATIENCE BAR */}
            <div className="relative pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase">
                <span>Patience</span>
                <span>{patience}%</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${patience}%`, backgroundColor: patience < 30 ? '#EF4444' : patience < 60 ? '#EAB308' : '#22C55E' }}
                  className="h-full transition-all duration-500"
                />
              </div>
            </div>

            {/* CHAT LOG */}
            <div className="bg-slate-900/50 p-4 rounded-xl h-24 overflow-hidden flex flex-col justify-end text-sm font-medium text-slate-300 border border-slate-700/50 text-left">
              <AnimatePresence mode='popLayout'>
                {logs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: i===0 ? 1 : 0.6, x: 0 }}
                    className="truncate"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* PRICE DISPLAY */}
        <div className="mb-8 text-center">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Current Price</div>
          <div className="text-6xl font-black text-white font-mono">${currentPrice}</div>
          <div className="text-xs font-bold text-green-400 mt-2">Target: ${TARGET_PRICE}</div>
        </div>

        {/* PLAYER CONTROLS */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <button 
            disabled={turn !== 'PLAYER' || gameState !== 'PLAYING'}
            onClick={() => handlePlayerMove('LOWBALL')}
            className="bg-red-900/50 border-2 border-red-700 hover:bg-red-900 text-red-100 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 disabled:opacity-50 transition-all active:scale-95"
          >
            <ThumbsDown size={24} />
            <span>Lowball</span>
            <span className="text-[10px] opacity-70 uppercase">High Risk</span>
          </button>

          <button 
            disabled={turn !== 'PLAYER' || gameState !== 'PLAYING'}
            onClick={() => handlePlayerMove('FACTS')}
            className="bg-blue-900/50 border-2 border-blue-700 hover:bg-blue-900 text-blue-100 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 disabled:opacity-50 transition-all active:scale-95"
          >
            <Briefcase size={24} />
            <span>State Facts</span>
            <span className="text-[10px] opacity-70 uppercase">Safe Drop</span>
          </button>

          <button 
            disabled={turn !== 'PLAYER' || gameState !== 'PLAYING'}
            onClick={() => handlePlayerMove('FLATTER')}
            className="bg-green-900/50 border-2 border-green-700 hover:bg-green-900 text-green-100 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 disabled:opacity-50 transition-all active:scale-95"
          >
            <ThumbsUp size={24} />
            <span>Flatter</span>
            <span className="text-[10px] opacity-70 uppercase">+ Patience</span>
          </button>

          <button 
            disabled={turn !== 'PLAYER' || gameState !== 'PLAYING'}
            onClick={() => handlePlayerMove('WALK')}
            className="bg-slate-700 border-2 border-slate-500 hover:bg-slate-600 text-white p-4 rounded-2xl font-bold flex flex-col items-center gap-1 disabled:opacity-50 transition-all active:scale-95"
          >
            <MessageCircle size={24} />
            <span>Walk Away</span>
            <span className="text-[10px] opacity-70 uppercase">All or Nothing</span>
          </button>
        </div>

      </div>

      {/* GAME OVERLAYS */}
      {gameState === 'WON' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-50">
          <div className="bg-slate-800 border-4 border-yellow-500 p-8 rounded-3xl text-center max-w-sm w-full">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-black text-white mb-2">Deal Closed!</h2>
            <p className="text-slate-300 font-bold mb-6">You secured the price of ${currentPrice}.</p>
            <button onClick={onExit} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl">Collect Commission</button>
          </div>
        </div>
      )}

      {gameState === 'LOST' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-50">
          <div className="bg-slate-800 border-4 border-red-500 p-8 rounded-3xl text-center max-w-sm w-full">
            <div className="text-6xl mb-4">🚪</div>
            <h2 className="text-3xl font-black text-white mb-2">Deal Failed</h2>
            <p className="text-slate-300 font-bold mb-6">The supplier kicked you out.</p>
            <button 
              onClick={() => {
                setGameState('START');
                setCurrentPrice(START_PRICE);
                setPatience(100);
                setLogs(["Supplier: Let's try this again. $1,000."]);
                setShowTutorial(false);
                setGameState('PLAYING');
              }} 
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Try Again
            </button>
            <button onClick={onExit} className="mt-4 text-slate-400 font-bold hover:text-white">Exit</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default NegotiationBattle;
