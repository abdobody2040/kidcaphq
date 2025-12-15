
import React, { useState, useMemo } from 'react';
import { BookOpen, Gamepad2, GraduationCap, ImageOff } from 'lucide-react';

interface SmartImageProps {
  src?: string;
  alt: string;
  type: 'book' | 'lesson' | 'game' | 'avatar' | 'hero' | 'feature';
  className?: string;
}

const GRADIENTS = [
  'bg-gradient-to-br from-red-500 to-orange-500',
  'bg-gradient-to-br from-amber-500 to-yellow-500',
  'bg-gradient-to-br from-lime-500 to-green-500',
  'bg-gradient-to-br from-emerald-500 to-teal-500',
  'bg-gradient-to-br from-cyan-500 to-blue-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500',
  'bg-gradient-to-br from-fuchsia-500 to-pink-500',
  'bg-gradient-to-br from-rose-500 to-red-500',
  'bg-gradient-to-br from-slate-600 to-slate-800'
];

const SmartImage: React.FC<SmartImageProps> = ({ src, alt, type, className = '' }) => {
  const [error, setError] = useState(false);

  // Deterministic gradient based on title string
  const gradientClass = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < alt.length; i++) {
      hash = alt.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % GRADIENTS.length;
    return GRADIENTS[index];
  }, [alt]);

  const getIcon = () => {
    switch (type) {
      case 'book': return <BookOpen className="text-white/50 mb-2" size={32} />;
      case 'game': return <Gamepad2 className="text-white/50 mb-2" size={32} />;
      case 'lesson': return <GraduationCap className="text-white/50 mb-2" size={32} />;
      default: return <ImageOff className="text-white/50 mb-2" size={24} />;
    }
  };

  if (error || !src) {
    return (
      <div className={`${className} ${gradientClass} flex flex-col items-center justify-center p-4 text-center overflow-hidden`}>
        {getIcon()}
        <span className="text-white font-black text-xs uppercase tracking-wider drop-shadow-md line-clamp-3">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default SmartImage;
