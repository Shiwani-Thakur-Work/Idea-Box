import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdeaStore } from '../store/useIdeaStore';
import type { IdeaStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, CheckCircle2, Circle, ListTodo, ChevronDown } from 'lucide-react';

type Tab = 'Capture' | 'Explore' | 'Build';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ideas, updateIdea, updateIdeaStatus, deleteIdea, addTask, toggleTask, deleteTask, updateResearch } = useIdeaStore();
  
  const idea = ideas.find(i => i.id === id);
  const [activeTab, setActiveTab] = useState<Tab>('Capture');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  if (!idea) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Idea not found</h2>
        <button onClick={() => navigate('/')} className="text-blue-400 hover:underline">Return to Dashboard</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      deleteIdea(idea.id);
      navigate('/');
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(idea.id, newTaskTitle);
    setNewTaskTitle('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        <span>Back to ideas</span>
      </button>

      {/* Header Area */}
      <header className="glass-panel p-8 rounded-3xl relative group z-50">
        <div className="absolute top-0 right-0 p-6 flex gap-3">
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-lg px-4 py-2 outline-none transition-colors"
            >
              <span>{idea.status}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 text-gray-400 ${isStatusOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isStatusOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-36 max-h-60 overflow-y-auto bg-[#0f172a] border border-white/10 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] z-50 py-1"
                  >
                    {['Draft', 'Exploring', 'Building', 'Shipped', 'Parked', 'Archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          updateIdeaStatus(idea.id, status as IdeaStatus);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          idea.status === status ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <input 
          type="text" 
          value={idea.title}
          onChange={(e) => updateIdea(idea.id, { title: e.target.value })}
          placeholder="Untitled Idea"
          className="text-4xl md:text-5xl font-display font-bold bg-transparent border-none outline-none text-white w-[80%] mb-4 placeholder-white/20"
        />
        
        <input 
          type="text" 
          value={idea.tags.join(', ')}
          onChange={(e) => updateIdea(idea.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
          placeholder="Add tags (comma separated)..."
          className="bg-transparent border-none outline-none text-gray-400 text-sm w-full placeholder-gray-600"
        />
      </header>

      {/* Workflow Tabs */}
      <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
        {['Capture', 'Explore', 'Build'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`relative px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/50 rounded-xl"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab} Stage</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="glass-panel p-8 rounded-3xl min-h-[400px]"
        >
          {activeTab === 'Capture' && (
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold mb-6">The initial thought</h3>
              <textarea 
                value={idea.description}
                onChange={(e) => updateIdea(idea.id, { description: e.target.value })}
                placeholder="Write your rough idea here. Don't worry about details yet..."
                className="w-full h-64 bg-transparent border border-white/10 rounded-xl p-4 text-gray-300 outline-none focus:border-indigo-500/50 resize-none transition-colors"
              />
            </div>
          )}

          {activeTab === 'Explore' && (
            <div className="space-y-6">
              <h3 className="text-xl font-display font-semibold mb-6">Research & Validation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Problem to solve</label>
                  <textarea 
                    value={idea.research.problem}
                    onChange={(e) => updateResearch(idea.id, { problem: e.target.value })}
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 outline-none focus:border-indigo-500/50 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Target Audience</label>
                  <textarea 
                    value={idea.research.targetAudience}
                    onChange={(e) => updateResearch(idea.id, { targetAudience: e.target.value })}
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 outline-none focus:border-indigo-500/50 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Existing Solutions</label>
                  <textarea 
                    value={idea.research.existingSolutions}
                    onChange={(e) => updateResearch(idea.id, { existingSolutions: e.target.value })}
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 outline-none focus:border-indigo-500/50 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Potential Tech Stack</label>
                  <textarea 
                    value={idea.research.techStack}
                    onChange={(e) => updateResearch(idea.id, { techStack: e.target.value })}
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 outline-none focus:border-indigo-500/50 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Build' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-semibold flex items-center gap-2">
                  <ListTodo className="text-indigo-400" />
                  Execution Plan
                </h3>
                <div className="text-sm font-mono text-gray-400">
                  {idea.tasks.filter(t => t.completed).length} / {idea.tasks.length} Completed
                </div>
              </div>

              <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  Add Task
                </button>
              </form>

              <div className="space-y-2">
                {idea.tasks.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 border border-dashed border-white/10 rounded-xl">
                    No tasks yet. Start breaking down the project!
                  </div>
                ) : (
                  idea.tasks.map((task) => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                    >
                      <div 
                        className="flex items-center gap-3 cursor-pointer flex-1"
                        onClick={() => toggleTask(idea.id, task.id)}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                        ) : (
                          <Circle className="text-gray-500 shrink-0" size={20} />
                        )}
                        <span className={`${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                          {task.title}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteTask(idea.id, task.id)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
