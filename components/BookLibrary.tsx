
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Book } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, X, Lock, CheckCircle2 } from 'lucide-react';

interface BookLibraryProps {}

const BookLibrary: React.FC<BookLibraryProps> = () => {
  const { library, toggleAdminMode } = useAppStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [secretCount, setSecretCount] = useState(0);

  const handleSecretClick = () => {
    const newCount = secretCount + 1;
    setSecretCount(newCount);
    if (newCount === 5) {
      toggleAdminMode();
      setSecretCount(0);
      alert("Admin Mode Toggled! Scroll down.");
    }
  };

  return (
    <div className="pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 px-4">
        <div>
          <h2 className="text-4xl font-black text-gray-800 mb-2 flex items-center gap-3">
            <BookOpen className="text-amber-700" size={40} />
            The Library
          </h2>
          <p className="text-gray-500 font-bold text-lg">Read books to grow your CEO brain!</p>
        </div>
        
        {/* Secret Trigger */}
        <button 
          onClick={handleSecretClick} 
          className="text-gray-200 hover:text-gray-300 transition-colors p-2"
        >
          <Lock size={20} />
        </button>
      </div>

      {/* Bookshelf Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {library.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-amber-50 rounded-r-2xl rounded-l-md shadow-md border-r-8 border-b-8 border-amber-200 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Spine Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-amber-800 rounded-l-md opacity-20" />

            <div className="p-6 flex gap-6 items-start">
              {/* Cover */}
              <div className="w-24 h-36 shrink-0 rounded-lg shadow-md overflow-hidden border-2 border-white transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 bg-gray-200">
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-block bg-white text-amber-800 text-[10px] font-black uppercase px-2 py-1 rounded mb-2 border border-amber-100 tracking-wider">
                  {book.category}
                </div>
                <h3 className="font-black text-gray-800 text-lg leading-tight mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-xs font-bold text-gray-500 mb-4">{book.author}</p>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full w-fit">
                  <Star size={12} fill="currentColor" /> {book.ageRating}
                </div>
              </div>
            </div>

            <div className="mt-auto p-4 border-t border-amber-100 bg-white/50 rounded-br-xl">
              <button 
                onClick={() => setSelectedBook(book)}
                className="w-full py-3 bg-amber-500 text-white font-black rounded-xl shadow-[0_4px_0_0_rgba(180,83,9,1)] btn-juicy hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen size={18} /> Read Summary
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {library.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-bold bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mx-4">
          The shelves are dusty... Ask an admin to add books!
        </div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="bg-amber-50 p-6 border-b border-amber-100 flex justify-between items-start">
                <div className="flex gap-6">
                  <div className="w-24 h-36 rounded-lg shadow-lg border-4 border-white overflow-hidden shrink-0 bg-gray-200">
                    <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">{selectedBook.category}</div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-1">{selectedBook.title}</h2>
                    <p className="text-gray-500 font-bold text-lg">{selectedBook.author}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="prose prose-amber max-w-none">
                  <h4 className="font-black text-gray-700 text-lg mb-2">What's it about?</h4>
                  <p className="text-gray-600 font-medium leading-relaxed mb-8 text-lg">
                    {selectedBook.summary}
                  </p>

                  <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                    <h4 className="font-black text-blue-800 text-lg mb-4 flex items-center gap-2">
                      <Star className="text-yellow-400 fill-current" /> Key Lessons
                    </h4>
                    <ul className="space-y-3">
                      {selectedBook.keyLessons.map((lesson, i) => (
                        <li key={i} className="flex items-start gap-3 font-bold text-gray-700">
                          <div className="mt-1 bg-blue-200 text-blue-700 rounded-full p-0.5 shrink-0">
                            <CheckCircle2 size={16} />
                          </div>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors"
                >
                  Close Book
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookLibrary;
