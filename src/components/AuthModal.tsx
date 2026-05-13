import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Lock, Mail, Chrome } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-app-surface border border-app-border rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="relative p-8">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-app-bg transition-colors text-app-muted"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-app-fg">Welcome Back</h2>
                <p className="text-app-muted mt-2">
                  Sign in to track prices, manage your watchlist, and sync history across devices.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={onLogin}
                  className="w-full flex items-center justify-center gap-3 bg-app-bg hover:bg-app-bg/80 text-app-fg border border-app-border py-3 rounded-xl transition-all font-semibold shadow-sm active:scale-[0.98]"
                >
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-app-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-app-surface px-2 text-app-muted">Or continue with email</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input
                      type="email"
                      placeholder="Email address"
                      defaultValue="demo@pricelytic.ai"
                      className="w-full pl-10 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={onLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                  >
                    Send Magic Link
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-center text-app-muted mt-8 leading-relaxed">
                By continuing, you agree to Pricelytic AI's <br />
                <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
