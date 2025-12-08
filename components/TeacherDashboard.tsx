import React from 'react';
import { useAppStore } from '../store';
import { Users, Lock, Unlock, Copy, ExternalLink, Settings } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { classroom, toggleModuleLock } = useAppStore();

  if (!classroom) return <div className="p-8">Loading Classroom...</div>;

  // Mock Student Roster
  const students = [
      { id: 'kid_1', name: 'Leo', progress: 85, level: 2, status: 'Online' },
      { id: 'kid_2', name: 'Sarah', progress: 45, level: 1, status: 'Offline' },
      { id: 'kid_3', name: 'Mike', progress: 12, level: 1, status: 'Offline' },
  ];

  return (
    <div className="pb-20 space-y-8">
       {/* Header */}
       <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
           <div>
               <h2 className="text-3xl font-black text-gray-800">{classroom.name}</h2>
               <p className="text-gray-500 font-bold flex items-center gap-2 mt-1">
                  <Users size={18}/> {students.length} Students Active
               </p>
           </div>
           
           <div className="bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl flex items-center gap-4">
               <div>
                   <div className="text-xs font-bold text-blue-400 uppercase">Class Code</div>
                   <div className="text-3xl font-black text-blue-700 tracking-widest">{classroom.code}</div>
               </div>
               <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Copy Code">
                   <Copy size={20} />
               </button>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Student Roster */}
           <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <h3 className="font-bold text-xl text-gray-800">Student Roster</h3>
                   <button className="text-kid-accent font-bold text-sm hover:underline">Manage</button>
               </div>
               <div className="overflow-x-auto">
                   <table className="w-full">
                       <thead className="bg-gray-50 text-left text-gray-500 font-bold text-xs uppercase">
                           <tr>
                               <th className="p-4 pl-6">Name</th>
                               <th className="p-4">Level</th>
                               <th className="p-4">Progress</th>
                               <th className="p-4">Status</th>
                               <th className="p-4">Actions</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {students.map(s => (
                               <tr key={s.id} className="hover:bg-gray-50">
                                   <td className="p-4 pl-6 font-bold text-gray-700">{s.name}</td>
                                   <td className="p-4">
                                       <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">Lvl {s.level}</span>
                                   </td>
                                   <td className="p-4">
                                       <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                           <div className="h-full bg-kid-secondary" style={{ width: `${s.progress}%` }} />
                                       </div>
                                       <div className="text-xs text-gray-400 mt-1">{s.progress}%</div>
                                   </td>
                                   <td className="p-4">
                                       <span className={`inline-block w-2 h-2 rounded-full mr-2 ${s.status === 'Online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                       <span className="text-sm font-medium text-gray-600">{s.status}</span>
                                   </td>
                                   <td className="p-4">
                                       <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg">
                                           <Settings size={16} />
                                       </button>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>

           {/* Curriculum Controls */}
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit">
               <h3 className="font-bold text-xl text-gray-800 mb-4">Curriculum Controls</h3>
               <p className="text-gray-500 text-sm mb-6">Lock content to keep the class in sync.</p>

               <div className="space-y-4">
                   <ModuleControl 
                      title="Module 1: Money Basics" 
                      isLocked={classroom.lockedModules.includes('m1')} 
                      onToggle={() => toggleModuleLock('m1')}
                   />
                   <ModuleControl 
                      title="Module 2: Startup 101" 
                      isLocked={classroom.lockedModules.includes('m2')} 
                      onToggle={() => toggleModuleLock('m2')}
                   />
                   <ModuleControl 
                      title="Module 3: Marketing Magic" 
                      isLocked={classroom.lockedModules.includes('m3')} 
                      onToggle={() => toggleModuleLock('m3')}
                   />
                    <ModuleControl 
                      title="Game: Lemonade Stand" 
                      isLocked={classroom.lockedModules.includes('g_lemon')} 
                      onToggle={() => toggleModuleLock('g_lemon')}
                   />
               </div>
           </div>
       </div>
    </div>
  );
};

const ModuleControl = ({ title, isLocked, onToggle }: { title: string, isLocked: boolean, onToggle: () => void }) => (
    <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-colors ${isLocked ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
        <span className={`font-bold ${isLocked ? 'text-red-700' : 'text-gray-700'}`}>{title}</span>
        <button 
           onClick={onToggle}
           className={`p-2 rounded-lg transition-colors ${isLocked ? 'bg-red-200 text-red-700 hover:bg-red-300' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
        </button>
    </div>
);

export default TeacherDashboard;