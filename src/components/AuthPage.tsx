import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronDown, Check, Chrome } from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../lib/utils';
import { signInWithGoogle } from '../lib/firebase';

interface EnglishLevel {
  id: string;
  label: string;
  description: string;
  color: string;
}

const ENGLISH_LEVELS: EnglishLevel[] = [
  { id: 'Basic', label: 'Basic Level', description: 'Elementary communication skills', color: 'bg-emerald-500' },
  { id: 'Intermediate', label: 'Intermediate Level', description: 'Confident daily & work usage', color: 'bg-indigo-500' },
  { id: 'Advanced', label: 'Advanced Level', description: 'Fluent professional proficiency', color: 'bg-rose-500' },
];

export function AuthPage({ onLogin }: { onLogin: (user: { displayName: string, englishLevel: string, uid: string, email?: string }) => void }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [englishLevel, setEnglishLevel] = useState('Intermediate');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedLevel = ENGLISH_LEVELS.find(l => l.id === englishLevel) || ENGLISH_LEVELS[1];

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await signInWithGoogle();
      if (!user) throw new Error("No user found after login");

      const userData = {
        displayName: user.displayName || 'Learner',
        englishLevel: englishLevel,
        uid: user.uid,
        email: user.email || undefined
      };
      
      // Store in localStorage for level preference only
      localStorage.setItem('toeic_level_pref', englishLevel);
      
      onLogin(userData);
    } catch (e: any) {
      console.error("Login Error:", e);
      setError(e.message || "Failed to sign in with Google. Please try again.");
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
            MADE BY ENGLISH CARE TEAM
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              Welcome
            </h2>
            <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Please enter your details to start the assessment
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Examination profile</label>
                <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-6 text-center space-y-4">
                  <p className="text-xs font-bold text-slate-300 leading-relaxed">
                    Test isolation is now strictly enforced. Please sign in with your Google account to access your private simulation archive.
                  </p>
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white text-slate-900 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-slate-900/10 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Chrome className="w-4 h-4" />
                        Sign in with Google
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">English Proficiency</label>
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold flex items-center justify-between hover:bg-white/10 transition-all outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", selectedLevel.color)}></div>
                      <span className="uppercase tracking-widest text-[11px]">{selectedLevel.label}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setIsDropdownOpen(false)}
                        ></div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-30 p-2"
                        >
                          {ENGLISH_LEVELS.map((level) => (
                            <button
                              key={level.id}
                              onClick={() => {
                                setEnglishLevel(level.id);
                                setIsDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group",
                                englishLevel === level.id ? "bg-white/10" : "hover:bg-white/5"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn("w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150", level.color)}></div>
                                <div>
                                  <div className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-1">
                                    {level.label}
                                  </div>
                                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                    {level.description}
                                  </div>
                                </div>
                              </div>
                              {englishLevel === level.id && (
                                <Check className="w-4 h-4 text-indigo-400" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center space-y-4">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Secure Session Management <br />
                <span className="text-slate-600">Isolated Test History</span>
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
