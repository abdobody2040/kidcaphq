
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Book } from '../types';
import { Trash2, Plus, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { generateBookDetails } from '../services/geminiService';

const AdminBookManager: React.FC = () => {
  const { library, addBook, removeBook, isAdminMode } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<Book['category']>('Finance');
  const [lesson1, setLesson1] = useState('');
  const [lesson2, setLesson2] = useState('');
  const [lesson3, setLesson3] = useState('');
  const [ageRating, setAgeRating] = useState('8+');

  if (!isAdminMode) return null;

  const handleAutoFill = async () => {
    if (!title || !author) {
      alert("Please enter a Title and Author first.");
      return;
    }
    
    setIsGenerating(true);
    const data = await generateBookDetails(title, author);
    setIsGenerating(false);

    if (data) {
      setSummary(data.summary);
      setLesson1(data.keyLessons[0] || '');
      setLesson2(data.keyLessons[1] || '');
      setLesson3(data.keyLessons[2] || '');
    } else {
      alert("Could not generate details. Please try again or fill manually.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !summary) {
      alert("Please fill in all required fields.");
      return;
    }

    const newBook: Book = {
      id: `book_${Date.now()}`,
      title,
      author,
      coverUrl: coverUrl || 'https://via.placeholder.com/300x450?text=No+Cover',
      summary,
      category,
      keyLessons: [lesson1, lesson2, lesson3].filter(l => l.trim() !== ''),
      ageRating
    };

    addBook(newBook);
    
    // Reset Form
    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setSummary('');
    setLesson1('');
    setLesson2('');
    setLesson3('');
  };

  return (
    <div className="bg-gray-900 text-gray-200 p-8 mt-20 rounded-t-3xl border-t-4 border-gray-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-700 pb-4">
          <BookOpen className="text-purple-400" size={32} />
          <div>
            <h2 className="text-2xl font-black text-white">Secret Library Manager</h2>
            <p className="text-gray-400 text-sm">You are in Admin Mode. Add books for the kids!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FORM */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                <input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                  placeholder="e.g. Shoe Dog"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Author</label>
                <input 
                  value={author} 
                  onChange={e => setAuthor(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                  placeholder="e.g. Phil Knight"
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={handleAutoFill}
              disabled={isGenerating}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {isGenerating ? 'Asking AI...' : 'Auto-Fill Details with AI'}
            </button>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cover Image URL</label>
              <input 
                value={coverUrl} 
                onChange={e => setCoverUrl(e.target.value)} 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value as any)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                >
                  <option value="Finance">Finance</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Biography">Biography</option>
                  <option value="Fiction">Fiction</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Age Rating</label>
                <input 
                  value={ageRating} 
                  onChange={e => setAgeRating(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Summary</label>
              <textarea 
                value={summary} 
                onChange={e => setSummary(e.target.value)} 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none h-24 resize-none"
                placeholder="Book summary..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-gray-500">Key Lessons (3 Bullet Points)</label>
              <input value={lesson1} onChange={e => setLesson1(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-sm" placeholder="Lesson 1" />
              <input value={lesson2} onChange={e => setLesson2(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-sm" placeholder="Lesson 2" />
              <input value={lesson3} onChange={e => setLesson3(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-sm" placeholder="Lesson 3" />
            </div>

            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2">
              <Plus size={20} /> Save Book to Library
            </button>
          </form>

          {/* LIST */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 overflow-y-auto max-h-[600px]">
            <h3 className="font-bold text-gray-400 mb-4 uppercase text-xs tracking-widest">Current Books ({library.length})</h3>
            <div className="space-y-3">
              {library.map(book => (
                <div key={book.id} className="flex gap-4 p-3 bg-gray-900 rounded-xl border border-gray-700 group">
                  <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded bg-gray-800" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{book.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{book.author}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-800 text-gray-300 text-[10px] rounded uppercase font-bold tracking-wide border border-gray-600">
                      {book.category}
                    </span>
                  </div>
                  <button 
                    onClick={() => removeBook(book.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors self-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {library.length === 0 && <div className="text-gray-500 text-center py-10">Library is empty.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookManager;
