import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Check, X, MessageCircle, Link2 } from 'lucide-react';

interface ShareResult {
  wpm: number;
  accuracy: number;
  time: number;
  difficulty: string;
  isNewRecord?: boolean;
}

interface SocialShareProps {
  result: ShareResult;
  isOpen: boolean;
  onClose: () => void;
}

export function SocialShare({ result, isOpen, onClose }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  
  const shareText = `🎯 Just scored ${result.wpm} WPM with ${result.accuracy}% accuracy on TypeSpeed! ${result.isNewRecord ? '🏆 New personal best!' : ''}\n\nCan you beat my score? Try it now:`;
  const shareUrl = window.location.origin;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TypeSpeed Result',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 mb-3">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Share Your Result</h2>
                <p className="text-white/60 text-sm mt-1">Show off your typing skills!</p>
              </div>
              
              {/* Result Preview */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">Speed</span>
                  <span className="text-2xl font-bold text-blue-400">{result.wpm} WPM</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">Accuracy</span>
                  <span className="text-xl font-semibold text-green-400">{result.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Difficulty</span>
                  <span className="text-white/80 capitalize">{result.difficulty}</span>
                </div>
                {result.isNewRecord && (
                  <div className="mt-3 text-center py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <span className="text-yellow-400 font-semibold">🏆 New Personal Best!</span>
                  </div>
                )}
              </div>
              
              {/* Share buttons */}
              <div className="space-y-3">
                {/* Native share (mobile) */}
                {'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:scale-[1.02] transition-transform"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Twitter */}
                  <button
                    onClick={handleTwitterShare}
                    className="flex items-center justify-center gap-2 py-3 bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-xl text-[#1DA1F2] hover:bg-[#1DA1F2]/30 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    Twitter
                  </button>
                  
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center justify-center gap-2 py-3 bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                </div>
                
                {/* Copy link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-5 h-5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
