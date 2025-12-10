
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { BusinessSimulation } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import GameTutorialModal from './common/GameTutorialModal';

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
  const [showTutorial, setShowTutorial] = useState(true);
  
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

  const getInstructions = (type: string) => {
      switch(type) {
        case 'simulation_tycoon': 
            return ["Set your strategy sliders before the day starts.", "Buy upgrades to attract more customers.", "Watch out for random daily events!"];
        case 'clicker_idle': 
            return ["Tap the screen to earn points/money.", "Buy auto-clickers to earn while idle.", "Unlock powerful upgrades to scale up."];
        case 'driving_game': 
            return ["Use Arrow Keys (or buttons) to move.", "Reach the targets before time runs out.", "Avoid obstacles to keep your speed."];
        case 'matching_game': 
            return ["Look at the customer's order carefully.", "Select the correct ingredients in order.", "Be fast to earn bonus points!"];
        case 'rhythm_game': 
            return ["Watch the falling notes.", "Tap the button when they hit the line.", "Keep your combo streak alive!"];
        case 'sorting_game': 
            return ["Sort items into the correct bins.", "Left, Down, or Right based on the type.", "Don't let the trash pile up!"];
        default: return ["Play and have fun!"];
      }
  };

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
       {/* Tutorial Overlay */}
       {showTutorial && (
           <GameTutorialModal 
               onStart={() => setShowTutorial(false)}
               title={gameConfig.name}
               description={gameConfig.description}
               icon={gameConfig.visual_config?.icon}
               color={`bg-[${gameConfig.visual_config?.colors.primary}]`} // Note: inline style might be safer for dynamic colors
               instructions={getInstructions(gameConfig.game_type)}
           />
       )}

       {/* Global Game Header */}
       <div className="bg-gray-800 p-4 flex items-center justify-between shadow-md z-10">
           <div className="flex items-center gap-4 text-white">
               <button onClick={onExit} className="p-2 hover:bg-gray-700 rounded-full transition-colors"><ArrowLeft /></button>
               <div>
                   <h1 className="font-black text-lg">{gameConfig.name}</h1>
                   <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{gameConfig.category}</div>
               </div>
           </div>
           <button onClick={() => setShowTutorial(true)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold text-gray-300">
               ? Help
           </button>
       </div>

       <div className="flex-1 overflow-hidden bg-gray-50 relative">
           {renderGameContent()}
       </div>
    </div>
  );
};

export default GameEngine;
