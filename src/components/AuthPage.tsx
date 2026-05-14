import React, { useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../lib/utils';

export function AuthPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save user to firestore if not exists (NON-BLOCKING)
      const userRef = doc(db, 'users', user.uid);
      
      // We don't await the firestore part to prevent blocking the UI
      // but we still want to handle it if possible
      getDoc(userRef).then(async (userDoc) => {
        if (!userDoc.exists()) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            createdAt: serverTimestamp()
          };
          await setDoc(userRef, userData);
        }
      }).catch(err => {
        console.warn("Non-critical Firestore profile sync error:", err);
      });

    } catch (err: any) {
      console.error("Auth Error:", err);
      let message = "An unexpected error occurred during authentication.";
      
      // Handle Firebase Auth errors specifically
      if (err.code === 'auth/unauthorized-domain') {
        message = "This domain is not authorized in your Firebase project. Please add your Vercel domain to the 'Authorized domains' list in the Firebase Console (Authentication > Settings).";
      } else if (err.code === 'auth/popup-blocked') {
        message = "The sign-in popup was blocked by your browser. Please allow popups for this site and try again.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = "The sign-in popup was closed before completion. Please try again.";
      } else if (err.code === 'auth/internal-error') {
        message = "An internal authentication error occurred. Please refresh and try again.";
      } else if (err.message) {
        message = err.message;
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.error) message = parsed.error;
        } catch (e) {
          // Keep the message as is if not JSON
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&q=60&w=1200&h=800" 
          alt="English Proficiency Assessment Environment"
          className="w-full h-full object-cover opacity-25 grayscale-[0.2]"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/95"></div>
      </div>

      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[1]">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-white/10 relative overflow-hidden group border border-white/10">
            <Logo className="w-16 h-16 z-10" />
            <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-2 uppercase leading-none">
            TOEIC WRITING <br />
            <span className="text-indigo-400">TEST SIMULATION</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            MADE BY ENGLISH COMMITTEE
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              {isSignUp ? "Sign up" : "Sign in"}
            </h2>
            <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-slate-900 py-5 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:bg-slate-100 hover:scale-[1.02] transition-all active:scale-[0.98] shadow-2xl shadow-white/10"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Verifying..." : isSignUp ? "Sign up with Google" : "Sign in with Google"}
            </button>

            <div className="pt-4 text-center space-y-4">
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-300 transition-colors"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
              
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Secure Authentication Required <br />
                <span className="text-slate-600">Resume your session instantly</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <footer className="mt-12 sm:mt-16 relative z-10 w-full px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-slate-100/60 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-center">
          <button className="hover:text-white transition-colors cursor-pointer border-b border-white/0 hover:border-white/20 pb-1">Privacy Protocol</button>
          <div className="hidden sm:block w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-sm shadow-indigo-500"></div>
          <button className="hover:text-white transition-colors cursor-pointer border-b border-white/0 hover:border-white/20 pb-1">Examination Terms</button>
        </div>
      </footer>
    </div>
  );
}
