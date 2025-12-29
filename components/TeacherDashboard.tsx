
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { UserRole, Assignment, StudentGroup, Rubric, User, Submission, RubricCriteria } from '../types';
import { COURSE_MAP } from '../data/curriculum';
import { 
  Users, Lock, Unlock, Copy, Settings, Plus, Trash2, Edit, 
  BookOpen, FileText, ClipboardList, CheckSquare, Save, X, MoreVertical,
  Calendar, Check, UserPlus, GraduationCap, ChevronRight, MessageSquare, Link as LinkIcon,
  PlusCircle, ArrowLeft, LayoutTemplate
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TeacherDashboard: React.FC = () => {
  const { 
    classroom, users, lessons, toggleModuleLock, 
    updateUser, deleteUser,
    assignments, addAssignment, deleteAssignment,
    studentGroups, addStudentGroup, deleteStudentGroup, updateStudentGroup,
    rubrics, addRubric, deleteRubric, updateRubric, submissions, updateSubmission, addSubmission
  } = useAppStore();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ASSIGNMENTS' | 'GROUPS' | 'RUBRICS' | 'GRADING'>('OVERVIEW');
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  
  // Feature State: Assignments
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignLessonId, setNewAssignLessonId] = useState(''); 
  const [newAssignRubricId, setNewAssignRubricId] = useState<string>(''); 
  
  // NEW FIELDS
  const [newAssignDesc, setNewAssignDesc] = useState('');
  const [newAssignDueDate, setNewAssignDueDate] = useState('');
  const [newAssignPoints, setNewAssignPoints] = useState(100);
  const [newAssignResource, setNewAssignResource] = useState('');

  // New Assignment States (Phase 3)
  const [assignTarget, setAssignTarget] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  
  // Feature State: Grading
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  
  // Feature State: Groups
  const [newGroupName, setNewGroupName] = useState('');

  // Feature State: Rubrics
  const [editingRubric, setEditingRubric] = useState<Rubric | null>(null);

  // Calculate real student data
  const students = useMemo(() => {
      if (!classroom) return [];
      return users.filter(u => u.classId === classroom.id && u.role === UserRole.KID);
  }, [users, classroom]);

  // Aggregated Data for Widgets
  const dashboardStats = useMemo(() => {
      if (!classroom) return { actionItems: 0, atRisk: [], schedule: [] };

      // Action Items: Pending Submissions
      const pendingCount = submissions.filter(s => 
          assignments.some(a => a.id === s.assignmentId && a.classId === classroom.id) && 
          s.status === 'PENDING'
      ).length;

      // At-Risk: Students with low completion or low generic score (Simulated)
      const atRiskStudents = students.map(s => {
          const completed = s.completedLessonIds.length;
          // Simulated average grade logic (since we don't have full grade history yet)
          const avgGrade = Math.min(100, Math.max(40, 100 - (10 - completed) * 5)); 
          return { ...s, avgGrade };
      }).filter(s => s.avgGrade < 70).slice(0, 5);

      // Upcoming Schedule: Assignments created recently or scheduled for future
      const upcoming = assignments
          .filter(a => a.classId === classroom.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

      return {
          actionItems: pendingCount,
          atRisk: atRiskStudents,
          schedule: upcoming
      };
  }, [classroom, submissions, assignments, students]);

  if (!classroom) return <div className="p-8">Loading Classroom...</div>;

  const getStudentProgress = (student: User) => {
      const progressRaw = (student.completedLessonIds.length / (lessons.length || 1)) * 100;
      return Math.round(progressRaw);
  };

  const handleCopyCode = () => {
      navigator.clipboard.writeText(classroom.code);
      alert("Class code copied to clipboard!");
  };

  const handleEditStudentSave = () => {
      if (!editingStudent) return;
      updateUser(editingStudent.id, editingStudent);
      setEditingStudent(null);
  };

  const handleRemoveStudent = (id: string) => {
      if (window.confirm("Are you sure you want to remove this student from the class?")) {
          const s = students.find(u => u.id === id);
          if (s) {
              updateUser(id, { ...s, classId: undefined });
          }
          setEditingStudent(null);
      }
  };

  const toggleAssignee = (studentId: string) => {
      if (selectedAssignees.includes(studentId)) {
          setSelectedAssignees(selectedAssignees.filter(id => id !== studentId));
      } else {
          setSelectedAssignees([...selectedAssignees, studentId]);
      }
  };

  const handleCreateAssignment = () => {
      if (!newAssignTitle || !newAssignLessonId || !newAssignDueDate) {
          alert("Please provide a title, lesson, and due date.");
          return;
      }
      
      const newAssign: Assignment = {
          id: `assign_${Date.now()}`,
          classId: classroom.id,
          lessonId: newAssignLessonId,
          title: newAssignTitle,
          description: newAssignDesc,
          dueDate: new Date(newAssignDueDate).toISOString(),
          maxPoints: newAssignPoints, 
          resourceUrl: newAssignResource || undefined,
          rubricId: newAssignRubricId || undefined,
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
          // Phase 3: Differentiated Assignment Logic
          specificStudentIds: assignTarget === 'SPECIFIC' ? selectedAssignees : undefined
      };
      
      addAssignment(newAssign);
      
      // Reset Form
      setNewAssignTitle('');
      setNewAssignDesc('');
      setNewAssignDueDate('');
      setNewAssignPoints(100);
      setNewAssignResource('');
      setNewAssignLessonId('');
      setNewAssignRubricId('');
      setAssignTarget('ALL');
      setSelectedAssignees([]);
      setShowAssignModal(false);
  };

  const handleCreateGroup = () => {
      if (!newGroupName) return;
      const newGroup: StudentGroup = {
          id: `grp_${Date.now()}`,
          classId: classroom.id,
          name: newGroupName,
          studentIds: [],
          color: '#dbeafe'
      };
      addStudentGroup(newGroup);
      setNewGroupName('');
  };

  const toggleStudentInGroup = (groupId: string, studentId: string) => {
      const group = studentGroups.find(g => g.id === groupId);
      if (!group) return;
      
      const isMember = group.studentIds.includes(studentId);
      const newIds = isMember 
          ? group.studentIds.filter(id => id !== studentId)
          : [...group.studentIds, studentId];
      
      updateStudentGroup(groupId, { studentIds: newIds });
  };

  // Demo helper to populate grading view
  const handleSimulateSubmission = () => {
      const assignment = assignments.find(a => a.classId === classroom?.id);
      const student = students[0];
      
      if (assignment && student) {
          addSubmission({
              id: `sub_demo_${Date.now()}`,
              assignmentId: assignment.id,
              studentId: student.id,
              submittedAt: new Date().toISOString(),
              status: 'PENDING',
              content: 'I traded my apple for a cookie!'
          });
      } else {
          alert("Please create an assignment and ensure you have students first.");
      }
  };

  const handleSaveGrade = (grade: number, feedback: string, rubricScores?: Record<string, number>) => {
      if (!gradingSubmissionId) return;
      updateSubmission(gradingSubmissionId, {
          status: 'GRADED',
          grade,
          feedback,
          rubricScores
      });
      setGradingSubmissionId(null);
  };

  // --- RUBRIC HANDLERS ---
  const handleCreateRubric = () => {
      const newRubric: Rubric = {
          id: `rub_${Date.now()}`,
          teacherId: classroom.teacherId,
          title: 'Untitled Rubric',
          criteria: [
              { id: `crit_${Date.now()}_1`, title: 'Criteria 1', description: 'Description...', maxScore: 10 }
          ]
      };
      addRubric(newRubric);
      setEditingRubric(newRubric);
  };

  const handleCloneRubric = (rubric: Rubric) => {
      const cloned: Rubric = {
          ...rubric,
          id: `rub_${Date.now()}`,
          title: `${rubric.title} (Copy)`,
          criteria: rubric.criteria.map(c => ({...c, id: `crit_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}))
      };
      addRubric(cloned);
  };

  const handleSaveRubric = (updatedRubric: Rubric) => {
      updateRubric(updatedRubric.id, updatedRubric);
      setEditingRubric(null);
  };

  // Resolve focused grading object
  const gradingSubmission = submissions.find(s => s.id === gradingSubmissionId);
  const gradingAssignment = gradingSubmission ? assignments.find(a => a.id === gradingSubmission.assignmentId) : null;
  const gradingStudent = gradingSubmission ? students.find(s => s.id === gradingSubmission.studentId) : null;
  const gradingRubric = gradingAssignment?.rubricId ? rubrics.find(r => r.id === gradingAssignment.rubricId) : undefined;

  return (
    <div className="pb-20 space-y-8">
       {/* Header */}
       <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
           <div>
               <h2 className="text-3xl font-black text-gray-800">{classroom.name}</h2>
               <div className="flex gap-4 mt-2 overflow-x-auto no-scrollbar">
                   <button onClick={() => setActiveTab('OVERVIEW')} className={`font-bold pb-1 border-b-4 transition-colors whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'text-kid-accent border-kid-accent' : 'text-gray-400 border-transparent'}`}>{t('teacher.tabs.overview')}</button>
                   <button onClick={() => setActiveTab('ASSIGNMENTS')} className={`font-bold pb-1 border-b-4 transition-colors whitespace-nowrap ${activeTab === 'ASSIGNMENTS' ? 'text-kid-accent border-kid-accent' : 'text-gray-400 border-transparent'}`}>{t('teacher.tabs.assignments')}</button>
                   <button onClick={() => setActiveTab('GRADING')} className={`font-bold pb-1 border-b-4 transition-colors whitespace-nowrap ${activeTab === 'GRADING' ? 'text-kid-accent border-kid-accent' : 'text-gray-400 border-transparent'}`}>{t('teacher.tabs.grading')} {dashboardStats.actionItems > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full align-top">{dashboardStats.actionItems}</span>}</button>
                   <button onClick={() => setActiveTab('GROUPS')} className={`font-bold pb-1 border-b-4 transition-colors whitespace-nowrap ${activeTab === 'GROUPS' ? 'text-kid-accent border-kid-accent' : 'text-gray-400 border-transparent'}`}>{t('teacher.tabs.groups')}</button>
                   <button onClick={() => setActiveTab('RUBRICS')} className={`font-bold pb-1 border-b-4 transition-colors whitespace-nowrap ${activeTab === 'RUBRICS' ? 'text-kid-accent border-kid-accent' : 'text-gray-400 border-transparent'}`}>{t('teacher.tabs.rubrics')}</button>
               </div>
           </div>
           
           <div className="bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl flex items-center gap-4 shrink-0">
               <div>
                   <div className="text-xs font-bold text-blue-400 uppercase">{t('teacher.code')}</div>
                   <div className="text-3xl font-black text-blue-700 tracking-widest">{classroom.code}</div>
               </div>
               <button 
                 onClick={handleCopyCode}
                 className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" 
                 title="Copy Code"
               >
                   <Copy size={20} />
               </button>
           </div>
       </div>

       {/* --- TAB: OVERVIEW --- */}
       {activeTab === 'OVERVIEW' && (
           <div className="space-y-8">
               
               {/* Phase 2: Power Widgets */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Widget 1: Action Items */}
                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                       <div className="flex items-center gap-3 mb-4">
                           <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><ClipboardList size={24}/></div>
                           <h3 className="font-bold text-gray-700">{t('teacher.widget_action.title')}</h3>
                       </div>
                       <div className="flex-1 flex flex-col justify-center items-center text-center">
                           <div className="text-5xl font-black text-gray-800 mb-2">{dashboardStats.actionItems}</div>
                           <p className="text-gray-500 font-medium text-sm">{t('teacher.widget_action.desc')}</p>
                           {dashboardStats.actionItems > 0 && (
                               <button 
                                  onClick={() => setActiveTab('GRADING')}
                                  className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                               >
                                   {t('teacher.widget_action.btn')}
                               </button>
                           )}
                       </div>
                   </div>

                   {/* Widget 2: At-Risk Radar */}
                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                       <div className="flex items-center gap-3 mb-4">
                           <div className="bg-red-100 p-2 rounded-xl text-red-600"><Users size={24}/></div>
                           <h3 className="font-bold text-gray-700">{t('teacher.widget_risk.title')}</h3>
                       </div>
                       <div className="flex-1">
                           {dashboardStats.atRisk.length === 0 ? (
                               <div className="h-full flex items-center justify-center text-center text-green-600 font-bold">
                                   <div>
                                       <Check size={32} className="mx-auto mb-2"/>
                                       {t('teacher.widget_risk.safe')}
                                   </div>
                               </div>
                           ) : (
                               <div className="space-y-3">
                                   {dashboardStats.atRisk.map(s => (
                                       <div key={s.id} className="flex justify-between items-center bg-red-50 p-2 rounded-lg">
                                           <span className="font-bold text-gray-700 text-sm">{s.name}</span>
                                           <span className="text-xs font-black text-red-500 bg-white px-2 py-1 rounded border border-red-100">{Math.round(s.avgGrade)}% Avg</span>
                                       </div>
                                   ))}
                               </div>
                           )}
                       </div>
                   </div>

                   {/* Widget 3: Upcoming Schedule */}
                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                       <div className="flex items-center gap-3 mb-4">
                           <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600"><Calendar size={24}/></div>
                           <h3 className="font-bold text-gray-700">{t('teacher.widget_schedule.title')}</h3>
                       </div>
                       <div className="flex-1 space-y-3">
                           {dashboardStats.schedule.length === 0 ? (
                               <div className="text-gray-400 text-sm font-bold text-center mt-8">{t('teacher.widget_schedule.empty')}</div>
                           ) : (
                               dashboardStats.schedule.map(a => (
                                   <div key={a.id} className="border-l-4 border-yellow-400 pl-3 py-1">
                                       <div className="font-bold text-gray-800 text-sm truncate">{a.title}</div>
                                       <div className="text-xs text-gray-400 font-medium">
                                           {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No Due Date'}
                                       </div>
                                   </div>
                               ))
                           )}
                       </div>
                   </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* Student Roster */}
                   <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                       <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                           <h3 className="font-bold text-xl text-gray-800">{t('teacher.roster_title')}</h3>
                           <button onClick={() => setActiveTab('GROUPS')} className="text-kid-accent font-bold text-sm hover:underline">{t('teacher.manage_groups')}</button>
                       </div>
                       <div className="overflow-x-auto">
                           <table className="w-full">
                               <thead className="bg-gray-50 text-left text-gray-500 font-bold text-xs uppercase">
                                   <tr>
                                       <th className="p-4 pl-6">Name</th>
                                       <th className="p-4">Level</th>
                                       <th className="p-4">Progress</th>
                                       <th className="p-4">Action</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-100">
                                   {students.length === 0 ? (
                                       <tr>
                                           <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                                               No students have joined yet. Share code: {classroom.code}
                                           </td>
                                       </tr>
                                   ) : (
                                       students.map(s => (
                                           <tr key={s.id} className="hover:bg-gray-50">
                                               <td className="p-4 pl-6 font-bold text-gray-700">{s.name}</td>
                                               <td className="p-4">
                                                   <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">Lvl {s.level}</span>
                                               </td>
                                               <td className="p-4">
                                                   <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden" dir="ltr">
                                                       <div className="h-full bg-kid-secondary" style={{ width: `${getStudentProgress(s)}%` }} />
                                                   </div>
                                               </td>
                                               <td className="p-4">
                                                   <button 
                                                      onClick={() => setEditingStudent(s)}
                                                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                   >
                                                       <Settings size={16} />
                                                   </button>
                                               </td>
                                           </tr>
                                       ))
                                   )}
                               </tbody>
                           </table>
                       </div>
                   </div>

                   {/* Curriculum Controls (Dynamic) */}
                   <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit max-h-[600px] overflow-y-auto">
                       <h3 className="font-bold text-xl text-gray-800 mb-4">{t('teacher.controls_title')}</h3>
                       <p className="text-gray-500 text-sm mb-6">{t('teacher.controls_desc')}</p>

                       <div className="space-y-4">
                           {COURSE_MAP.map((module) => (
                               <ModuleControl 
                                  key={module.id}
                                  title={module.title} 
                                  icon={module.icon}
                                  isLocked={classroom.lockedModules.includes(module.id)} 
                                  onToggle={() => toggleModuleLock(module.id)}
                               />
                           ))}
                           <ModuleControl 
                              title="Arcade: Lemonade Stand" 
                              icon="🍋"
                              isLocked={classroom.lockedModules.includes('g_lemon')} 
                              onToggle={() => toggleModuleLock('g_lemon')}
                           />
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* --- TAB: ASSIGNMENTS --- */}
       {activeTab === 'ASSIGNMENTS' && (
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
               <div className="flex justify-between items-center mb-8">
                   <h3 className="font-bold text-xl text-gray-800">{t('teacher.assign_title')}</h3>
                   <button 
                      onClick={() => setShowAssignModal(true)}
                      className="bg-kid-accent text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600"
                   >
                       <Plus size={18} /> {t('teacher.new_assign')}
                   </button>
               </div>

               {showAssignModal && (
                   <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                       <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
                           <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                               <h4 className="font-black text-gray-800 text-lg">{t('teacher.new_assign')}</h4>
                               <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
                           </div>
                           
                           <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                               {/* Title Input */}
                               <div>
                                   <label className="block text-sm font-bold text-gray-500 mb-2">Assignment Title</label>
                                   <input 
                                      type="text" 
                                      placeholder="e.g. Barter System Challenge"
                                      value={newAssignTitle}
                                      onChange={(e) => setNewAssignTitle(e.target.value)}
                                      className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none"
                                   />
                               </div>

                               {/* Description */}
                               <div>
                                   <label className="block text-sm font-bold text-gray-500 mb-2">Instructions / Description</label>
                                   <textarea 
                                      placeholder="Provide detailed instructions for the students..."
                                      value={newAssignDesc}
                                      onChange={(e) => setNewAssignDesc(e.target.value)}
                                      className="w-full p-3 rounded-xl border-2 border-gray-200 font-medium h-32 focus:border-kid-accent outline-none resize-none"
                                   />
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   {/* Linked Lesson */}
                                   <div>
                                       <label className="block text-sm font-bold text-gray-500 mb-2">Linked Lesson</label>
                                       <select
                                          value={newAssignLessonId}
                                          onChange={(e) => setNewAssignLessonId(e.target.value)}
                                          className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none bg-white"
                                       >
                                           <option value="">Select a Lesson...</option>
                                           {lessons.map(lesson => (
                                               <option key={lesson.id} value={lesson.id}>
                                                   {lesson.topic_tag} - {lesson.lesson_payload.headline}
                                               </option>
                                           ))}
                                       </select>
                                   </div>

                                   {/* Due Date */}
                                   <div>
                                       <label className="block text-sm font-bold text-gray-500 mb-2">Due Date</label>
                                       <input 
                                          type="datetime-local" 
                                          value={newAssignDueDate}
                                          onChange={(e) => setNewAssignDueDate(e.target.value)}
                                          className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none"
                                       />
                                   </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   {/* Rubric Selector */}
                                   <div>
                                       <label className="block text-sm font-bold text-gray-500 mb-2">Grading Criteria</label>
                                       <select 
                                          value={newAssignRubricId}
                                          onChange={(e) => setNewAssignRubricId(e.target.value)}
                                          className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none bg-white"
                                       >
                                           <option value="">No Rubric (Points Only)</option>
                                           {rubrics.filter(r => r.teacherId === classroom.teacherId).map(r => (
                                               <option key={r.id} value={r.id}>{r.title}</option>
                                           ))}
                                       </select>
                                   </div>

                                   {/* Max Points */}
                                   <div>
                                       <label className="block text-sm font-bold text-gray-500 mb-2">Max Points</label>
                                       <input 
                                          type="number" 
                                          value={newAssignPoints}
                                          onChange={(e) => setNewAssignPoints(parseInt(e.target.value))}
                                          disabled={!!newAssignRubricId}
                                          className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-kid-accent outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                       />
                                   </div>
                               </div>

                               {/* Resource Link */}
                               <div>
                                   <label className="block text-sm font-bold text-gray-500 mb-2">Resource Link (PDF, Video, Doc)</label>
                                   <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-3 focus-within:border-kid-accent">
                                       <LinkIcon className="text-gray-400" size={20} />
                                       <input 
                                          type="url" 
                                          placeholder="https://example.com/resource.pdf"
                                          value={newAssignResource}
                                          onChange={(e) => setNewAssignResource(e.target.value)}
                                          className="w-full p-3 font-bold outline-none bg-transparent"
                                       />
                                   </div>
                               </div>

                               {/* Assign To Logic (Phase 3) */}
                               <div>
                                   <label className="block text-sm font-bold text-gray-500 mb-2">Assign To</label>
                                   <div className="flex gap-4 mb-4">
                                       <button 
                                          onClick={() => setAssignTarget('ALL')}
                                          className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2
                                            ${assignTarget === 'ALL' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}
                                          `}
                                       >
                                           <Users size={18} /> Whole Class
                                       </button>
                                       <button 
                                          onClick={() => setAssignTarget('SPECIFIC')}
                                          className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2
                                            ${assignTarget === 'SPECIFIC' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}
                                          `}
                                       >
                                           <UserPlus size={18} /> Specific Students
                                       </button>
                                   </div>

                                   {/* Student Picker */}
                                   {assignTarget === 'SPECIFIC' && (
                                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
                                           <div className="space-y-2">
                                               {students.map(student => {
                                                   const isSelected = selectedAssignees.includes(student.id);
                                                   return (
                                                       <div 
                                                          key={student.id} 
                                                          onClick={() => toggleAssignee(student.id)}
                                                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2
                                                              ${isSelected ? 'bg-blue-100 border-blue-300' : 'bg-white border-transparent hover:border-gray-200'}
                                                          `}
                                                       >
                                                           <div className={`w-5 h-5 rounded border-2 flex items-center justify-center
                                                               ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 bg-white'}
                                                           `}>
                                                               {isSelected && <Check size={14} strokeWidth={4} />}
                                                           </div>
                                                           <span className={`font-bold ${isSelected ? 'text-blue-800' : 'text-gray-600'}`}>{student.name}</span>
                                                       </div>
                                                   );
                                               })}
                                           </div>
                                       </div>
                                   )}
                               </div>
                           </div>

                           {/* Actions */}
                           <div className="p-6 border-t border-gray-100 flex gap-4 bg-white">
                               <button 
                                  onClick={() => setShowAssignModal(false)} 
                                  className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                               >
                                   Cancel
                               </button>
                               <button 
                                  onClick={handleCreateAssignment} 
                                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md"
                               >
                                   Publish Assignment
                               </button>
                           </div>
                       </div>
                   </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {assignments.filter(a => a.classId === classroom.id).map(assign => (
                       <div key={assign.id} className="p-6 rounded-2xl border-2 border-gray-100 hover:border-kid-accent transition-all relative group bg-white">
                           <div className="flex justify-between items-start mb-4">
                               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                   <ClipboardList size={24} />
                               </div>
                               <button onClick={() => deleteAssignment(assign.id)} className="text-gray-300 hover:text-red-500">
                                   <Trash2 size={18} />
                               </button>
                           </div>
                           <h4 className="font-black text-lg text-gray-800 mb-1">{assign.title}</h4>
                           <p className="text-xs text-gray-400 font-bold mb-4 line-clamp-2">{assign.description || "No description provided."}</p>
                           
                           {/* Assignment Meta */}
                           <div className="space-y-2">
                               <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                   <Calendar size={14} /> Due: {assign.dueDate ? new Date(assign.dueDate).toLocaleDateString() : 'No Due Date'}
                               </div>
                               <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-400 uppercase">
                                   <span className="bg-gray-100 px-2 py-1 rounded">{assign.status}</span>
                                   {assign.rubricId && <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">Rubric</span>}
                                   {assign.specificStudentIds && assign.specificStudentIds.length > 0 && (
                                       <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded flex items-center gap-1">
                                           <UserPlus size={10} /> {assign.specificStudentIds.length} Students
                                       </span>
                                   )}
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       )}

       {/* --- TAB: GRADING (Phase 4) --- */}
       {activeTab === 'GRADING' && (
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
               {gradingSubmission && gradingAssignment && gradingStudent ? (
                   <GradingWorkspace 
                       submission={gradingSubmission}
                       assignment={gradingAssignment}
                       student={gradingStudent}
                       rubric={gradingRubric}
                       onSave={handleSaveGrade}
                       onCancel={() => setGradingSubmissionId(null)}
                   />
               ) : (
                   <div className="p-8">
                       <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-xl text-gray-800">{t('teacher.subs_title')}</h3>
                           <button onClick={handleSimulateSubmission} className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100">
                               {t('teacher.demo_sub')}
                           </button>
                       </div>
                       
                       {submissions.filter(s => {
                           const a = assignments.find(assign => assign.id === s.assignmentId);
                           return a && a.classId === classroom.id;
                       }).length === 0 ? (
                           <div className="text-center py-12 text-gray-400">
                               <div className="text-4xl mb-2">📭</div>
                               <p className="font-bold">No submissions yet.</p>
                           </div>
                       ) : (
                           <div className="space-y-4">
                               {submissions.filter(s => {
                                   const a = assignments.find(assign => assign.id === s.assignmentId);
                                   return a && a.classId === classroom.id;
                               }).map(sub => {
                                   const a = assignments.find(assign => assign.id === sub.assignmentId);
                                   const s = students.find(stud => stud.id === sub.studentId);
                                   return (
                                       <div 
                                          key={sub.id} 
                                          onClick={() => setGradingSubmissionId(sub.id)}
                                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-kid-accent hover:shadow-sm
                                              ${sub.status === 'GRADED' ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white border-blue-100'}
                                          `}
                                       >
                                           <div className="flex items-center gap-4">
                                               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                                                   ${sub.status === 'GRADED' ? 'bg-green-500' : 'bg-blue-500'}
                                               `}>
                                                   {s?.name[0] || '?'}
                                               </div>
                                               <div>
                                                   <div className="font-black text-gray-800">{s?.name}</div>
                                                   <div className="text-sm text-gray-500 font-medium">{a?.title}</div>
                                               </div>
                                           </div>
                                           
                                           <div className="text-right">
                                               <div className={`text-xs font-black uppercase px-2 py-1 rounded mb-1 inline-block
                                                   ${sub.status === 'GRADED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                               `}>
                                                   {sub.status}
                                               </div>
                                               {sub.status === 'GRADED' && (
                                                   <div className="font-black text-gray-800">{sub.grade} / {a?.maxPoints}</div>
                                               )}
                                           </div>
                                       </div>
                                   );
                               })}
                           </div>
                       )}
                   </div>
               )}
           </div>
       )}

       {/* --- TAB: GROUPS --- */}
       {activeTab === 'GROUPS' && (
           <div className="space-y-8">
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-xl text-gray-800">{t('teacher.groups_title')}</h3>
                       <div className="flex gap-2">
                           <input 
                              type="text" 
                              placeholder="New Group Name" 
                              value={newGroupName}
                              onChange={(e) => setNewGroupName(e.target.value)}
                              className="p-2 border border-gray-300 rounded-lg"
                           />
                           <button onClick={handleCreateGroup} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">{t('teacher.add_group')}</button>
                       </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {studentGroups.filter(g => g.classId === classroom.id).map(group => (
                           <div key={group.id} className="border-2 border-gray-200 rounded-2xl p-6">
                               <div className="flex justify-between items-center mb-4">
                                   <h4 className="font-black text-lg" style={{ color: group.color || '#333' }}>{group.name}</h4>
                                   <button onClick={() => deleteStudentGroup(group.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                               </div>
                               
                               <div className="space-y-2 max-h-60 overflow-y-auto">
                                   {students.map(student => {
                                       const isInGroup = group.studentIds.includes(student.id);
                                       return (
                                           <div 
                                              key={student.id} 
                                              onClick={() => toggleStudentInGroup(group.id, student.id)}
                                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isInGroup ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                                           >
                                               <div className={`w-5 h-5 rounded border flex items-center justify-center ${isInGroup ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
                                                   {isInGroup && <CheckSquare size={14} />}
                                               </div>
                                               <span className={`text-sm font-bold ${isInGroup ? 'text-blue-700' : 'text-gray-600'}`}>{student.name}</span>
                                           </div>
                                       );
                                   })}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           </div>
       )}

       {/* --- TAB: RUBRICS --- */}
       {activeTab === 'RUBRICS' && (
           editingRubric ? (
               <RubricEditor 
                   rubric={editingRubric} 
                   onSave={handleSaveRubric} 
                   onCancel={() => setEditingRubric(null)} 
               />
           ) : (
               <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                   <div className="flex justify-between items-center mb-8">
                       <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                           <LayoutTemplate size={24} /> {t('teacher.rubrics_title')}
                       </h3>
                       <button 
                          onClick={handleCreateRubric}
                          className="bg-kid-accent text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                       >
                           <PlusCircle size={20} /> {t('teacher.new_rubric')}
                       </button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {rubrics.filter(r => r.teacherId === classroom.teacherId).map(rubric => {
                           const totalPoints = rubric.criteria.reduce((sum, c) => sum + c.maxScore, 0);
                           return (
                               <div key={rubric.id} className="p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-200 transition-all group bg-white shadow-sm hover:shadow-md">
                                   <div className="flex justify-between items-start mb-4">
                                       <h4 className="font-black text-lg text-gray-800">{rubric.title}</h4>
                                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <button onClick={() => setEditingRubric(rubric)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                                           <button onClick={() => handleCloneRubric(rubric)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><Copy size={16}/></button>
                                           <button onClick={() => deleteRubric(rubric.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                                       </div>
                                   </div>
                                   
                                   <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                       <span className="flex items-center gap-1"><CheckSquare size={16} /> {rubric.criteria.length} Criteria</span>
                                       <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{totalPoints} Pts</span>
                                   </div>
                               </div>
                           );
                       })}
                       {rubrics.length === 0 && (
                           <div className="col-span-full text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
                               <p className="font-bold text-lg">{t('teacher.rubrics_empty')}</p>
                           </div>
                       )}
                   </div>
               </div>
           )
       )}

       {/* EDIT STUDENT MODAL */}
       {editingStudent && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                   <h3 className="font-black text-xl text-gray-800 mb-4">{t('teacher.edit_student')}</h3>
                   
                   <label className="block text-sm font-bold text-gray-500 mb-1">Student Name</label>
                   <input 
                      type="text" 
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold mb-6"
                   />

                   <div className="flex flex-col gap-3">
                       <button onClick={handleEditStudentSave} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Save Changes</button>
                       <button onClick={() => handleRemoveStudent(editingStudent.id)} className="w-full bg-red-100 text-red-600 py-3 rounded-xl font-bold">{t('teacher.remove_student')}</button>
                       <button onClick={() => setEditingStudent(null)} className="w-full text-gray-400 font-bold py-2">Cancel</button>
                   </div>
               </div>
           </div>
       )}

    </div>
  );
};

interface RubricEditorProps {
    rubric: Rubric;
    onSave: (rubric: Rubric) => void;
    onCancel: () => void;
}

const RubricEditor: React.FC<RubricEditorProps> = ({ rubric, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Rubric>(JSON.parse(JSON.stringify(rubric))); // Deep copy

    const handleAddCriteria = () => {
        setFormData(prev => ({
            ...prev,
            criteria: [
                ...prev.criteria,
                { 
                    id: `crit_${Date.now()}`, 
                    title: 'New Criterion', 
                    description: 'Description of what is expected...', 
                    maxScore: 10 
                }
            ]
        }));
    };

    const handleRemoveCriteria = (id: string) => {
        setFormData(prev => ({
            ...prev,
            criteria: prev.criteria.filter(c => c.id !== id)
        }));
    };

    const handleUpdateCriteria = (id: string, field: keyof RubricCriteria, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            criteria: prev.criteria.map(c => c.id === id ? { ...c, [field]: value } : c)
        }));
    };

    const totalPoints = formData.criteria.reduce((sum, c) => sum + (Number(c.maxScore) || 0), 0);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <input 
                            type="text" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="text-2xl font-black text-gray-800 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-400 placeholder-gray-400"
                            placeholder="Rubric Title"
                        />
                        <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                            {formData.criteria.length} Criteria • Total: {totalPoints} Pts
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200">Cancel</button>
                    <button 
                        onClick={() => onSave(formData)}
                        className="px-8 py-3 rounded-xl font-black bg-green-600 text-white shadow-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <Save size={18} /> Save Rubric
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                <div className="max-w-4xl mx-auto space-y-6">
                    {formData.criteria.map((crit, index) => (
                        <div key={crit.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-200 transition-colors group relative">
                            <div className="flex gap-4 items-start mb-4">
                                <div className="bg-blue-50 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Title</label>
                                            <input 
                                                type="text" 
                                                value={crit.title}
                                                onChange={(e) => handleUpdateCriteria(crit.id, 'title', e.target.value)}
                                                className="w-full font-bold text-gray-800 text-lg outline-none border-b border-gray-200 focus:border-blue-400 pb-1"
                                                placeholder="Criterion Title"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Points</label>
                                            <input 
                                                type="number" 
                                                value={crit.maxScore}
                                                onChange={(e) => handleUpdateCriteria(crit.id, 'maxScore', parseInt(e.target.value) || 0)}
                                                className="w-full font-black text-blue-600 text-lg outline-none border-b border-gray-200 focus:border-blue-400 pb-1 text-right"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Description</label>
                                        <textarea 
                                            value={crit.description}
                                            onChange={(e) => handleUpdateCriteria(crit.id, 'description', e.target.value)}
                                            className="w-full text-sm font-medium text-gray-600 outline-none resize-none bg-gray-50 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                            placeholder="Describe what is required for full points..."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleRemoveCriteria(crit.id)}
                                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

                    <button 
                        onClick={handleAddCriteria}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={20} /> Add Criterion
                    </button>
                </div>
            </div>
        </div>
    );
};

interface GradingProps {
    submission: Submission;
    assignment: Assignment;
    student: User;
    rubric?: Rubric;
    onSave: (grade: number, feedback: string, rubricScores?: Record<string, number>) => void;
    onCancel: () => void;
}

const GradingWorkspace: React.FC<GradingProps> = ({ submission, assignment, student, rubric, onSave, onCancel }) => {
    // Safety check for critical data
    if (!submission || !assignment) return <div className="p-8 text-red-500 font-bold">Error loading grading context.</div>;

    // State for scores
    const [scores, setScores] = useState<Record<string, number>>(submission.rubricScores || {});
    const [feedback, setFeedback] = useState(submission.feedback || '');
    const [manualScore, setManualScore] = useState(submission.grade || 0);

    const isRubricMode = !!rubric;

    const totalScore = isRubricMode 
        ? Object.values(scores).reduce((a: number, b: number) => a + b, 0)
        : manualScore;

    const maxPossible = isRubricMode
        ? rubric?.criteria.reduce((a: number, b: RubricCriteria) => a + b.maxScore, 0) || 100
        : assignment.maxPoints;

    // Helper to determine grade color class
    const getGradeColorClass = (score: number, max: number) => {
        if (score === max) return "text-blue-600";
        if (score >= max * 0.8) return "text-green-600";
        if (score >= max * 0.5) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-800 mb-1">{student?.name || 'Unknown Student'}</h3>
                    <p className="text-gray-500 font-bold">{assignment?.title}</p>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-black ${getGradeColorClass(totalScore, maxPossible)}`}>
                        {totalScore} <span className="text-xl text-gray-300">/ {maxPossible}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Final Grade</div>
                </div>
            </div>

            {/* Content Display (What did the student write?) */}
            <div className="mb-6 p-4 bg-gray-100 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Student Submission</h4>
                <p className="text-gray-800 font-medium whitespace-pre-wrap">{submission.content || "No text content submitted."}</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isRubricMode && rubric ? (
                    <div className="space-y-6">
                        {rubric.criteria.map((crit) => (
                            <div key={crit.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-800">{crit.title}</h4>
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{scores[crit.id] || 0} / {crit.maxScore} pts</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">{crit.description}</p>
                                
                                <div className="flex gap-2 flex-wrap">
                                    {Array.from({ length: crit.maxScore + 1 }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setScores(prev => ({ ...prev, [crit.id]: i }))}
                                            className={`w-10 h-10 rounded-lg font-bold transition-all
                                                ${(scores[crit.id] === i)
                                                    ? 'bg-blue-600 text-white shadow-md scale-110'
                                                    : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-blue-300'}
                                            `}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                        <p className="text-gray-500 font-bold mb-4">No Rubric Attached. Enter Score Manually.</p>
                        <input 
                            type="number" 
                            value={manualScore}
                            max={maxPossible}
                            onChange={(e) => setManualScore(Math.min(parseInt(e.target.value) || 0, maxPossible))}
                            className="text-4xl font-black text-center w-32 p-2 rounded-xl border-2 border-blue-200 focus:border-blue-500 outline-none text-blue-800 bg-white"
                        />
                        <div className="text-xs text-gray-400 font-bold mt-2 uppercase">Max: {maxPossible}</div>
                    </div>
                )}

                <div className="mt-8">
                    <label className="block text-sm font-bold text-gray-500 mb-2">Teacher Feedback</label>
                    <textarea 
                        className="w-full p-4 rounded-xl border-2 border-gray-200 font-medium text-gray-700 focus:border-blue-400 outline-none h-32 resize-none"
                        placeholder="Great job! Next time try to..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                <button onClick={onCancel} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                <button 
                    onClick={() => onSave(totalScore, feedback, isRubricMode ? scores : undefined)}
                    className="px-8 py-3 rounded-xl font-black bg-green-600 text-white shadow-lg hover:bg-green-700 transition-transform active:scale-95"
                >
                    Save Grade
                </button>
            </div>
        </div>
    );
};

const ModuleControl: React.FC<{ title: string, icon?: string, isLocked: boolean, onToggle: () => void }> = ({ title, icon, isLocked, onToggle }) => (
    <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-colors ${isLocked ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <span className={`font-bold text-sm ${isLocked ? 'text-red-700' : 'text-gray-700'}`}>{title}</span>
        </div>
        <button 
           onClick={onToggle}
           className={`p-2 rounded-lg transition-colors ${isLocked ? 'bg-red-200 text-red-700 hover:bg-red-300' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
        </button>
    </div>
);

export default TeacherDashboard;
