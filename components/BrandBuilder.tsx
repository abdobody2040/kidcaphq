
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { BusinessLogo } from '../types';
import { Save, Rocket, Pizza, Star, Smile, Lightbulb, Coffee, Music, Camera, Globe, Anchor, Cpu, Car, Zap, Circle, Square, AppWindow } from 'lucide-react';

interface BrandBuilderProps {
  onBack: () => void;
}

const COLORS = [
  '#FFC800', // Yellow
  '#F59E0B', // Orange
  '#58CC02', // Green
  '#10B981', // Emerald
  '#2B70C9', // Blue
  '#3B82F6', // Light Blue
  '#6366F1', // Indigo
  '#EF4444', // Red
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#64748B', // Slate
  '#000000', // Black
  '#FFFFFF', // White
];

const ICONS = [
  { id: 'rocket', icon: Rocket, label: 'Rocket' },
  { id: 'pizza', icon: Pizza, label: 'Pizza' },
  { id: 'star', icon: Star, label: 'Star' },
  { id: 'smile', icon: Smile, label: 'Happy' },
  { id: 'bulb', icon: Lightbulb, label: 'Idea' },
  { id: 'coffee', icon: Coffee, label: 'Cafe' },
  { id: 'music', icon: Music, label: 'Music' },
  { id: 'camera', icon: Camera, label: 'Media' },
  { id: 'globe', icon: Globe, label: 'Global' },
  { id: 'anchor', icon: Anchor, label: 'Marine' },
  { id: 'cpu', icon: Cpu, label: 'Tech' },
  { id: 'car', icon: Car, label: 'Auto' },
  { id: 'zap', icon: Zap, label: 'Energy' },
];

const BrandBuilder: React.FC<BrandBuilderProps> = ({ onBack }) => {
  const { user, updateBusinessLogo, completeGame } = useAppStore();
  const [logoState, setLogoState] = useState<BusinessLogo>(user?.businessLogo || {
    companyName: 'My Business',
    backgroundColor: '#FFC800',
    icon: 'rocket',
    iconColor: '#FFFFFF',
    shape: 'circle'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateBusinessLogo(logoState);
    completeGame(100, 25); // Award some XP for being creative
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        onBack();
    }, 1500);
  };

  const SelectedIcon = ICONS.find(i => i.id === logoState.icon)?.icon || Rocket;

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row h-[700px]">
      
      {/* Controls Sidebar */}
      <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 mb-6">
            <button onClick={onBack} className="text-gray-400 font-bold hover:text-gray-600">
                &larr; Back
            </button>
            <h2 className="text-2xl font-black text-gray-800">Brand Builder</h2>
        </div>

        <div className="space-y-6">
            {/* Name Input */}
            <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Company Name</label>
                <input 
                    type="text" 
                    maxLength={15}
                    value={logoState.companyName}
                    onChange={(e) => setLogoState({...logoState, companyName: e.target.value})}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold text-gray-800 focus:border-kid-accent outline-none"
                    placeholder="Kid Inc."
                />
            </div>

            {/* Shape Picker */}
            <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Logo Shape</label>
                <div className="flex gap-4 bg-white p-2 rounded-xl border border-gray-200">
                    <button 
                       onClick={() => setLogoState({...logoState, shape: 'circle'})}
                       className={`flex-1 p-2 rounded-lg flex justify-center ${logoState.shape === 'circle' ? 'bg-kid-primary text-yellow-900' : 'text-gray-400'}`}
                    >
                        <Circle size={24} fill={logoState.shape === 'circle' ? "currentColor" : "none"} />
                    </button>
                    <button 
                       onClick={() => setLogoState({...logoState, shape: 'rounded'})}
                       className={`flex-1 p-2 rounded-lg flex justify-center ${logoState.shape === 'rounded' ? 'bg-kid-primary text-yellow-900' : 'text-gray-400'}`}
                    >
                        <AppWindow size={24} fill={logoState.shape === 'rounded' ? "currentColor" : "none"} />
                    </button>
                    <button 
                       onClick={() => setLogoState({...logoState, shape: 'square'})}
                       className={`flex-1 p-2 rounded-lg flex justify-center ${logoState.shape === 'square' ? 'bg-kid-primary text-yellow-900' : 'text-gray-400'}`}
                    >
                        <Square size={24} fill={logoState.shape === 'square' ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            {/* Background Color Picker */}
            <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Background Color</label>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map(color => (
                        <button
                            key={color}
                            onClick={() => setLogoState({...logoState, backgroundColor: color})}
                            className={`w-8 h-8 rounded-full border-4 transition-transform hover:scale-110 ${logoState.backgroundColor === color ? 'border-gray-800 scale-110' : 'border-white shadow-sm'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {/* Icon Picker */}
            <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Logo Icon</label>
                <div className="grid grid-cols-4 gap-2 bg-white p-2 rounded-xl border border-gray-200 h-48 overflow-y-auto custom-scrollbar">
                    {ICONS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setLogoState({...logoState, icon: item.id as any})}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all
                                ${logoState.icon === item.id 
                                    ? 'bg-blue-50 border-kid-accent text-kid-accent shadow-sm' 
                                    : 'bg-white border-transparent hover:bg-gray-50 text-gray-500'}
                            `}
                        >
                            <item.icon size={24} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Icon Color Picker */}
            <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Icon Color</label>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map(color => (
                        <button
                            key={color}
                            onClick={() => setLogoState({...logoState, iconColor: color})}
                            className={`w-8 h-8 rounded-full border-4 transition-transform hover:scale-110 ${logoState.iconColor === color ? 'border-gray-800 scale-110' : 'border-white shadow-sm'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            <button 
                onClick={handleSave}
                disabled={saved}
                className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 btn-juicy transition-all mt-4
                    ${saved ? 'bg-green-500 text-white' : 'bg-kid-primary text-yellow-900 shadow-[0_4px_0_0_rgba(202,138,4,1)] hover:bg-yellow-400'}
                `}
            >
                {saved ? 'Saved!' : <><Save size={20} /> Save Brand Logo</>}
            </button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-8 relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="relative text-center">
              <div 
                className={`w-64 h-64 flex items-center justify-center shadow-2xl mb-8 mx-auto transition-all duration-300 border-4 border-white
                    ${logoState.shape === 'circle' ? 'rounded-full' : logoState.shape === 'rounded' ? 'rounded-3xl' : 'rounded-none'}
                `}
                style={{ backgroundColor: logoState.backgroundColor }}
              >
                  <SelectedIcon size={120} color={logoState.iconColor} strokeWidth={2.5} className="drop-shadow-md" />
              </div>

              <h1 className="text-5xl font-black text-gray-800 tracking-tight drop-shadow-sm">{logoState.companyName}</h1>
              <p className="text-gray-500 font-bold mt-3 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <span className="w-8 h-[2px] bg-gray-300"></span> Est. 2024 <span className="w-8 h-[2px] bg-gray-300"></span>
              </p>
          </div>
      </div>
    </div>
  );
};

export default BrandBuilder;
