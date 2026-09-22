import React, { useState } from 'react';
import { 
  Timer, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Sparkles,
  Egg,
  Crosshair,
  Heart,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTimer } from '../types';
import { playTekAlarmSound, requestNotificationPermission } from '../utils/audioAlert';

interface TimerManagerProps {
  timers: ActiveTimer[];
  onDeleteTimer: (id: string) => void;
  onClearExpired: () => void;
  onAddTimer: (timer: Omit<ActiveTimer, 'id'>) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const TimerManager: React.FC<TimerManagerProps> = ({
  timers,
  onDeleteTimer,
  onClearExpired,
  onAddTimer,
  soundEnabled,
  setSoundEnabled
}) => {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customMinutes, setCustomMinutes] = useState(30);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermissionGranted(granted);
    if (granted) {
      playTekAlarmSound();
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const durationSec = Math.max(10, customMinutes * 60);
    onAddTimer({
      title: customTitle.trim(),
      type: 'custom',
      targetTimestamp: Date.now() + durationSec * 1000,
      totalDurationSeconds: durationSec,
      notes: 'Custom tribe alarm'
    });

    setCustomTitle('');
    setShowAddCustom(false);
  };

  const getTimerIcon = (type: ActiveTimer['type']) => {
    switch (type) {
      case 'egg_hatch':
        return <Egg className="w-4 h-4 text-amber-400" />;
      case 'baby_imprint':
        return <Heart className="w-4 h-4 text-emerald-400" />;
      case 'tame_starve':
        return <Crosshair className="w-4 h-4 text-purple-400" />;
      case 'tame_wake':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-cyan-400" />;
    }
  };

  const formatCountdown = (targetTimestamp: number) => {
    const remainingMs = targetTimestamp - Date.now();
    if (remainingMs <= 0) return '00:00:00 (EXPIRED)';

    const totalSeconds = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                Synthesized TEK Alert Hub
              </span>
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                Active Alarms: {timers.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-hud text-white mt-1">
              SURVIVOR ALARMS & COUNTDOWN TIMERS
            </h2>
            <p className="text-xs text-slate-400">
              Never miss an egg hatch, baby imprint interval, or wild tame starve point during high-intensity PvP gameplay.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Request browser notification */}
            {!notificationPermissionGranted && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 rounded-lg text-cyan-300 text-xs font-hud font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Desktop Popups</span>
              </motion.button>
            )}

            {/* Test sound */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSoundEnabled(true);
                playTekAlarmSound();
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 text-xs font-hud font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Audio Beep</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-hud font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom Alarm</span>
            </motion.button>
          </div>
        </div>

        {/* Custom Alarm Drawer */}
        <AnimatePresence>
          {showAddCustom && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateCustom} 
              className="mt-4 pt-4 border-t border-slate-800 space-y-3 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="text-[11px] font-tek text-slate-400">ALARM LABEL</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Indy Forge Charcoal Finish, Trough Meat Refill, Turret Ammo Check..."
                    className="w-full bg-[#070d17] border border-cyan-500/40 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 font-hud mt-1 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="text-[11px] font-tek text-slate-400">MINUTES</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#070d17] border border-cyan-500/40 rounded-lg px-3 py-2 text-xs text-cyan-300 font-tek font-bold focus:outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-cyan-500 text-black font-hud font-bold text-xs rounded-lg shrink-0 cursor-pointer"
                    >
                      Start
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Timers List */}
      {timers.length === 0 ? (
        <div className="bg-[#0b121e] border border-slate-800 rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-hud font-bold text-slate-200">NO ACTIVE ALARMS RUNNING</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Add an alarm directly from the <strong>Taming Calculator</strong> (Starve & Wakeup timers), the <strong>Breeding Calculator</strong> (Egg Hatch & Imprint alarms), or click <strong>Custom Alarm</strong> above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tek text-slate-400">
              LISTENING FOR TIMERS IN REAL-TIME
            </span>
            <button
              onClick={onClearExpired}
              className="text-xs font-hud text-slate-400 hover:text-white underline cursor-pointer"
            >
              Clear Finished Alarms
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {timers.map((timer) => {
                const remainingMs = timer.targetTimestamp - Date.now();
                const isExpired = remainingMs <= 0;
                const isUrgent = remainingMs > 0 && remainingMs <= 120000; // < 2 mins

                const elapsedMs = Math.max(0, (timer.totalDurationSeconds * 1000) - remainingMs);
                const progressPercent = Math.min(100, Math.max(0, (elapsedMs / (timer.totalDurationSeconds * 1000)) * 100));

                return (
                  <motion.div
                    key={timer.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.2 }}
                    className={`relative overflow-hidden rounded-xl border p-4 transition-colors shadow-xl ${
                      isExpired
                        ? 'bg-red-950/40 border-red-500 animate-pulse'
                        : isUrgent
                        ? 'bg-amber-950/30 border-amber-500'
                        : 'bg-[#0b121e] border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                          isExpired
                            ? 'bg-red-500/20 border-red-500 text-red-400'
                            : 'bg-[#070e1a] border-slate-700'
                        }`}>
                          {getTimerIcon(timer.type)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-hud font-bold text-white tracking-wide">
                              {timer.title}
                            </span>
                            {isExpired && (
                              <span className="px-1.5 py-0.2 bg-red-500 text-white text-[9px] font-tek font-bold rounded">
                                EXPIRED
                              </span>
                            )}
                          </div>
                          {timer.notes && (
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                              {timer.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTimer(timer.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete Timer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Countdown Big Counter */}
                    <div className="mt-3 flex items-baseline justify-between">
                      <div className={`text-2xl font-tek font-bold tracking-wider ${
                        isExpired ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-cyan-300'
                      }`}>
                        {formatCountdown(timer.targetTimestamp)}
                      </div>

                      <span className="text-[10px] text-slate-400 font-tek">
                        Duration: {Math.round(timer.totalDurationSeconds / 60)} min
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          isExpired ? 'bg-red-500' : isUrgent ? 'bg-amber-400' : 'bg-cyan-400'
                        }`}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
