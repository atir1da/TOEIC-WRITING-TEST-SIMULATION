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
  XCircle
} from 'lucide-react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { AuthPage } from './components/AuthPage';
import { TaskPart, AIResult } from './types';
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
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em]">English Committee Team</p>
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
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPart, setCurrentPart] = useState<TaskPart | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isRealTest, setIsRealTest] = useState(false);
  const [isShowingSummary, setIsShowingSummary] = useState(false);
  const [modalMode, setModalMode] = useState<'abandon' | 'dashboard' | 'logout'>('abandon');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPart(null);
      setIsStarted(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const renderContent = () => {
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
        <StartScreen 
          part={currentPart} 
          onBack={() => setCurrentPart(null)} 
          onStart={() => setIsStarted(true)} 
        />
      );
    }

    switch (currentPart) {
      case TaskPart.PART1:
        return (
          <Part1Exercise 
            isRealTest={isRealTest}
            onFinish={() => handleFinish()} 
            onShowSummary={() => setIsShowingSummary(true)}
            setShowExitConfirm={setShowExitConfirm} 
            setModalMode={setModalMode}
          />
        );
      case TaskPart.PART2:
        return (
          <Part2Exercise 
            isRealTest={isRealTest}
            onFinish={() => handleFinish()} 
            onShowSummary={() => setIsShowingSummary(true)}
            setShowExitConfirm={setShowExitConfirm} 
            setModalMode={setModalMode}
          />
        );
      case TaskPart.PART3:
        return (
          <Part3Exercise 
            isRealTest={isRealTest}
            onFinish={() => handleFinish()} 
            onShowSummary={() => setIsShowingSummary(true)}
            setShowExitConfirm={setShowExitConfirm} 
            setModalMode={setModalMode}
          />
        );
      default:
        return null;
    }
  };

  const handleFinish = (isAbandon = false) => {
    setIsShowingSummary(false);
    if (isRealTest) {
      if (isAbandon) {
        setIsRealTest(false);
        setIsStarted(false);
        setCurrentPart(null);
      } else if (currentPart === TaskPart.PART1) {
        setCurrentPart(TaskPart.PART2);
        setIsStarted(false);
      } else if (currentPart === TaskPart.PART2) {
        setCurrentPart(TaskPart.PART3);
        setIsStarted(false);
      } else {
        setIsRealTest(false);
        setIsStarted(false);
        setCurrentPart(null);
      }
    } else {
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
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">English Committee Team</p>
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

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <nav className="min-h-20 bg-slate-900 text-white border-b border-slate-700 sticky top-0 z-50 flex items-center shrink-0 py-4">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <button 
              onClick={() => handleFinish()}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden shadow-lg shadow-black/20">
                <Logo className="w-full h-full p-1" />
              </div>
              <div className="flex flex-col items-start leading-[1.1]">
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">ENGLISH COMMITTEE</span>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight">EDUCATION DIVISION</span>
              </div>
            </button>

            <button 
              onClick={() => {
                setModalMode('logout');
                setShowExitConfirm(true);
              }}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          
          {isRealTest && !isShowingSummary && (
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className={cn("transition-colors", currentPart === TaskPart.PART1 && "text-indigo-400")}>01. PICTURE</span>
              <span className={cn("transition-colors", currentPart === TaskPart.PART2 && "text-indigo-400")}>02. REQUEST</span>
              <span className={cn("transition-colors", currentPart === TaskPart.PART3 && "text-indigo-400")}>03. ESSAY</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-white leading-none mb-1">{user.displayName || user.email?.split('@')[0]}</span>
              <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Active Student</span>
            </div>
            <button 
              onClick={() => {
                setModalMode('logout');
                setShowExitConfirm(true);
              }}
              className="p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPart === null ? 'landing' : isStarted ? `exercise-${currentPart}` : `start-${currentPart}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
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
          } else {
            handleFinish(modalMode === 'abandon');
          }
          setShowExitConfirm(false);
        }}
        onCancel={() => setShowExitConfirm(false)}
        title={
          modalMode === 'logout' ? "Sign Out?" :
          modalMode === 'abandon' ? "Abandon Session?" : 
          "Return to Dashboard?"
        }
        message={
          modalMode === 'logout' ? "Are you sure you want to sign out of your account?" :
          modalMode === 'abandon' 
            ? "You are about to exit the current examination module. Your progress for this part will be discarded."
            : "Do you want to go back to dashboard?"
        }
      />
    </div>
  );
}

