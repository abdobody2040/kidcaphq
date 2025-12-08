
import React from 'react';
import { useAppStore } from '../store';
import { UserRole } from '../types';
import { User, ShieldCheck, GraduationCap, Database, ArrowLeft } from 'lucide-react';

interface AuthProps {
    onBack?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBack }) => {
  const { login } = useAppStore();

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
        <p className="text-gray-500 font-bold mb-8">Choose your profile to start</p>

        <div className="space-y-4">
          <button 
            onClick={() => login(UserRole.KID)}
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
            onClick={() => login(UserRole.PARENT)}
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
            onClick={() => login(UserRole.TEACHER)}
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
                onClick={() => login(UserRole.ADMIN)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto"
              >
                  <Database size={12} /> Admin Login
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
