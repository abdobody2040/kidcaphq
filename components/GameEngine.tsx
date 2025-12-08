
import React from 'react';
import { useAppStore } from '../store';
import { BusinessSimulation } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Import Templates
import SimulationTemplate from './game-templates/SimulationTemplate';
import ClickerTemplate from './game-templates/ClickerTemplate';
import SortingTemplate from './game-templates/SortingTemplate';
import DrivingTemplate from './game-templates/DrivingTemplate';
import MatchingTemplate from './game-templates/MatchingTemplate';
import RhythmTemplate from './game-templates/RhythmTemplate';

interface GameEngineProps {
  gameId: string;
  onExit: () => void;
  previewConfig?: BusinessSimulation; // For Admin Testing
}

const GameEngine: React.FC<GameEngineProps> = ({ gameId, onExit, previewConfig }) => {
  const { games } = useAppStore();
  
  // Use preview config if provided (Admin Mode), otherwise find in store
  const gameConfig = previewConfig || games.find(g => g.business_id === gameId);

  if (!gameConfig) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-500">
              <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
              <button onClick={onExit} className="bg-gray-800 text-white px-6 py-2 rounded-xl font-bold">Exit</button>
          </div>
      );
  }

  // Common Layout Wrapper
  const renderGameContent = () => {
      switch (gameConfig.game_type) {
          case 'simulation_tycoon':
              return <SimulationTemplate config={gameConfig} onExit={onExit} />;
          case 'clicker_idle':
              return <ClickerTemplate config={gameConfig} onExit={onExit} />;
          case 'sorting_game':
              return <SortingTemplate config={gameConfig} onExit={onExit} />;
          case 'driving_game':
              return <DrivingTemplate config={gameConfig} onExit={onExit} />;
          case 'matching_game':
              return <MatchingTemplate config={gameConfig} onExit={onExit} />;
          case 'rhythm_game':
              return <RhythmTemplate config={gameConfig} onExit={onExit} />;
          default:
              return (
                  <div className="text-center p-10">
                      <h2 className="text-xl font-bold">Game Type '{gameConfig.game_type}' Not Implemented Yet</h2>
                      <p className="text-gray-500">Please check back later.</p>
                  </div>
              );
      }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
       {/* Global Game Header (Can be overridden by templates if needed) */}
       <div className="bg-gray-800 p-4 flex items-center justify-between shadow-md z-10">
           <div className="flex items-center gap-4 text-white">
               <button onClick={onExit} className="p-2 hover:bg-gray-700 rounded-full transition-colors"><ArrowLeft /></button>
               <div>
                   <h1 className="font-black text-lg">{gameConfig.name}</h1>
                   <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{gameConfig.category}</div>
               </div>
           </div>
           <div className="px-3 py-1 bg-gray-700 rounded text-xs font-mono text-gray-400">
               Engine v2.1
           </div>
       </div>

       <div className="flex-1 overflow-hidden bg-gray-50 relative">
           {renderGameContent()}
       </div>
    </div>
  );
};

export default GameEngine;
