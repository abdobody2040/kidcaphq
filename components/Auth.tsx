
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { UserRole } from '../types';
import { ShieldCheck, GraduationCap, Database, ArrowLeft, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthProps {
    onBack?: () => void;
    initialMode?: 'LOGIN' | 'REGISTER';
}

const Auth: React.FC<AuthProps> = ({ onBack, initialMode = 'LOGIN' }) => {
  const { loginWithCredentials, registerUser } = useAppStore();
  const { t } = useTranslation();
  
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [step, setStep] = useState<number>(1); // Step 1: Role (Register only), Step 2: Form
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.KID);
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const success = loginWithCredentials(username, password);
      if (!success) {
          setError(t('auth.error_auth'));
      }
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if (!username || !password || !name) {
          setError(t('auth.error_fields'));
          return;
      }
      
      const validationError = registerUser(name, username, password, selectedRole);
      if (validationError) {
          setError(validationError);
      }
  };

  const handleRoleSelect = (role: UserRole) => {
      setSelectedRole(role);
      setStep(2);
      setError('');
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex items-center justify-center p-4 relative transition-colors">
      {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-8 left-8 text-gray-500 dark:text-gray-400 font-bold hover:text-green-600 dark:hover:text-green-400 flex items-center gap-2"
          >
              <ArrowLeft size={20} /> {t('common.back')}
          </button>
      )}

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border dark:border-gray-700">
        <h1 className="text-4xl font-black text-kid-secondary mb-2">{t('auth.title')}</h1>
        
        {/* Toggle Mode */}
        <div className="flex justify-center gap-6 mb-8 mt-4 text-sm font-bold border-b border-gray-100 dark:border-gray-700 pb-4">
            <button 
                onClick={() => { setMode('LOGIN'); setStep(1); setError(''); }}
                className={`pb-2 border-b-2 transition-colors ${mode === 'LOGIN' ? 'text-kid-secondary border-kid-secondary' : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
                {t('auth.login')}
            </button>
            <button 
                onClick={() => { setMode('REGISTER'); setStep(1); setError(''); }}
                className={`pb-2 border-b-2 transition-colors ${mode === 'REGISTER' ? 'text-kid-secondary border-kid-secondary' : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
                {t('auth.create_account')}
            </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-left rtl:text-right">
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.username')}</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(''); }}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                        placeholder={t('auth.enter_username')}
                    />
                </div>
                <div className="text-left rtl:text-right">
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.password')}</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                        placeholder={t('auth.enter_password')}
                    />
                </div>
                
                {error && <div className="text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded-lg">{error}</div>}

                <button 
                    type="submit"
                    className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-lg hover:bg-yellow-400 transition-colors mt-4"
                >
                    {t('auth.submit_login')}
                </button>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-4" dir="ltr">
                    {t('auth.demo_hint')}
                </div>
            </form>
        )}

        {/* REGISTER FLOW */}
        {mode === 'REGISTER' && step === 1 && (
            <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">{t('auth.role_prompt')}</p>
                <button 
                    onClick={() => handleRoleSelect(UserRole.KID)}
                    className="w-full p-6 rounded-2xl border-4 border-gray-100 dark:border-gray-700 hover:border-kid-primary dark:hover:border-kid-primary hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all group flex items-center gap-4 text-left rtl:text-right"
                >
                    <div className="w-16 h-16 bg-kid-primary rounded-full flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                    🧒
                    </div>
                    <div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white">{t('auth.role_kid')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">{t('auth.role_kid_desc')}</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleRoleSelect(UserRole.PARENT)}
                    className="w-full p-6 rounded-2xl border-4 border-gray-100 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group flex items-center gap-4 text-left rtl:text-right"
                >
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <ShieldCheck size={32} />
                    </div>
                    <div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white">{t('auth.role_parent')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">{t('auth.role_parent_desc')}</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleRoleSelect(UserRole.TEACHER)}
                    className="w-full p-6 rounded-2xl border-4 border-gray-100 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group flex items-center gap-4 text-left rtl:text-right"
                >
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 text-purple-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <GraduationCap size={32} />
                    </div>
                    <div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white">{t('auth.role_teacher')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">{t('auth.role_teacher_desc')}</p>
                    </div>
                </button>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button 
                        onClick={() => handleRoleSelect(UserRole.ADMIN)}
                        className="text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center gap-1 mx-auto"
                    >
                        <Database size={12} /> Admin
                    </button>
                </div>
            </div>
        )}

        {mode === 'REGISTER' && step === 2 && (
             <form onSubmit={handleRegister} className="space-y-4 text-left rtl:text-right">
                <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-2 rtl:rotate-180"
                >
                    &larr; {t('auth.back_roles')}
                </button>
                
                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-4 text-center">
                    {t('auth.create_account')}
                </h3>

                <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.full_name')}</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(''); }}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                        placeholder={t('auth.your_name')}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.username')}</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(''); }}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                        placeholder={t('auth.enter_username')}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.password')}</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                        placeholder={t('auth.enter_password')}
                    />
                </div>

                {error && <div className="text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded-lg text-center">{error}</div>}

                <button 
                    type="submit"
                    className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-lg hover:bg-yellow-400 transition-colors mt-6"
                >
                    {t('auth.submit_register')}
                </button>
             </form>
        )}

      </div>
    </div>
  );
};

export default Auth;
