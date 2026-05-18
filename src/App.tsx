/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  PenTool, 
  Mail, 
  FileText, 
  ChevronRight, 
  Timer, 
  Award,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User as UserIcon,
  XCircle,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { AuthPage } from './components/AuthPage';
import { TaskPart, AIResult, HistoryEntry } from './types';
import { 
  auth, 
  saveHistory, 
  fetchHistory, 
  logout as firebaseLogout, 
  onAuthStateChanged,
  deleteHistoryEntry,
  clearUserHistory
} from './lib/firebase';
import { 
  PART1_QUESTIONS, 
  PART2_QUESTIONS, 
  PART3_QUESTIONS,
  REAL_TEST_PART1,
  REAL_TEST_PART2,
  REAL_TEST_PART3
} from './constants';
import { getFeedback } from './lib/gemini';
import { Logo } from './components/Logo';
import { cn } from './lib/utils';
import Markdown from 'react-markdown';

interface UserProfile {
  displayName: string;
  englishLevel: string;
  uid: string;
  email?: string;
}

function LoadingOverlay({ message = "Loading Page" }: { message?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 text-center"
    >
      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-white/10 relative overflow-hidden group">
        <Logo className="w-16 h-16 z-10" />
        <div className="absolute inset-0 bg-indigo-600/10 animate-pulse"></div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-black text-white uppercase tracking-widest">{message}</h2>
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em]">English Care Team</p>
      </div>
      <div className="mt-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
        ))}
      </div>
    </motion.div>
  );
}

function ConfirmationModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Abandon Session?", 
  message = "You are about to exit the current examination module. Your progress for this part will be discarded." 
}: { 
  isOpen: boolean, 
  onConfirm: () => void, 
  onCancel: () => void,
  title?: string,
  message?: string
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100"
      >
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">{title}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
          {message}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onCancel}
            className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            No
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-100"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPart, setCurrentPart] = useState<TaskPart | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isRealTest, setIsRealTest] = useState(false);
  const [isShowingSummary, setIsShowingSummary] = useState(false);
  const [modalMode, setModalMode] = useState<'abandon' | 'dashboard' | 'logout' | 'retry' | 'clearHistory'>('abandon');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [fullTestResults, setFullTestResults] = useState<(AIResult | null)[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    const handleBlur = () => {
      if (isRealTest && isStarted) setIsWindowFocused(false);
    };
    const handleFocus = () => setIsWindowFocused(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRealTest || !isStarted) return;
      
      // Attempt to catch PrintScreen (some systems report it as 'PrintScreen' or 'F13')
      if (e.key === 'PrintScreen') {
        setIsWindowFocused(false);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keyup', handleKeyDown);
    
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, [isRealTest, isStarted]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const levelPref = localStorage.getItem('toeic_level_pref') || 'Intermediate';
        setUserProfile({
          uid: user.uid,
          displayName: user.displayName || 'Learner',
          email: user.email || undefined,
          englishLevel: levelPref
        });
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userProfile?.uid && !showHistory) {
      const loadHistory = async () => {
        const data = await fetchHistory(userProfile.uid);
        if (data) setHistory(data as HistoryEntry[]);
      };
      loadHistory();
    }
  }, [userProfile?.uid, showHistory]);

  const handleLocalLogin = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleLogout = async () => {
    await firebaseLogout();
    setUserProfile(null);
    setCurrentPart(null);
    setIsStarted(false);
    setHistory([]);
  };

  const addHistoryEntry = async (entry: Omit<HistoryEntry, 'id' | 'date'>) => {
    if (!userProfile?.uid) return;

    await saveHistory(userProfile.uid, entry);
    // Refresh history
    const data = await fetchHistory(userProfile.uid);
    if (data) setHistory(data as HistoryEntry[]);
  };

  const handleDeleteHistoryEntry = async (id: string) => {
    if (!userProfile?.uid) return;
    await deleteHistoryEntry(id);
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const handleClearHistory = async () => {
    if (!userProfile?.uid) return;
    await clearUserHistory(userProfile.uid);
    setHistory([]);
  };

  const renderContent = () => {
    if (showHistory) {
      return (
        <HistoryView 
          history={history} 
          onClose={() => setShowHistory(false)} 
          onViewEntry={(entry) => setSelectedHistoryEntry(entry)}
          onDeleteEntry={handleDeleteHistoryEntry}
          onDeleteAll={() => {
            setModalMode('clearHistory');
            setShowExitConfirm(true);
          }}
        />
      );
    }

    if (!currentPart) {
      return (
        <LandingPage 
          onSelectPart={(part) => {
            setIsRealTest(false);
            setIsShowingSummary(false);
            setCurrentPart(part);
          }} 
          onStartRealTest={() => {
            setIsRealTest(true);
            setIsShowingSummary(false);
            setCurrentPart(TaskPart.PART1);
            setIsStarted(false); // Go to start screen first
          }}
        />
      );
    }

    if (!isStarted) {
      return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <StartScreen 
            part={currentPart} 
            onBack={() => {
              if (isRealTest) {
                setModalMode('abandon');
                setShowExitConfirm(true);
              } else {
                setCurrentPart(null);
              }
            }} 
            onStart={() => setIsStarted(true)} 
          />
        </div>
      );
    }

    switch (currentPart) {
      case TaskPart.PART1:
        return (
          <Part1Exercise 
            key={`p1-${resetKey}`}
            isRealTest={isRealTest}
            onFinish={(res) => handleFinish(res)} 
            onShowSummary={() => setIsShowingSummary(true)}
            setShowExitConfirm={setShowExitConfirm} 
            setModalMode={setModalMode}
          />
        );
      case TaskPart.PART2:
        return (
          <Part2Exercise 
            key={`p2-${resetKey}`}
            isRealTest={isRealTest}
            onFinish={(res) => handleFinish(res)} 
            onShowSummary={() => setIsShowingSummary(true)}
            setShowExitConfirm={setShowExitConfirm} 
            setModalMode={setModalMode}
          />
        );
      case TaskPart.PART3:
        return (
          <Part3Exercise 
            key={`p3-${resetKey}`}
            isRealTest={isRealTest}
            onFinish={(res) => handleFinish(res)} 
            onShowSummary={() => setIsShowingSummary(true)}
            setShowExitConfirm={setShowExitConfirm} 
            setModalMode={setModalMode}
          />
        );
      default:
        return null;
    }
  };

  const handleFinish = async (results?: (AIResult | null)[], isAbandon = false) => {
    setIsShowingSummary(false);
    if (isRealTest) {
      if (isAbandon) {
        setIsRealTest(false);
        setIsStarted(false);
        setCurrentPart(null);
        setFullTestResults([]);
      } else if (currentPart === TaskPart.PART1) {
        if (results) setFullTestResults(results);
        setCurrentPart(TaskPart.PART2);
        setIsStarted(false);
      } else if (currentPart === TaskPart.PART2) {
        if (results) setFullTestResults(prev => [...prev, ...results]);
        setCurrentPart(TaskPart.PART3);
        setIsStarted(false);
      } else {
        // Finishing Part 3
        const finalResults = results ? [...fullTestResults, ...results] : fullTestResults;
        await addHistoryEntry({
          type: 'Full Test',
          part: 'ALL',
          results: finalResults
        });
        setIsRealTest(false);
        setIsStarted(false);
        setCurrentPart(null);
        setFullTestResults([]);
      }
    } else {
      if (!isAbandon && results && currentPart) {
        await addHistoryEntry({
          type: 'Module',
          part: currentPart,
          results
        });
      }
      setIsStarted(false);
      setCurrentPart(null);
    }
    setShowExitConfirm(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/40 relative">
            <div className="absolute inset-0 bg-indigo-600/10 rounded-2xl animate-ping origin-center"></div>
            <Logo className="w-10 h-10 relative z-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-white uppercase tracking-widest leading-none">Loading Page</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">English Care Team</p>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!userProfile) {
    return <AuthPage onLogin={handleLocalLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <AnimatePresence>
        {!isWindowFocused && isRealTest && isStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">SCREEN SHIELD ACTIVE</h2>
            <p className="text-slate-400 font-bold max-w-md text-sm">Content is hidden to prevent unauthorized screen captures. Please return focus to this window to continue your Full Real Test.</p>
            <div className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Monitoring Active Session</span>
            </div>
            <button 
              onClick={() => setIsWindowFocused(true)}
              className="mt-8 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Resume Test
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="min-h-20 bg-slate-900 text-white border-b border-slate-700 sticky top-0 z-50 flex items-center shrink-0 py-2 sm:py-4">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => {
                if (isStarted || isRealTest) {
                  setModalMode('abandon');
                  setShowExitConfirm(true);
                } else if (currentPart) {
                  setModalMode('dashboard');
                  setShowExitConfirm(true);
                } else {
                  handleFinish(undefined, false);
                }
              }}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden shadow-lg shadow-black/20">
                <Logo className="w-full h-full p-1" />
              </div>
              <div className="hidden xs:flex flex-col items-start leading-[1.1]">
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-white truncate">ENGLISH CARE</span>
                <span className="text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">EDUCATE FOR EVERYONE</span>
              </div>
            </button>
          </div>
          
          {isRealTest && !isShowingSummary && (
            <div className="hidden lg:flex items-center gap-4 xl:gap-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className={cn("transition-colors", currentPart === TaskPart.PART1 && "text-indigo-400")}>01. PICTURE</span>
              <span className={cn("transition-colors", currentPart === TaskPart.PART2 && "text-indigo-400")}>02. REQUEST</span>
              <span className={cn("transition-colors", currentPart === TaskPart.PART3 && "text-indigo-400")}>03. ESSAY</span>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 sm:gap-4 hover:bg-slate-800 p-1 sm:p-2 rounded-xl transition-all"
              >
                <div className="hidden sm:flex flex-col items-end max-w-[120px]">
                  <span className="text-[10px] font-black text-white leading-none mb-1 truncate w-full text-right">{userProfile?.displayName || 'User'}</span>
                  <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest leading-none truncate w-full text-right">{userProfile?.englishLevel || 'Intermediate'}</span>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/20 shrink-0">
                  {(userProfile?.displayName || 'U').charAt(0).toUpperCase()}
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-[60]" 
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-[70] border border-slate-100 origin-top-right shadow-indigo-500/10"
                    >
                      <div className="p-5 bg-slate-50 border-b border-slate-100">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Profile</div>
                        <div className="text-sm font-bold text-slate-900 truncate">{userProfile?.displayName}</div>
                        <div className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{userProfile?.englishLevel} Level Student</div>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowHistory(true);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          Report History
                        </button>
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            setModalMode('logout');
                            setShowExitConfirm(true);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          Sign Out Account
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-12 w-full overflow-x-hidden">
        {selectedHistoryEntry && (
          <div className="fixed inset-0 z-[100] flex justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-20 pb-20">
            <div className="max-w-4xl w-full h-fit">
              <Summary 
                results={selectedHistoryEntry.results}
                onBack={() => setSelectedHistoryEntry(null)}
                ctaLabel="Return to History"
                isRealTest={selectedHistoryEntry.type === 'Full Test'}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPart === null ? 'landing' : isStarted ? `exercise-${currentPart}` : `start-${currentPart}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <ConfirmationModal 
        isOpen={showExitConfirm}
        onConfirm={() => {
          if (modalMode === 'logout') {
            handleLogout();
          } else if (modalMode === 'retry') {
            setResetKey(prev => prev + 1);
            setIsShowingSummary(false);
          } else if (modalMode === 'clearHistory') {
            handleClearHistory();
          } else {
            handleFinish(undefined, modalMode === 'abandon');
          }
          setShowExitConfirm(false);
        }}
        onCancel={() => setShowExitConfirm(false)}
        title={
          modalMode === 'logout' ? "Sign Out?" :
          modalMode === 'retry' ? "Retry Task?" :
          modalMode === 'clearHistory' ? "Clear All History?" :
          modalMode === 'abandon' ? (isRealTest ? "Abandon Real Test?" : "Abandon Session?") : 
          "Return to Dashboard?"
        }
        message={
          modalMode === 'logout' ? "Are you sure you want to sign out of your account?" :
          modalMode === 'retry' ? "Do you want to retry this module? Your current scores and feedback for this session will be reset." :
          modalMode === 'clearHistory' ? "Are you sure you want to delete your entire performance archive? This action cannot be undone." :
          modalMode === 'abandon' 
            ? (isRealTest 
                ? "A Full Real Test is currently active. If you exit now, all progress will be lost and your test result will not be saved. Do you want to abandon the test?" 
                : "You are about to exit the current examination module. Your progress for this part will be discarded.")
            : "Do you want to go back to dashboard?"
        }
      />
    </div>
  );
}

function HistoryView({ 
  history, 
  onClose, 
  onViewEntry, 
  onDeleteEntry, 
  onDeleteAll 
}: { 
  history: HistoryEntry[], 
  onClose: () => void, 
  onViewEntry: (entry: HistoryEntry) => void,
  onDeleteEntry: (id: string) => void,
  onDeleteAll: () => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-[10px] uppercase tracking-widest font-black text-indigo-600">Performance Archive</div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">Your History</h2>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl shadow-slate-200"
          >
            Close History
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">No history found</h3>
          <p className="text-slate-500 text-sm font-bold max-w-xs mx-auto">Complete your first module or real test to see your performance history here.</p>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid gap-4">
            {history.map((entry) => (
              <motion.div 
                key={entry.id}
                whileHover={{ x: 4 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-indigo-200 transition-all cursor-pointer group relative"
                onClick={() => onViewEntry(entry)}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                    entry.type === 'Full Test' ? "bg-indigo-600 text-white shadow-indigo-100" : "bg-white text-indigo-600 border border-slate-100"
                  )}>
                    {entry.type === 'Full Test' ? <Award className="w-6 h-6" /> : (
                      entry.part === TaskPart.PART1 ? <PenTool className="w-6 h-6" /> :
                      entry.part === TaskPart.PART2 ? <Mail className="w-6 h-6" /> :
                      <FileText className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                        entry.type === 'Full Test' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {entry.type}
                      </span>
                      {entry.part !== 'ALL' && (
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{entry.part}</span>
                      )}
                    </div>
                    <h4 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                      {entry.type === 'Full Test' ? 'Full Assessment Session' : (
                        entry.part === TaskPart.PART1 ? 'Visual Description' :
                        entry.part === TaskPart.PART2 ? 'Email Response' :
                        'Expressive Essay'
                      )}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                      {new Date(entry.date).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                      {Math.round(entry.results.reduce((acc, r) => acc + (r?.score || 0), 0) / entry.results.length)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEntry(entry.id);
                  }}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-8 border-t border-slate-200">
            <button 
              onClick={onDeleteAll}
              className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
            >
              <Trash2 className="w-4 h-4" />
              Delete All History
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function LandingPage({ onSelectPart, onStartRealTest }: { onSelectPart: (part: TaskPart) => void, onStartRealTest: () => void }) {
  return (
    <div className="space-y-12 sm:space-y-20">
      <header className="max-w-4xl">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8 mb-10">
          <motion.div 
            className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Logo className="w-14 h-14" />
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.85] text-slate-900 uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              TOEIC Writing <br className="hidden sm:block" />
              <span className="text-indigo-600">Simulations.</span>
            </motion.h1>
            
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              <div className="h-0.5 w-12 bg-indigo-600"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Made by English Care Team</p>
            </div>

            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl px-4 md:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Adaptive evaluation algorithms identify structural weaknesses in your written responses. 
              Select a module below to begin your targeted assessment session.
            </motion.p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaskCard 
          title="01"
          subtitle="Picture Description"
          description="Write one sentence describing the photo using target lexical items."
          icon={<BookOpen className="w-5 h-5" />}
          badge="5 Questions"
          badgeColor="emerald"
          time="08 Minutes"
          onClick={() => onSelectPart(TaskPart.PART1)}
          delay={0.3}
          scoring={["Grammatical Accuracy", "Relevance to Photo", "Target Word Usage"]}
        />
        <TaskCard 
          title="02"
          subtitle="Written Request"
          description="Respond to formal business inquiries with appropriate tone or suggestions."
          icon={<Mail className="w-5 h-5" />}
          badge="2 Emails"
          badgeColor="blue"
          time="10 Min / Task"
          onClick={() => onSelectPart(TaskPart.PART2)}
          delay={0.4}
          scoring={["Vocabulary Range", "Sentence Variety", "Organization & Tone"]}
        />
        <TaskCard 
          title="03"
          subtitle="Opinion Essay"
          description="Synthesize logic and evidence into a 300+ word structured argument."
          icon={<FileText className="w-5 h-5" />}
          badge="1 Essay"
          badgeColor="amber"
          time="30 Minutes"
          onClick={() => onSelectPart(TaskPart.PART3)}
          delay={0.5}
          scoring={["Clarity of Argument", "Supporting Examples", "Syntactic Structure"]}
        />
      </div>

      <footer className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left pb-12">
        <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-12">
          <div className="flex flex-col">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Max Score</p>
            <p className="text-base sm:text-xl font-bold text-slate-800 font-mono">200 pts</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Assessment Level</p>
            <p className="text-base sm:text-xl font-bold text-slate-800">Advanced Academic</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button 
             onClick={onStartRealTest}
             className="flex-1 md:flex-none px-8 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:bg-right transition-all duration-500 hover:-translate-y-1 active:translate-y-0 group">
             <span className="flex items-center justify-center gap-3">
               Start Full Real Test
               <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </span>
           </button>
        </div>
      </footer>
    </div>
  );
}

function TaskCard({ title, subtitle, description, icon, badge, badgeColor, time, onClick, delay, scoring }: any) {
  const themes: any = {
    emerald: {
      light: "bg-emerald-50",
      accent: "bg-emerald-100 text-emerald-700",
      border: "border-emerald-100",
      hoverBorder: "hover:border-emerald-400",
      iconBg: "bg-emerald-600",
      shadow: "hover:shadow-emerald-100",
      marker: "bg-emerald-500"
    },
    blue: {
      light: "bg-blue-50",
      accent: "bg-blue-100 text-blue-700",
      border: "border-blue-100",
      hoverBorder: "hover:border-blue-400",
      iconBg: "bg-blue-600",
      shadow: "hover:shadow-blue-100",
      marker: "bg-blue-500"
    },
    amber: {
      light: "bg-amber-50",
      accent: "bg-amber-100 text-amber-700",
      border: "border-amber-100",
      hoverBorder: "hover:border-amber-400",
      iconBg: "bg-amber-600",
      shadow: "hover:shadow-amber-100",
      marker: "bg-amber-500"
    }
  };

  const theme = themes[badgeColor] || themes.blue;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={cn(
        "group relative flex flex-col bg-white border-2 rounded-3xl text-left overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
        theme.border,
        theme.hoverBorder,
        theme.shadow
      )}
    >
      <div className={cn("p-4 sm:p-5 border-b flex justify-between items-center transition-colors duration-500", theme.light, theme.border)}>
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/10", theme.iconBg)}>
            {icon}
          </div>
          <h2 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">{title}. {subtitle}</h2>
        </div>
        <span className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tight", theme.accent)}>{badge}</span>
      </div>
      
      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
            "{description}"
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1 text-center">Time limit</p>
              <p className="text-sm font-black text-slate-700 font-mono text-center">{time}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1 text-center">Weight</p>
              <p className="text-sm font-black text-slate-700 text-center">33.3%</p>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Competency Focus</h3>
          <ul className="grid grid-cols-1 gap-3 text-[10px] text-slate-600 font-bold">
            {scoring.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <span className={cn("w-1.5 h-1.5 rounded-full ring-4 ring-slate-50", theme.marker)}></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={cn(
        "p-5 bg-slate-50 border-t flex items-center justify-between font-black text-[10px] uppercase tracking-widest transition-all duration-500",
        "group-hover:translate-y-0 text-slate-600 group-hover:bg-slate-900 group-hover:text-white",
        theme.border
      )}>
        <span>Begin Module Session</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
}

function StartScreen({ part, onBack, onStart }: { part: TaskPart, onBack: () => void, onStart: () => void }) {
  const getInfo = () => {
    switch (part) {
      case TaskPart.PART1:
        return {
          id: "01",
          title: "Sentence Writing",
          points: [
            "5 photos total",
            "8 minutes for all questions",
            "Target Lexical Item usage",
            "Focus: Grammatical Accuracy"
          ]
        };
      case TaskPart.PART2:
        return {
          id: "02",
          title: "Respond to Requests",
          points: [
            "2 emails total",
            "10 minutes per email",
            "Functional language usage",
            "Focus: Professional Tone"
          ]
        };
      case TaskPart.PART3:
        return {
          id: "03",
          title: "Opinion Essay",
          points: [
            "1 opinion topic",
            "30 minutes total",
            "300+ words target volume",
            "Focus: Logical Flow"
          ]
        };
    }
  };

  const info = getInfo();

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[50vh] py-4 sm:py-8">
      <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
        <button 
          onClick={onBack} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all mx-auto lg:mx-0 border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-3 h-3" />
          Go back
        </button>

        <div className="space-y-4">
          <div className="text-[10px] sm:text-xs font-mono font-black text-indigo-500 uppercase tracking-widest">Module {info.id}</div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none text-slate-900">{info.title}</h2>
          <p className="text-sm sm:text-lg text-slate-500 font-medium">Standardized Examination Preparation</p>
        </div>

        <button 
          onClick={onStart}
          className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-4"
        >
          <Timer className="w-5 h-5" />
          Start Session
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 sm:p-10 text-white space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Task Constraints</h3>
          <div className="space-y-4">
            {info.points.map((point, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                <span className="text-sm font-bold tracking-tight text-slate-300">{point}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-700 flex justify-between items-center relative z-10">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase">Weight</p>
            <p className="text-sm font-bold font-mono">33.3% TOTAL</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-500 uppercase">Assessment</p>
            <p className="text-sm font-bold">Standardized</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExerciseBackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-8"
    >
      <button 
        onClick={onClick}
        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Dashboard
      </button>
    </motion.div>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function Part1Exercise({ onFinish, onShowSummary, setShowExitConfirm, setModalMode, isRealTest }: { onFinish: (results?: (AIResult | null)[]) => void, onShowSummary: () => void, setShowExitConfirm: (val: boolean) => void, setModalMode: (val: 'abandon' | 'dashboard' | 'retry') => void, isRealTest?: boolean }) {
  // Select 5 random questions from the pool for variety across sessions
  const [questions] = useState(() => {
    const pool = isRealTest ? REAL_TEST_PART1 : PART1_QUESTIONS;
    return shuffleArray(pool).slice(0, 5);
  });
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState<(AIResult | null)[]>(new Array(questions.length).fill(null));
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes total
  const [copyAttempted, setCopyAttempted] = useState(false);
  const [pasteAttempted, setPasteAttempted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !isEvaluating && !showSummary) {
      evaluateAll();
    }
  }, [timeLeft]);

  const currentQuestion = questions[index];

  const handleNext = async () => {
    // Start evaluation in background for the current question
    evaluateQuestion(index);
    
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      await evaluateAll();
    }
  };

  const evaluateQuestion = async (idx: number) => {
    if (results[idx] || !answers[idx].trim()) return;
    
    try {
      const q = questions[idx];
      const result = await getFeedback("PART1", `Keywords: ${q.keywords.join(", ")}`, answers[idx], q.imageUrl);
      setResults(prev => {
        const next = [...prev];
        next[idx] = result;
        return next;
      });
    } catch (error) {
      console.error(`Evaluation for Q${idx + 1} failed:`, error);
    }
  };

  const evaluateAll = async () => {
    setIsEvaluating(true);
    try {
      // Create promises for questions that haven't been evaluated yet
      const missingIndexes = answers.map((_, i) => i).filter(i => !results[i]);
      
      const newResults = await Promise.all(
        missingIndexes.map(i => {
          const q = questions[i];
          return getFeedback("PART1", `Keywords: ${q.keywords.join(", ")}`, answers[i], q.imageUrl);
        })
      );

      setResults(prev => {
        const next = [...prev];
        missingIndexes.forEach((idx, i) => {
          next[idx] = newResults[i];
        });
        return next;
      });
      
      onShowSummary();
      setShowSummary(true);
    } catch (error) {
      console.error("Final evaluation failed:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (showSummary) {
    return <Summary 
      results={results} 
      isRealTest={isRealTest}
      onRetry={() => {
        setModalMode('retry');
        setShowExitConfirm(true);
      }}
      onBack={() => {
        onFinish(results);
      }} 
      ctaLabel={isRealTest ? "CONTINUE TO NEXT PART" : "Acknowledge & Close Report"}
    />;
  }

  const handleFinishAction = (e: React.ClipboardEvent | React.MouseEvent) => {
    if (isRealTest) {
      e.preventDefault();
      if (e.type === 'paste') {
        setPasteAttempted(true);
        setTimeout(() => setPasteAttempted(false), 3000);
      } else {
        setCopyAttempted(true);
        setTimeout(() => setCopyAttempted(false), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {isEvaluating && <LoadingOverlay />}
      <div className="flex items-center justify-between">
        <ExerciseBackButton onClick={() => { setModalMode('abandon'); setShowExitConfirm(true); }} />
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {(copyAttempted || pasteAttempted) && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-lg flex items-center gap-2"
              >
                <XCircle className="w-3 h-3" />
                {pasteAttempted ? "you can't paste text here" : "you can't copy this text"}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-slate-900 px-6 py-3 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-3">
            <Timer className={cn("w-4 h-4", timeLeft < 60 ? "text-red-500 animate-pulse" : "text-indigo-400")} />
            <span className={cn("text-xl font-black font-mono tracking-tighter", timeLeft < 60 ? "text-red-500" : "text-white")}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Question {index + 1} Visual</h2>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active Stimulus</span>
          </div>
          <div className="p-4">
            <div className="aspect-video bg-slate-200 rounded overflow-hidden border border-slate-200 flex items-center justify-center">
               <img 
                 src={currentQuestion.imageUrl} 
                 alt="TOEIC Image" 
                 className="w-full h-full object-contain" 
                 referrerPolicy="no-referrer"
                 onError={(e) => {
                   const img = e.currentTarget;
                   img.src = `https://placehold.co/800x450/e2e8f0/64748b?text=Image+Unavailable`;
                   img.onerror = null; // Prevent infinite loop
                 }}
               />
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2">
            {currentQuestion.keywords.map(kw => (
              <span key={kw} className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Response Console • Q{(index + 1).toString().padStart(2, '0')}/{questions.length.toString().padStart(2, '0')}</div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800 leading-none">Describe Image</h2>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">System requires exact keyword inclusion within a single syntactically correct sentence.</p>
        </div>

        <textarea 
          value={answers[index]}
          onChange={(e) => {
            const next = [...answers];
            next[index] = e.target.value;
            setAnswers(next);
          }}
          onPaste={handleFinishAction}
          onCopy={handleFinishAction}
          className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-bold text-sm tracking-tight placeholder:text-slate-300"
          placeholder="ENTER SENTENCE DATA..."
        />

        <div className="pt-8 border-t border-slate-100 flex justify-center sm:justify-end gap-3">
          <button 
            onClick={handleNext}
            disabled={!answers[index].trim() || isEvaluating}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
          >
            {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : index === questions.length - 1 ? "FINISH TASK" : "NEXT QUESTION"}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

function Part2Exercise({ onFinish, onShowSummary, setShowExitConfirm, setModalMode, isRealTest }: { onFinish: (results?: (AIResult | null)[]) => void, onShowSummary: () => void, setShowExitConfirm: (val: boolean) => void, setModalMode: (val: 'abandon' | 'dashboard' | 'retry') => void, isRealTest?: boolean }) {
  // Select 1 business and 1 personal email from the pool
  const [questions] = useState(() => {
    const pool = isRealTest ? REAL_TEST_PART2 : PART2_QUESTIONS;
    const businessPool = pool.filter(q => q.type === 'business');
    const personalPool = pool.filter(q => q.type === 'personal');
    
    const businessTask = shuffleArray(businessPool)[0];
    const personalTask = shuffleArray(personalPool)[0];
    
    // Default to business first or personal first randomly
    return Math.random() > 0.5 ? [businessTask, personalTask] : [personalTask, businessTask];
  });
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState<(AIResult | null)[]>(new Array(questions.length).fill(null));
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes per task
  const [copyAttempted, setCopyAttempted] = useState(false);
  const [pasteAttempted, setPasteAttempted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [index]); // Reset timer on each task

  useEffect(() => {
    if (timeLeft === 0 && !isEvaluating && !showSummary) {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setTimeLeft(600);
      } else {
        evaluateAll();
      }
    }
  }, [timeLeft]);

  const currentQuestion = questions[index];

  const handleNext = async () => {
    // Start evaluation in background for the current question
    evaluateQuestion(index);
    
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      await evaluateAll();
    }
  };

  const evaluateQuestion = async (idx: number) => {
    if (results[idx] || !answers[idx].trim()) return;
    
    try {
      const q = questions[idx];
      const result = await getFeedback("PART2", `Requirements: ${q.requirements.join(", ")}\nContext: ${q.emailContext}`, answers[idx]);
      setResults(prev => {
        const next = [...prev];
        next[idx] = result;
        return next;
      });
    } catch (error) {
      console.error(`Evaluation for email ${idx + 1} failed:`, error);
    }
  };

  const evaluateAll = async () => {
    setIsEvaluating(true);
    try {
      // Create promises for questions that haven't been evaluated yet
      const missingIndexes = answers.map((_, i) => i).filter(i => !results[i]);
      
      const newResults = await Promise.all(
        missingIndexes.map(i => {
          const q = questions[i];
          return getFeedback("PART2", `Requirements: ${q.requirements.join(", ")}\nContext: ${q.emailContext}`, answers[i]);
        })
      );

      setResults(prev => {
        const next = [...prev];
        missingIndexes.forEach((idx, i) => {
          next[idx] = newResults[i];
        });
        return next;
      });
      
      onShowSummary();
      setShowSummary(true);
    } catch (error) {
      console.error("Final evaluation failed:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (showSummary) {
    return <Summary 
      results={results} 
      isRealTest={isRealTest}
      onRetry={() => {
        setModalMode('retry');
        setShowExitConfirm(true);
      }}
      onBack={() => {
        onFinish(results);
      }} 
      ctaLabel={isRealTest ? "CONTINUE TO NEXT PART" : "Acknowledge & Close Report"}
    />;
  }

  const handleFinishAction = (e: React.ClipboardEvent | React.MouseEvent) => {
    if (isRealTest) {
      e.preventDefault();
      if (e.type === 'paste') {
        setPasteAttempted(true);
        setTimeout(() => setPasteAttempted(false), 3000);
      } else {
        setCopyAttempted(true);
        setTimeout(() => setCopyAttempted(false), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {isEvaluating && <LoadingOverlay />}
      <div className="flex items-center justify-between">
        <ExerciseBackButton onClick={() => { setModalMode('abandon'); setShowExitConfirm(true); }} />
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {(copyAttempted || pasteAttempted) && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-lg flex items-center gap-2"
              >
                <XCircle className="w-3 h-3" />
                {pasteAttempted ? "you can't paste text here" : "you can't copy this text"}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-slate-900 px-6 py-3 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-3">
            <Timer className={cn("w-4 h-4", timeLeft < 60 ? "text-red-500 animate-pulse" : "text-indigo-400")} />
            <span className={cn("text-xl font-black font-mono tracking-tighter", timeLeft < 60 ? "text-red-500" : "text-white")}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Incoming Transmission</h2>
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
              currentQuestion.type === 'business' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
            )}>
              {currentQuestion.type} Task
            </span>
          </div>
          <div className="p-4 sm:p-6">
            <div 
              onCopy={handleFinishAction}
              onContextMenu={handleFinishAction}
              className={cn(
                "bg-blue-50/50 border border-blue-100 p-4 sm:p-6 rounded whitespace-pre-wrap font-bold text-slate-700 italic leading-relaxed text-xs h-64 overflow-y-auto pr-4 custom-scrollbar",
                isRealTest && "select-none"
              )}
            >
              {currentQuestion.emailContext}
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Response constraints</p>
            {currentQuestion.requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                {req}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Response Console • E{(index + 1).toString().padStart(2, '0')}/{questions.length.toString().padStart(2, '0')}</div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800 leading-none">Draft Response</h2>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">
            {currentQuestion.type === 'business' 
              ? "Synthesize a professional response maintaining business formal tone and addressing all constraints."
              : "Craft an informal yet detailed personal response that addresses all the specific points mentioned."
            }
          </p>
        </div>

        <textarea 
          value={answers[index]}
          onChange={(e) => {
            const next = [...answers];
            next[index] = e.target.value;
            setAnswers(next);
          }}
          onCopy={handleFinishAction}
          onPaste={handleFinishAction}
          className="w-full h-64 sm:h-80 p-5 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-bold text-sm tracking-tight placeholder:text-slate-300 custom-scrollbar"
          placeholder="DEAR CONTACT, ..."
        />

        <div className="pt-8 border-t border-slate-100 flex justify-center sm:justify-end gap-3">
          <button 
            onClick={handleNext}
            disabled={!answers[index].trim() || isEvaluating}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
          >
            {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : index === questions.length - 1 ? "Finish Task" : "Next Mail"}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

function Part3Exercise({ onFinish, onShowSummary, setShowExitConfirm, setModalMode, isRealTest }: { onFinish: (results?: (AIResult | null)[]) => void, onShowSummary: () => void, setShowExitConfirm: (val: boolean) => void, setModalMode: (val: 'abandon' | 'dashboard' | 'retry') => void, isRealTest?: boolean }) {
  // Select 1 random topic from the pool for variety across sessions
  const [currentQuestion] = useState(() => {
    const pool = isRealTest ? REAL_TEST_PART3 : PART3_QUESTIONS;
    return shuffleArray(pool)[0];
  });
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [copyAttempted, setCopyAttempted] = useState(false);
  const [pasteAttempted, setPasteAttempted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !isEvaluating && !result) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleSubmit = async () => {
    setIsEvaluating(true);
    try {
      const res = await getFeedback("PART3", `Topic: ${currentQuestion.topic}`, answer);
      setResult(res);
      onShowSummary();
    } catch (error) {
      console.error("Evaluation failed:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinishAction = (e: React.ClipboardEvent | React.MouseEvent) => {
    if (isRealTest) {
      e.preventDefault();
      if (e.type === 'paste') {
        setPasteAttempted(true);
        setTimeout(() => setPasteAttempted(false), 3000);
      } else {
        setCopyAttempted(true);
        setTimeout(() => setCopyAttempted(false), 3000);
      }
    }
  };

  if (result) {
    return <Summary 
      results={[result]} 
      isRealTest={isRealTest}
      onRetry={() => {
        setModalMode('retry');
        setShowExitConfirm(true);
      }}
      onBack={() => {
        onFinish([result]);
      }} 
      ctaLabel={isRealTest ? "FINISH THE TEST" : "Acknowledge & Close Report"}
    />;
  }

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {isEvaluating && <LoadingOverlay />}
      <div className="flex items-center justify-between">
        <ExerciseBackButton onClick={() => { setModalMode('abandon'); setShowExitConfirm(true); }} />
        <AnimatePresence>
          {(copyAttempted || pasteAttempted) && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-lg flex items-center gap-2"
            >
              <XCircle className="w-3 h-3" />
              {pasteAttempted ? "you can't paste text here" : "you can't copy this text"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <header className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Section 03 • Core Assessment</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 leading-none">Opinion Essay</h2>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Volume</p>
              <p className={cn("text-base sm:text-lg font-black font-mono leading-none", wordCount < 300 ? "text-orange-500" : "text-emerald-500")}>
                {wordCount} <span className="text-[10px] uppercase font-bold">Words</span>
              </p>
            </div>
            <div className="w-[1px] h-8 bg-slate-200"></div>
            <div className={cn(
              "px-3 sm:px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors",
              timeLeft < 300 ? "bg-red-600 text-white animate-pulse" : "bg-slate-900 text-white"
            )}>
              {formatTime(timeLeft)} Remaining
            </div>
          </div>
        </div>

        <div className={cn(
          "bg-white border-l-4 border-amber-400 p-6 sm:p-8 border border-slate-200 rounded shadow-sm",
          isRealTest && "select-none"
        )}
        onCopy={handleFinishAction}
        onContextMenu={handleFinishAction}
        >
          <p className="text-[10px] text-amber-600 font-black uppercase mb-2 tracking-widest">Essay Prompt Context</p>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-relaxed text-slate-800">{currentQuestion.topic}</h3>
        </div>
      </header>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-100 p-3 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
            <PenTool className="w-3 h-3 text-indigo-500" />
            Response Input Buffer
          </div>
          <textarea 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onCopy={handleFinishAction}
            onPaste={handleFinishAction}
            className="w-full h-96 sm:h-[500px] p-6 sm:p-8 bg-white border-none focus:ring-0 transition-all resize-none font-bold text-sm sm:text-base leading-relaxed custom-scrollbar text-slate-700 placeholder:text-slate-200"
            placeholder="ENTER ARGUMENT TEXT DATA..."
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-white border border-slate-200 rounded-lg shadow-sm gap-6">
          <div className={cn(
            "flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-center sm:text-left",
            wordCount < 300 ? "text-orange-500" : "text-emerald-500"
          )}>
            {wordCount < 300 ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {wordCount < 300 ? `Incomplete: ${300 - wordCount} words below threshold` : "Recommended volume satisfied"}
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={!answer.trim() || isEvaluating}
            className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all disabled:opacity-20 flex items-center justify-center gap-4"
          >
            {isEvaluating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Final Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ res, index, sessionPrefix }: { res: AIResult | null, index: number, sessionPrefix?: number }) {
  if (!res) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
    >
      <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Analysis • {sessionPrefix ? `S${sessionPrefix} ` : ''}Task {index + 1}
        </h3>
        <div className="px-4 py-1.5 bg-indigo-600 rounded text-white font-black text-xs font-mono w-full sm:w-auto text-center">
          SCORE: {res.score}/5.0
        </div>
      </div>

      <div className="p-6 sm:p-10 space-y-8 sm:space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
              Structure Analysis
            </div>
            <div className="text-xs font-bold leading-relaxed text-slate-600 bg-slate-50 p-5 border-l-4 border-indigo-500 rounded-r">
              {res.grammarFeedback}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
              <Award className="w-4 h-4" />
              Lexical Efficiency
            </div>
            <div className="text-xs font-bold leading-relaxed text-slate-600 bg-slate-50 p-5 border-l-4 border-indigo-500 rounded-r">
              {res.vocabularyFeedback}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
            <BookOpen className="w-4 h-4" />
            Strategic Feedback
          </div>
          <div className="prose prose-slate prose-xs max-w-none text-slate-700 font-bold leading-relaxed">
            <Markdown>{res.generalFeedback}</Markdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Summary({ results, onBack, onRetry, ctaLabel, isRealTest }: { results: (AIResult | null)[], onBack: () => void, onRetry?: () => void, ctaLabel?: string, isRealTest?: boolean }) {
  const filteredResults = results.filter(r => r !== null) as AIResult[];
  const averageScore = filteredResults.length > 0 
    ? filteredResults.reduce((acc, curr) => acc + curr.score, 0) / filteredResults.length
    : 0;

  const renderContent = () => {
    if (!isRealTest) {
      return results.map((res, i) => (
        <ResultCard key={i} res={res} index={i} />
      ));
    }

    const part1Results = results.slice(0, 5);
    const part2Results = results.slice(5, 7);
    const part3Results = results.slice(7, 8);

    const sessions = [
      { name: "Session 1 • Visual Description", results: part1Results },
      { name: "Session 2 • Email Response", results: part2Results },
      { name: "Session 3 • Opinion Essay", results: part3Results }
    ];

    return (
      <div className="space-y-12 sm:space-y-16">
        {sessions.map((session, sIdx) => {
          const hasResults = session.results.some(r => r !== null);
          if (!hasResults) return null;

          return (
            <div key={sIdx} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="h-px bg-slate-200 flex-1" />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-6 py-2 bg-indigo-50 rounded-full border border-indigo-100 shadow-sm">
                    {session.name}
                  </span>
                </div>
                <div className="h-px bg-slate-200 flex-1" />
              </div>
              <div className="space-y-6">
                {session.results.map((res, i) => (
                  <ResultCard key={i} res={res} index={i} sessionPrefix={sIdx + 1} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 pb-24">
      <div className="bg-slate-900 rounded-lg p-6 sm:p-12 text-white text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-500/30 text-indigo-400 text-2xl sm:text-4xl font-black mb-4 font-mono">
            {averageScore.toFixed(1)}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-none">Assessment Report</h2>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {renderContent()}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {onRetry && !isRealTest && (
          <button 
            onClick={onRetry}
            className="flex-1 py-5 bg-indigo-600 text-white rounded font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-center"
          >
            Retry Task
          </button>
        )}
        <button 
          onClick={onBack}
          className="flex-1 py-5 bg-slate-900 text-white rounded font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all text-center"
        >
          {ctaLabel || "Acknowledge & Close Report"}
        </button>
      </div>
    </div>
  );
}