function LandingPage({ onSelectPart, onStartRealTest }: { onSelectPart: (part: TaskPart) => void, onStartRealTest: () => void }) {
  return (
    <div className="space-y-12">
      <header className="max-w-3xl text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <motion.div 
            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Logo className="w-14 h-14" />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          TOEIC WRITING <br />
          <span className="text-indigo-600 uppercase">TEST SIMULATION.</span>
        </motion.h1>
        <motion.p 
          className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 mx-auto md:mx-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Made by English Committee
        </motion.p>
        <motion.p 
          className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto md:mx-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Adaptive evaluation algorithms identify structural weaknesses in your written responses. 
          Select a module to begin targeted assessment.
        </motion.p>
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={cn(
        "group relative flex flex-col bg-white border-2 rounded-2xl text-left overflow-hidden transition-all duration-500 hover:shadow-2xl",
        theme.border,
        theme.hoverBorder,
        theme.shadow
      )}
    >
      <div className={cn("p-4 border-b flex justify-between items-center transition-colors duration-500", theme.light, theme.border)}>
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg shadow-black/10", theme.iconBg)}>
            {icon}
          </div>
          <h2 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">{title}. {subtitle}</h2>
        </div>
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight", theme.accent)}>{badge}</span>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          <p className="text-sm text-slate-600 font-bold leading-relaxed">
            {description}
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1 text-center">Time limit</p>
              <p className="text-xs font-black text-slate-700 font-mono text-center">{time}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1 text-center">Weight</p>
              <p className="text-xs font-black text-slate-700 text-center">33.3%</p>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Competency Focus</h3>
          <ul className="grid grid-cols-1 gap-2 text-[10px] text-slate-600 font-bold">
            {scoring.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <span className={cn("w-1.5 h-1.5 rounded-full ring-2 ring-white", theme.marker)}></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={cn(
        "p-4 bg-slate-50 border-t flex items-center justify-between font-black text-[10px] uppercase tracking-widest transition-all duration-500",
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

function Part1Exercise({ onFinish, onShowSummary, setShowExitConfirm, setModalMode, isRealTest }: { onFinish: () => void, onShowSummary: () => void, setShowExitConfirm: (val: boolean) => void, setModalMode: (val: 'abandon' | 'dashboard') => void, isRealTest?: boolean }) {
  const questions = isRealTest ? REAL_TEST_PART1 : PART1_QUESTIONS;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState<(AIResult | null)[]>(new Array(questions.length).fill(null));
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes total

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
      onBack={() => {
        if (isRealTest) {
          onFinish();
        } else {
          setModalMode('dashboard');
          setShowExitConfirm(true);
        }
      }} 
      ctaLabel={isRealTest ? "CONTINUE TO NEXT PART" : "Acknowledge & Close Report"}
    />;
  }

  return (
    <div className="space-y-6">
      {isEvaluating && <LoadingOverlay />}
      <div className="flex items-center justify-between">
        <ExerciseBackButton onClick={() => { setModalMode('abandon'); setShowExitConfirm(true); }} />
        <div className="bg-slate-900 px-6 py-3 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-3">
          <Timer className={cn("w-4 h-4", timeLeft < 60 ? "text-red-500 animate-pulse" : "text-indigo-400")} />
          <span className={cn("text-xl font-black font-mono tracking-tighter", timeLeft < 60 ? "text-red-500" : "text-white")}>
            {formatTime(timeLeft)}
          </span>
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
               <img src={currentQuestion.imageUrl} alt="TOEIC Image" className="w-full h-full object-contain" />
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
          <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Response Console • Q{index + 1}/05</div>
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
          className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-bold text-sm tracking-tight placeholder:text-slate-300"
          placeholder="ENTER SENTENCE DATA..."
        />

        <div className="pt-8 border-t border-slate-100 flex justify-center sm:justify-end gap-3">
          <button 
            onClick={handleNext}
            disabled={!answers[index].trim() || isEvaluating}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
          >
            {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : index === PART1_QUESTIONS.length - 1 ? "FINISH TASK" : "NEXT QUESTION"}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

function Part2Exercise({ onFinish, onShowSummary, setShowExitConfirm, setModalMode, isRealTest }: { onFinish: () => void, onShowSummary: () => void, setShowExitConfirm: (val: boolean) => void, setModalMode: (val: 'abandon' | 'dashboard') => void, isRealTest?: boolean }) {
  const questions = isRealTest ? REAL_TEST_PART2 : PART2_QUESTIONS;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState<(AIResult | null)[]>(new Array(questions.length).fill(null));
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes per task
  const [copyAttempted, setCopyAttempted] = useState(false);

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
      onBack={() => {
        if (isRealTest) {
          onFinish();
        } else {
          setModalMode('dashboard');
          setShowExitConfirm(true);
        }
      }} 
      ctaLabel={isRealTest ? "CONTINUE TO NEXT PART" : "Acknowledge & Close Report"}
    />;
  }

  const handleCopyProtection = (e: React.ClipboardEvent | React.MouseEvent) => {
    if (isRealTest) {
      e.preventDefault();
      setCopyAttempted(true);
      setTimeout(() => setCopyAttempted(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {isEvaluating && <LoadingOverlay />}
      <div className="flex items-center justify-between">
        <ExerciseBackButton onClick={() => { setModalMode('abandon'); setShowExitConfirm(true); }} />
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {copyAttempted && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-lg flex items-center gap-2"
              >
                <XCircle className="w-3 h-3" />
                you can't copy this text
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
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Email Task</span>
          </div>
          <div className="p-4 sm:p-6">
            <div 
              onCopy={handleCopyProtection}
              onContextMenu={handleCopyProtection}
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
          <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Response Console • E0{index + 1}/02</div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800 leading-none">Draft Response</h2>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">Synthesize a professional response maintaining business formal tone and addressing all constraints.</p>
        </div>

        <textarea 
          value={answers[index]}
          onChange={(e) => {
            const next = [...answers];
            next[index] = e.target.value;
            setAnswers(next);
          }}
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

function Part3Exercise({ onFinish, onShowSummary, setShowExitConfirm, setModalMode, isRealTest }: { onFinish: () => void, onShowSummary: () => void, setShowExitConfirm: (val: boolean) => void, setModalMode: (val: 'abandon' | 'dashboard') => void, isRealTest?: boolean }) {
  const currentQuestion = isRealTest ? REAL_TEST_PART3[0] : PART3_QUESTIONS[0];
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [copyAttempted, setCopyAttempted] = useState(false);

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

  const handleCopyProtection = (e: React.ClipboardEvent | React.MouseEvent) => {
    if (isRealTest) {
      e.preventDefault();
      setCopyAttempted(true);
      setTimeout(() => setCopyAttempted(false), 3000);
    }
  };

  if (result) {
    return <Summary 
      results={[result]} 
      onBack={() => {
        if (isRealTest) {
          onFinish();
        } else {
          setModalMode('dashboard');
          setShowExitConfirm(true);
        }
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
          {copyAttempted && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-lg flex items-center gap-2"
            >
              <XCircle className="w-3 h-3" />
              you can't copy this text
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
        onCopy={handleCopyProtection}
        onContextMenu={handleCopyProtection}
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

function Summary({ results, onBack, ctaLabel }: { results: (AIResult | null)[], onBack: () => void, ctaLabel?: string }) {
  const averageScore = results.reduce((acc, curr) => acc + (curr?.score || 0), 0) / results.filter(r => r !== null).length;

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
        {results.map((res, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis • Task {i + 1}</h3>
              <div className="px-4 py-1.5 bg-indigo-600 rounded text-white font-black text-xs font-mono w-full sm:w-auto text-center">
                SCORE: {res?.score}/5.0
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
                    {res?.grammarFeedback}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    <Award className="w-4 h-4" />
                    Lexical Efficiency
                  </div>
                  <div className="text-xs font-bold leading-relaxed text-slate-600 bg-slate-50 p-5 border-l-4 border-indigo-500 rounded-r">
                    {res?.vocabularyFeedback}
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                  <BookOpen className="w-4 h-4" />
                  Strategic Feedback
                </div>
                <div className="prose prose-slate prose-xs max-w-none text-slate-700 font-bold leading-relaxed">
                  <Markdown>{res?.generalFeedback}</Markdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={onBack}
        className="w-full py-5 bg-slate-900 text-white rounded font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all text-center"
      >
        {ctaLabel || "Acknowledge & Close Report"}
      </button>
    </div>
  );
}
