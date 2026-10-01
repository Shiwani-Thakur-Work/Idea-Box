import type { Idea } from '../../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Trash2 } from 'lucide-react';
import { useIdeaStore } from '../../store/useIdeaStore';

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const navigate = useNavigate();
  const deleteIdea = useIdeaStore(state => state.deleteIdea);
  
  const progress = idea.tasks.length > 0 
    ? Math.round((idea.tasks.filter(t => t.completed).length / idea.tasks.length) * 100) 
    : 0;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      onClick={() => navigate(`/idea/${idea.id}`)}
      className="glass-panel glass-panel-hover rounded-2xl p-6 cursor-pointer group flex flex-col h-full relative overflow-hidden"
    >
      {/* Decorative gradient blur based on status */}
      <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-20 pointer-events-none ${
        idea.status === 'Exploring' ? 'bg-amber-500' :
        idea.status === 'Building' ? 'bg-blue-500' :
        idea.status === 'Shipped' ? 'bg-emerald-500' : 'bg-gray-500'
      }`} />

      <div className="flex items-start justify-between mb-4 relative z-10 gap-2">
        <h3 className="font-display font-semibold text-2xl text-white group-hover:text-indigo-300 transition-colors pr-2">
          {idea.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
            idea.status === 'Exploring' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
            idea.status === 'Building' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
            idea.status === 'Shipped' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 
            'bg-white/5 text-gray-300 border-white/10'
          }`}>
            {idea.status}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this idea?')) {
                deleteIdea(idea.id);
              }
            }}
            className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-1 relative z-10">
        {idea.description || "No description provided. Click to add one."}
      </p>
      
      {idea.status === 'Building' && idea.tasks.length > 0 && (
        <div className="mb-6 relative z-10">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-blue-400" />
              Tasks
            </span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2 flex-wrap max-w-[75%]">
          {idea.tags.map(tag => (
            <span key={tag} className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all transform group-hover:scale-110 group-hover:-rotate-45">
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  );
}
