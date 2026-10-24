import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cookie, Check, X, ChevronDown, ChevronUp, Sparkles, BarChart3, Database } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  timestamp: number;
}

const COOKIE_STORAGE_KEY = 'pk_cookie_consent_v1';

export function getStoredCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredCookieConsent(prefs: CookiePreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    // Apply Google Analytics consent mode or gtag update
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied'
      });
    }
  } catch {
    // ignore
  }
}

interface CookieConsentBannerProps {
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  forceOpen = false,
  onCloseForceOpen
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = getStoredCookieConsent();
    if (!consent) {
      // Delay display slightly so it animates in gracefully after initial page paint
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    } else {
      setAnalyticsEnabled(consent.analytics);
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setIsVisible(true);
      setShowDetails(true);
    }
  }, [forceOpen]);

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      timestamp: Date.now()
    };
    saveStoredCookieConsent(prefs);
    setAnalyticsEnabled(true);
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleEssentialOnly = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      timestamp: Date.now()
    };
    saveStoredCookieConsent(prefs);
    setAnalyticsEnabled(false);
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleSaveCustom = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: analyticsEnabled,
      timestamp: Date.now()
    };
    saveStoredCookieConsent(prefs);
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div 
        role="region" 
        aria-label="Cookie and Privacy Consent"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 pointer-events-auto select-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="rounded-[24px] border border-gray-200 dark:border-[#2c2c2e] bg-white/98 dark:bg-[#1c1c1e]/98 backdrop-blur-2xl p-5 shadow-2xl text-[#111827] dark:text-[#f5f5f7] font-sf-text space-y-4"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] flex items-center justify-center text-[#0066cc] dark:text-[#2997ff] shrink-0">
                <Cookie className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight font-sf-display leading-none text-[#111827] dark:text-white">
                  Privacy & Analytics Preferences
                </h4>
                <div className="text-[11px] text-[#4b5563] dark:text-[#9ca3af] mt-1 font-semibold">
                  Cookie & Local Storage Notice
                </div>
              </div>
            </div>

            <button
              onClick={handleEssentialOnly}
              className="text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss cookie notice with essential cookies only"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed font-normal">
            We use essential local storage to remember active raid timers, custom server rate multipliers, and dark mode. Optional Google Analytics helps us benchmark calculation speeds and improve engine formulas.
          </p>

          {/* Collapsible Details Panel */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5 pt-2 border-t border-gray-200 dark:border-[#2c2c2e] overflow-hidden"
            >
              {/* Essential Storage Card */}
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#161617] border border-gray-200 dark:border-[#2c2c2e] flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Database className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff] shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#111827] dark:text-[#f5f5f7]">
                      Essential Local Storage
                    </div>
                    <div className="text-[10px] text-[#4b5563] dark:text-[#9ca3af] truncate font-medium">
                      Raid timers, server rates, theme toggle
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-wider shrink-0">
                  Always Active
                </span>
              </div>

              {/* Google Analytics Card */}
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#161617] border border-gray-200 dark:border-[#2c2c2e] flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <BarChart3 className="w-4 h-4 text-[#b64400] shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#111827] dark:text-[#f5f5f7]">
                      Google Analytics (GA4)
                    </div>
                    <div className="text-[10px] text-[#4b5563] dark:text-[#9ca3af] truncate font-medium">
                      Anonymous usage & calculator telemetry
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 dark:bg-[#3a3a3c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0071e3]"></div>
                </label>
              </div>
            </motion.div>
          )}

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-medium text-[#707070] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] flex items-center gap-1 cursor-pointer order-last sm:order-first transition-colors py-1"
            >
              <span>{showDetails ? 'Hide Options' : 'Customize'}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="apple-pill-outline text-xs px-3.5 py-1.5 w-full sm:w-auto cursor-pointer"
              >
                Essential Only
              </button>

              {showDetails ? (
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="apple-pill-blue text-xs px-4 py-1.5 w-full sm:w-auto cursor-pointer"
                >
                  Save Choices
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="apple-pill-blue text-xs px-4 py-1.5 w-full sm:w-auto cursor-pointer"
                >
                  Accept All
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
