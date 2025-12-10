
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { UserRole } from '../types';
import { ShieldCheck, GraduationCap, Database, ArrowLeft, User as UserIcon } from 'lucide-react';

interface AuthProps {
    onBack?: () => void;
    initialMode?: 'LOGIN' | 'REGISTER';
}

const Auth: React.FC<AuthProps> = ({ onBack, initialMode = 'LOGIN' }) => {
  const { loginWithCredentials, registerUser } = useAppStore();
  
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
          setError('Invalid username or password (try leo/123, mom/123)');
      }
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if (!username || !password || !name) {
          setError('All fields are required');
          return;
      }
      registerUser(name, username, password, selectedRole);
  };

  const handleRoleSelect = (role: UserRole) => {
      setSelectedRole(role);
      setStep(2);
      setError('');
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 relative">
      {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-8 left-8 text-gray-500 font-bold hover:text-green-600 flex items-center gap-2"
          >
              <ArrowLeft size={20} /> Back to Home
          </button>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <h1 className="text-4xl font-black text-kid-secondary mb-2">KidCap HQ</h1>
        
        {/* Toggle Mode */}
        <div className="flex justify-center gap-6 mb-8 mt-4 text-sm font-bold border-b border-gray-100 pb-4">
            <button 
                onClick={() => { setMode('LOGIN'); setStep(1); setError(''); }}
                className={`pb-2 border-b-2 transition-colors ${mode === 'LOGIN' ? 'text-kid-secondary border-kid-secondary' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
                Log In
            </button>
            <button 
                onClick={() => { setMode('REGISTER'); setStep(1); setError(''); }}
                className={`pb-2 border-b-2 transition-colors ${mode === 'REGISTER' ? 'text-kid-secondary border-kid-secondary' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
                Create Account
            </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-left">
                    <label className="block text-sm font-bold text-gray-500 mb-1">Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none"
                        placeholder="Enter username"
                    />
                </div>
                <div className="text-left">
                    <label className="block text-sm font-bold text-gray-500 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none"
                        placeholder="Enter password"
                    />
                </div>
                
                {error && <div className="text-red-500 font-bold text-sm bg-red-50 p-2 rounded-lg">{error}</div>}

                <button 
                    type="submit"
                    className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-lg hover:bg-yellow-400 transition-colors mt-4"
                >
                    Log In
                </button>
                <div className="text-xs text-gray-400 mt-4">
                    Demo Accounts: leo/123, mom/123, teacher/123
                </div>
            </form>
        )}

        {/* REGISTER FLOW */}
        {mode === 'REGISTER' && step === 1 && (
            <div className="space-y-4">
                <p className="text-gray-500 font-bold mb-6">Who is using this account?</p>
                <button 
                    onClick={() => handleRoleSelect(UserRole.KID)}
                    className="w-full p-6 rounded-2xl border-4 border-gray-100 hover:border-kid-primary hover:bg-yellow-50 transition-all group flex items-center gap-4 text-left"
                >
                    <div className="w-16 h-16 bg-kid-primary rounded-full flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                    🧒
                    </div>
                    <div>
                    <h3 className="text-xl font-black text-gray-800">I'm a Kid</h3>
                    <p className="text-gray-500 font-semibold text-sm">Ready to build a business!</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleRoleSelect(UserRole.PARENT)}
                    className="w-full p-6 rounded-2xl border-4 border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all group flex items-center gap-4 text-left"
                >
                    <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <ShieldCheck size={32} />
                    </div>
                    <div>
                    <h3 className="text-xl font-black text-gray-800">I'm a Parent</h3>
                    <p className="text-gray-500 font-semibold text-sm">View progress & settings</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleRoleSelect(UserRole.TEACHER)}
                    className="w-full p-6 rounded-2xl border-4 border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all group flex items-center gap-4 text-left"
                >
                    <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <GraduationCap size={32} />
                    </div>
                    <div>
                    <h3 className="text-xl font-black text-gray-800">I'm a Teacher</h3>
                    <p className="text-gray-500 font-semibold text-sm">Manage classroom & students</p>
                    </div>
                </button>

                <div className="pt-4 border-t border-gray-100">
                    <button 
                        onClick={() => handleRoleSelect(UserRole.ADMIN)}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto"
                    >
                        <Database size={12} /> Admin Register
                    </button>
                </div>
            </div>
        )}

        {mode === 'REGISTER' && step === 2 && (
             <form onSubmit={handleRegister} className="space-y-4 text-left">
                <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-sm font-bold text-gray-400 hover:text-gray-600 mb-2"
                >
                    &larr; Back to Roles
                </button>
                
                <h3 className="text-xl font-black text-gray-800 mb-4 text-center">
                    New {selectedRole === UserRole.KID ? 'Kid' : selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()} Account
                </h3>

                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none"
                        placeholder="Your Name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Choose Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none"
                        placeholder="Username"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Choose Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none"
                        placeholder="Password"
                    />
                </div>

                {error && <div className="text-red-500 font-bold text-sm bg-red-50 p-2 rounded-lg text-center">{error}</div>}

                <button 
                    type="submit"
                    className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-lg hover:bg-yellow-400 transition-colors mt-6"
                >
                    Create Account
                </button>
             </form>
        )}

      </div>
    </div>
  );
};

export default Auth;
