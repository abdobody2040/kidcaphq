
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, School } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface JoinClassModalProps {
  onClose: () => void;
}

const JoinClassModal: React.FC<JoinClassModalProps> = ({ onClose }) => {
  const { joinClass } = useAppStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = joinClass(code.toUpperCase());
    if (result) {
        setSuccess(true);
        setTimeout(onClose, 2000);
    } else {
        setError(true);
        setTimeout(() => setError(false), 2000); // Shake effect timeout ideally
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[180] flex items-center justify-center p-4">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative overflow-hidden shadow-2xl"
        >
             <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rtl:right-auto rtl:left-4">
                <X size={24} />
             </button>

             {success ? (
                 <div className="text-center py-8">
                     <div className="text-6xl mb-4">🎉</div>
                     <h3 className="text-2xl font-black text-kid-secondary mb-2">{t('join.success_title')}</h3>
                     <p className="text-gray-500 font-bold">{t('join.success_desc')}</p>
                 </div>
             ) : (
                 <form onSubmit={handleSubmit} className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <School size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-800 mb-2">{t('join.title')}</h3>
                    <p className="text-gray-500 font-medium mb-6">{t('join.desc')}</p>

                    <input 
                        type="text" 
                        maxLength={6}
                        placeholder={t('join.placeholder')}
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className={`w-full text-center text-3xl font-black tracking-widest p-4 rounded-xl border-4 outline-none transition-colors mb-6 uppercase placeholder-gray-300
                            ${error ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-100 bg-gray-50 focus:border-blue-400 text-gray-800'}
                        `}
                    />

                    <button 
                        type="submit"
                        className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-lg hover:bg-yellow-400 transition-colors"
                    >
                        {t('join.submit')}
                    </button>
                    {error && <p className="text-red-500 font-bold mt-4 text-sm">{t('join.error')}</p>}
                 </form>
             )}
        </motion.div>
    </div>
  );
};

export default JoinClassModal;
