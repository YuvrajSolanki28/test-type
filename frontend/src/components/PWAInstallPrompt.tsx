import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    // Check if already installed
    return window.matchMedia('(display-mode: standalone)').matches;
  });

  useEffect(() => {
    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-white/40 hover:text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Install TypeSpeed</h3>
              <p className="text-white/60 text-sm mb-3">
                Install our app for a better experience with offline support!
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg text-white text-sm font-medium hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white/70 text-sm hover:bg-white/20 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
