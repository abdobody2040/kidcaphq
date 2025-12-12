
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Assignment, Submission } from '../types';
import { ClipboardList, CheckCircle, Clock, FileText, ChevronRight, Upload, Link as LinkIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentAssignmentDashboard: React.FC = () => {
  const { user, assignments, submissions, addSubmission, lessons } = useAppStore();
  const [activeTab, setActiveTab] = useState<'TODO' | 'SUBMITTED' | 'GRADED'>('TODO');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  if (!user || !user.classId) {
      return (
          <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList size={32} className="text-gray-400"/>
              </div>
              <h2 className="text-xl font-black text-gray-800">No Assignments Yet</h2>
              <p className="text-gray-500 font-bold max-w-xs mt-2">You need to join a class first! Go to your profile to join.</p>
          </div>
      );
  }

  // Filter Logic
  const myAssignments = useMemo(() => {
      // 1. Filter by Class
      // 2. Filter by Group (if applicable)
      // 3. Filter by Specific Student ID (if applicable)
      return assignments.filter(a => {
          if (a.classId !== user.classId) return false;
          if (a.status !== 'PUBLISHED') return false;
          
          // Specific student check
          if (a.specificStudentIds && a.specificStudentIds.length > 0) {
              return a.specificStudentIds.includes(user.id);
          }
          
          // Group check (This would require knowing user's groups, assuming logic here)
          // For MVP, we show all class assignments unless specifically excluded
          return true;
      });
  }, [assignments, user]);

  const { todo, submitted, graded } = useMemo(() => {
      const todo: Assignment[] = [];
      const submittedList: { assignment: Assignment, submission: Submission }[] = [];
      const gradedList: { assignment: Assignment, submission: Submission }[] = [];

      myAssignments.forEach(assign => {
          const sub = submissions.find(s => s.assignmentId === assign.id && s.studentId === user.id);
          if (!sub) {
              todo.push(assign);
          } else if (sub.status === 'GRADED') {
              gradedList.push({ assignment: assign, submission: sub });
          } else {
              submittedList.push({ assignment: assign, submission: sub });
          }
      });

      return { todo, submitted: submittedList, graded: gradedList };
  }, [myAssignments, submissions, user]);

  const handleSubmitWork = () => {
      if (!selectedAssignment) return;
      if (!submissionContent.trim()) {
          alert("Please type your answer or paste a link.");
          return;
      }

      const newSubmission: Submission = {
          id: `sub_${Date.now()}`,
          assignmentId: selectedAssignment.id,
          studentId: user.id,
          submittedAt: new Date().toISOString(),
          status: 'PENDING',
          content: submissionContent
      };

      addSubmission(newSubmission);
      setSubmissionContent('');
      setSelectedAssignment(null);
      // Optional: Play success sound
  };

  const getGradeStyle = (score: number, max: number) => {
      if (score === max) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      if (score >= max * 0.8) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      if (score >= max * 0.5) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  };

  return (
    <div className="pb-20 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <ClipboardList size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-gray-800">My Assignments</h2>
                <p className="text-gray-500 font-bold">Keep up the good work!</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
            <TabButton active={activeTab === 'TODO'} onClick={() => setActiveTab('TODO')} label={`To Do (${todo.length})`} />
            <TabButton active={activeTab === 'SUBMITTED'} onClick={() => setActiveTab('SUBMITTED')} label="Submitted" />
            <TabButton active={activeTab === 'GRADED'} onClick={() => setActiveTab('GRADED')} label="Graded" />
        </div>

        {/* Content */}
        <div className="space-y-4">
            {activeTab === 'TODO' && (
                todo.length === 0 ? (
                    <EmptyState message="You're all caught up! Great job!" />
                ) : (
                    todo.map(assign => (
                        <AssignmentCard 
                            key={assign.id} 
                            assignment={assign} 
                            onClick={() => setSelectedAssignment(assign)}
                            ctaLabel="Start"
                        />
                    ))
                )
            )}

            {activeTab === 'SUBMITTED' && (
                submitted.length === 0 ? (
                    <EmptyState message="No pending submissions." />
                ) : (
                    submitted.map(({ assignment, submission }) => (
                        <div key={assignment.id} className="bg-white p-6 rounded-2xl border-2 border-yellow-100 shadow-sm opacity-80">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-black text-lg text-gray-800">{assignment.title}</h3>
                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Pending Grade</span>
                            </div>
                            <p className="text-xs text-gray-400 font-bold">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                        </div>
                    ))
                )
            )}

            {activeTab === 'GRADED' && (
                graded.length === 0 ? (
                    <EmptyState message="No graded assignments yet." />
                ) : (
                    graded.map(({ assignment, submission }) => {
                        const style = getGradeStyle(submission.grade || 0, assignment.maxPoints);
                        return (
                            <div key={assignment.id} className={`p-6 rounded-2xl border-2 shadow-sm flex justify-between items-center ${style.border} bg-white`}>
                                <div>
                                    <h3 className="font-black text-lg text-gray-800">{assignment.title}</h3>
                                    <p className={`${style.text} font-bold text-sm mt-1`}>{submission.feedback}</p>
                                </div>
                                <div className={`text-center p-3 rounded-xl min-w-[80px] ${style.bg}`}>
                                    <div className={`text-2xl font-black ${style.text}`}>{submission.grade}</div>
                                    <div className={`text-xs font-bold uppercase opacity-80 ${style.text}`}>Score</div>
                                </div>
                            </div>
                        );
                    })
                )
            )}
        </div>

        {/* SUBMISSION MODAL */}
        <AnimatePresence>
            {selectedAssignment && (
                <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-6 bg-blue-50 border-b border-blue-100 flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">New Assignment</div>
                                <h3 className="text-2xl font-black text-gray-800">{selectedAssignment.title}</h3>
                            </div>
                            <button onClick={() => setSelectedAssignment(null)} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-500 font-bold">Close</button>
                        </div>

                        {/* Body */}
                        <div className="p-8 overflow-y-auto flex-1">
                            {/* Description */}
                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Instructions</h4>
                                <div className="text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                                    {selectedAssignment.description || "No instructions provided."}
                                </div>
                            </div>

                            {/* Resource Link */}
                            {selectedAssignment.resourceUrl && (
                                <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg text-blue-500 border border-gray-100"><LinkIcon size={20} /></div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-xs font-bold text-gray-400 uppercase">Attached Resource</div>
                                        <a href={selectedAssignment.resourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-bold truncate block hover:underline">
                                            {selectedAssignment.resourceUrl}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Submission Area */}
                            <div className="border-t pt-6">
                                <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                    <Upload size={16} /> Submit Your Work
                                </h4>
                                <textarea 
                                    className="w-full p-4 rounded-xl border-2 border-gray-200 font-medium focus:border-kid-accent outline-none h-32 resize-none"
                                    placeholder="Type your answer here or paste a link to your project..."
                                    value={submissionContent}
                                    onChange={(e) => setSubmissionContent(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button 
                                onClick={handleSubmitWork}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-black text-lg shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy flex items-center gap-2"
                            >
                                <Send size={20} /> Submit Assignment
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: any) => (
    <button 
        onClick={onClick}
        className={`px-6 py-2 font-black text-sm uppercase tracking-wide transition-all border-b-4 
            ${active ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}
        `}
    >
        {label}
    </button>
);

const AssignmentCard = ({ assignment, onClick, ctaLabel }: any) => {
    const isDueSoon = assignment.dueDate ? new Date(assignment.dueDate).getTime() - Date.now() < 86400000 * 3 : false;
    
    return (
        <div 
            onClick={onClick}
            className="group bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-200 shadow-sm transition-all cursor-pointer flex items-center gap-6"
        >
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-xl text-gray-800 group-hover:text-blue-600 transition-colors">{assignment.title}</h3>
                    {isDueSoon && <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 rounded">DUE SOON</span>}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-bold">
                    <span className="flex items-center gap-1"><Clock size={14} /> Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No Date'}</span>
                    <span className="flex items-center gap-1 text-gray-300">|</span>
                    <span className="text-gray-400">{assignment.maxPoints} Pts</span>
                </div>
            </div>
            <div className="bg-gray-50 group-hover:bg-blue-600 group-hover:text-white p-3 rounded-full transition-colors text-gray-300">
                <ChevronRight size={24} strokeWidth={3} />
            </div>
        </div>
    );
};

const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="text-4xl mb-2 opacity-50">🎉</div>
        <p className="font-bold text-gray-400">{message}</p>
    </div>
);

export default StudentAssignmentDashboard;
