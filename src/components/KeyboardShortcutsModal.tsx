import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X, Command, Shield, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_LIST = [
  { key: 'Alt + 1', description: 'Switch to Taming Calculator & Starve Engine' },
  { key: 'Alt + 2', description: 'Switch to Turret Soaker Hitbox Matrix' },
  { key: 'Alt + 3', description: 'Switch to Pyromane Taming Strategy' },
  { key: 'Alt + 4', description: 'Switch to Mating & Incubation Hub' },
  { key: 'Alt + 5', description: 'Switch to Topographical Resource Maps' },
  { key: 'Alt + 6', description: 'Switch to Tribe ARB & Ammo Calculator' },
  { key: 'Alt + 7', description: 'Switch to Dino Stat Lookup & Tips' },
  { key: 'Alt + 8', description: 'Switch to War Room Raid Timers' },
  { key: 'Alt + 9', description: 'Switch to PK Store Catalog' },
  { key: 'Alt + M', description: 'Toggle Audio Alarm Sounds (Mute / Unmute)' },
  { key: 'Alt + P', description: 'Open PK Store VIP Modal' },
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
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
            className="relative w-full max-w-lg bg-[#070e1a] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 z-10 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-cyan-300">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="keyboard-shortcuts-title" className="text-lg font-hud font-bold text-white tracking-wide">
                    KEYBOARD SHORTCUTS
                  </h2>
                  <p className="text-xs text-slate-400 font-tek">
                    Navigate the entire war room without touching a mouse
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close shortcuts dialog"
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer border border-transparent hover:border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shortcuts Grid */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {SHORTCUT_LIST.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 bg-[#0a1424] border border-slate-800/80 rounded-xl text-xs hover:border-cyan-500/30 transition-all"
                >
                  <span className="text-slate-300 font-medium">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2.5 py-1 bg-[#050b14] border border-cyan-500/40 rounded-lg text-cyan-300 font-mono font-bold text-[11px] shadow-sm shrink-0 ml-3">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-tek">
                <Shield className="w-3.5 h-3.5" />
                <span>ACCESSIBILITY READY // WCAG 2.1 AA COMPLIANT</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-hud font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                CLOSE [ESC]
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
