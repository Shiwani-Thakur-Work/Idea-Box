import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdeaStore } from '../../store/useIdeaStore';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { ideas } = useIdeaStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : onClose(); // Wait, this should be handled by MainLayout
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredIdeas = query 
    ? ideas.filter(idea => 
        idea.title.toLowerCase().includes(query.toLowerCase()) || 
        idea.description.toLowerCase().includes(query.toLowerCase()) ||
        idea.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
            onClick={onClose}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#1e293b] border border-white/10 shadow-2xl rounded-xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search className="text-gray-400 mr-3" size={20} />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search ideas, descriptions, or tags..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-gray-500"
                />
                <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              {query && (
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {filteredIdeas.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">
                      No ideas found matching "{query}"
                    </div>
                  ) : (
                    filteredIdeas.map(idea => (
                      <div 
                        key={idea.id}
                        onClick={() => {
                          navigate(`/idea/${idea.id}`);
                          onClose();
                        }}
                        className="px-4 py-3 hover:bg-white/5 rounded-lg cursor-pointer flex flex-col gap-1 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-blue-400">{idea.title}</span>
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/10">
                            {idea.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-1">{idea.description}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
