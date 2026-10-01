import { useEffect, useState } from 'react';
import { useIdeaStore } from '../store/useIdeaStore';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, Sparkles } from 'lucide-react';
import IdeaCard from '../components/shared/IdeaCard';
import type { IdeaStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_FILTERS = ['All', 'Draft', 'Exploring', 'Building', 'Shipped', 'Parked', 'Archived'];

export default function Dashboard() {
  const { ideas, seedData, addIdea } = useIdeaStore();
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'All'>('All');

  useEffect(() => {
    seedData();
  }, [seedData]);

  const exploring = ideas.filter(i => i.status === 'Exploring').length;
  const building = ideas.filter(i => i.status === 'Building').length;
  const shipped = ideas.filter(i => i.status === 'Shipped').length;

  const handleCreateNew = () => {
    const newId = addIdea("New Project Idea", "What's on your mind?", []);
    navigate(`/idea/${newId}`);
  };

  const filteredIdeas = statusFilter === 'All' 
    ? ideas 
    : ideas.filter(idea => idea.status === statusFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Hero Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight font-display"
          >
            Ideas worth <span className="animated-gradient-text">building.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl font-light"
          >
            Capture the thought. Explore the possibility. Build the thing.
          </motion.p>
        </div>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black font-semibold rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all"
        >
          <Plus size={20} />
          <span>Capture Idea</span>
        </motion.button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Ideas', count: ideas.length, gradient: 'from-gray-100 to-gray-400' },
          { label: 'Exploring', count: exploring, gradient: 'from-amber-200 to-orange-400' },
          { label: 'Building', count: building, gradient: 'from-cyan-300 to-blue-500' },
          { label: 'Shipped', count: shipped, gradient: 'from-emerald-300 to-green-500' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            key={stat.label} 
            className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <LayoutGrid size={40} />
            </div>
            <div className={`text-5xl font-display font-bold mb-2 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.count}
            </div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Dynamic Sidebar Filters */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full lg:w-56 shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar"
        >
          <h3 className="hidden lg:block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">
            Idea Stages
          </h3>
          <div className="flex lg:flex-col gap-2">
            {STATUS_FILTERS.map(status => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{status}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Ideas Grid Area */}
        <div className="flex-1 w-full min-h-[400px]">
          <AnimatePresence mode="wait">
            {filteredIdeas.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center h-full py-20 px-6 glass-panel rounded-3xl border-dashed border-white/20"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Sparkles className="text-gray-500" size={32} />
                </div>
                <div className="text-2xl font-display font-medium mb-3 text-white">
                  {statusFilter === 'All' ? 'No ideas yet' : `Nothing in ${statusFilter}`}
                </div>
                <div className="text-gray-400 text-center max-w-sm">
                  {statusFilter === 'Shipped' ? 'You haven\'t shipped any ideas yet. Keep building!' :
                   statusFilter === 'Archived' ? 'No archived ideas. That\'s a good thing!' :
                   statusFilter === 'Building' ? 'You aren\'t actively building anything right now. Time to start!' :
                   'That blank space is basically asking you to start something new. Capture a thought to begin.'}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
              >
                {filteredIdeas.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
