import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Download, Upload, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const handleExport = () => {
    try {
      const data = localStorage.getItem('ideabox-storage');
      if (!data) throw new Error("No data found to export.");
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `ideabox-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to export data.');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        
        // Basic validation checking if it matches our Zustand persist format
        if (!data.state || !Array.isArray(data.state.ideas)) {
          throw new Error("Invalid IdeaBox backup file format.");
        }

        localStorage.setItem('ideabox-storage', json);
        setImportStatus({ type: 'success', message: 'Data imported successfully! Reloading...' });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setImportStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to parse backup file.' });
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel w-full max-w-lg rounded-3xl p-8 relative z-10 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
                <Settings className="text-indigo-400" size={24} />
              </div>
              <h2 className="text-2xl font-display font-semibold text-white">Data Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                  <Download size={18} className="text-blue-400" />
                  Export Data
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Download a complete backup of all your ideas, research, and tasks as a JSON file. Keep it safe!
                </p>
                <button 
                  onClick={handleExport}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors border border-white/10"
                >
                  Download Backup File
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                  <Upload size={18} className="text-emerald-400" />
                  Import Data
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Restore your ideas from a previous backup file. 
                  <span className="text-amber-400 block mt-1">Warning: This will overwrite your current data!</span>
                </p>
                
                <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef}
                  onChange={handleImport}
                  className="hidden" 
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium py-3 rounded-xl transition-colors border border-emerald-500/30"
                >
                  Select Backup File
                </button>
                
                {importStatus.type !== 'idle' && (
                  <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
                    importStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {importStatus.type === 'success' ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                    {importStatus.message}
                  </div>
                )}
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
