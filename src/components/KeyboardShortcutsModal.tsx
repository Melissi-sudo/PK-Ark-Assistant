import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X, Shield } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_LIST = [
  { key: '/ or Ctrl + K', description: 'Open Quick Jump Navigator (Instant search across all tools)' },
  { key: 'Alt + B', description: 'Toggle Tactical Navigation Sidebar Drawer' },
  { key: 'Alt + R', description: 'Open ARK Server Rate Multipliers Configurator' },
  { key: 'Alt + 1', description: 'Switch to Taming Calculator & Starve Engine' },
  { key: 'Alt + 2', description: 'Switch to Turret Soaker Hitbox Matrix' },
  { key: 'Alt + 3', description: 'Switch to Pyromane Taming Strategy' },
  { key: 'Alt + 4', description: 'Switch to Mating & Incubation Hub' },
  { key: 'Alt + 5', description: 'Switch to Topographical Resource Maps' },
  { key: 'Alt + 6', description: 'Switch to Tribe ARB & Ammo Calculator' },
  { key: 'Alt + 7', description: 'Switch to Dino Stat Lookup & Tips' },
  { key: 'Alt + 8', description: 'Switch to War Room Raid Timers' },
  { key: 'Alt + M', description: 'Toggle Audio Alarm Sounds (Mute / Unmute)' },
  { key: 'Alt + I', description: 'Replay Tactical Intro Cinematic Sequence' },
  { key: 'Escape', description: 'Close any open modal or menu' },
  { key: '?', description: 'Open / Close this Keyboard Shortcuts Guide' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="keyboard-shortcuts-title"
        >
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#070e1a] border border-[#e6e6e8] dark:border-cyan-500/40 rounded-[28px] shadow-2xl p-6 z-10 space-y-5 text-[#1d1d1f] dark:text-[#f5f5f7] font-sf-text"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e6e6e8] dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#f5f5f7] dark:bg-cyan-500/15 border border-[#e6e6e8] dark:border-cyan-500/30 rounded-2xl text-[#0066cc] dark:text-cyan-300">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="keyboard-shortcuts-title" className="text-base sm:text-lg font-semibold tracking-tight font-sf-display text-[#1d1d1f] dark:text-white">
                    Keyboard Navigation Shortcuts
                  </h2>
                  <p className="text-xs text-[#707070] dark:text-slate-400">
                    Fast hotkeys for every companion calculator
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close shortcuts dialog"
                className="w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-slate-800/60 border border-[#e6e6e8] dark:border-transparent text-[#707070] dark:text-slate-400 hover:text-[#1d1d1f] dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcuts Grid */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {SHORTCUT_LIST.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#f5f5f7] dark:bg-[#0a1424] border border-[#e6e6e8] dark:border-slate-800/80 rounded-2xl text-xs transition-all hover:border-[#0066cc] dark:hover:border-cyan-500/30"
                >
                  <span className="text-[#1d1d1f] dark:text-slate-300 font-medium">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2.5 py-1 bg-white dark:bg-[#050b14] border border-[#d6d6d6] dark:border-cyan-500/40 rounded-lg text-[#0066cc] dark:text-cyan-300 font-mono font-semibold text-[11px] shadow-sm shrink-0 ml-3">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#e6e6e8] dark:border-slate-800/80 flex items-center justify-between text-xs text-[#707070] dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-[#707070] dark:text-cyan-400">
                <Shield className="w-3.5 h-3.5 text-[#0066cc] dark:text-cyan-400" />
                <span>WCAG 2.1 AA Compliant</span>
              </span>
              <button
                onClick={onClose}
                className="apple-pill-blue text-xs px-4 py-1.5 cursor-pointer"
              >
                Close [ESC]
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
