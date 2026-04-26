
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Grid3X3, Target, Zap, ArrowRight, Search, Cpu, Dna, Lightbulb, Atom, LayoutDashboard, TrendingUp, ShieldCheck, Briefcase, Layout, BarChart3, Globe, Rocket, Award, BadgeCheck, Fingerprint, Star, ArrowUpCircle, CheckCircle2, Brain, Percent, PieChart, BrainCircuit, Activity, Trophy, AreaChart, ClipboardList, Check, Clock, Sun, Moon, AlertTriangle, Lock, Mail } from 'lucide-react';
import { HashRouter, Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
  Sphere,
  Graticule
} from "react-simple-maps";
import { TestState, Question, QuestionType, UserStats, ReportData } from './types';
import { QUESTIONS } from './questions';
import { Icons, COLORS, Logos } from './constants';
import { generateDetailedReport } from './services/geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- DECORATIVE COMPONENTS ---

const BackgroundMotif = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print select-none opacity-60 dark:opacity-30">
    {/* Subtle Grid Pattern */}
    <div className="absolute inset-0 dot-grid opacity-50"></div>
    
    <div className="absolute inset-0 neural-mask">
      {/* Floating Thematic Icons */}
      <FloatingThematicIcons />

      {/* Abstract Neural Web - Refined Constellation */}
      <div className="absolute inset-0 animate-neural-drift opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Constellation Nodes */}
          {[
            { x: 150, y: 100 }, { x: 450, y: 150 }, { x: 850, y: 120 }, { x: 1250, y: 180 },
            { x: 250, y: 450 }, { x: 720, y: 400 }, { x: 1150, y: 480 },
            { x: 100, y: 750 }, { x: 550, y: 820 }, { x: 950, y: 780 }, { x: 1350, y: 850 }
          ].map((node, i) => (
            <g key={`node-group-${i}`}>
              <circle cx={node.x} cy={node.y} r="15" fill="url(#node-glow)" />
              <circle cx={node.x} cy={node.y} r="2" fill="#2563eb" fillOpacity="0.6" />
            </g>
          ))}

          {/* Thin Constellation Lines */}
          <g stroke="#2563eb" strokeWidth="0.5" strokeOpacity="0.15">
            <path d="M150 100 L450 150 L250 450 Z" />
            <path d="M450 150 L850 120 L720 400 Z" />
            <path d="M850 120 L1250 180 L1150 480 Z" />
            <path d="M250 450 L720 400 L550 820 Z" />
            <path d="M720 400 L1150 480 L950 780 Z" />
            <path d="M100 750 L250 450 L550 820 Z" />
            <path d="M1150 480 L1350 850 L950 780 Z" />
          </g>
        </svg>
      </div>

      {/* Center Decorative Blobs - Refined */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-[100px] animate-pulse-soft"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '-3s' }}></div>
    </div>
  </div>
);

const FloatingThematicIcons = () => {
  const icons = [
    { Icon: Icons.Brain, x: '8%', y: '12%', size: 32, delay: 0 },
    { Icon: Target, x: '88%', y: '15%', size: 28, delay: 1 },
    { Icon: Zap, x: '12%', y: '75%', size: 30, delay: 2 },
    { Icon: Icons.Chart, x: '92%', y: '80%', size: 24, delay: 3 },
    { Icon: Icons.Award, x: '5%', y: '40%', size: 28, delay: 4 },
    { Icon: Cpu, x: '94%', y: '35%', size: 32, delay: 5 },
    { Icon: Dna, x: '18%', y: '25%', size: 24, delay: 6 },
    { Icon: Search, x: '82%', y: '65%', size: 24, delay: 7 },
  ];

  const symbols = [
    { text: 'Σ', x: '22%', y: '8%', size: 'text-3xl', delay: 0.5 },
    { text: 'π', x: '78%', y: '18%', size: 'text-4xl', delay: 1.5 },
    { text: 'Φ', x: '10%', y: '55%', size: 'text-2xl', delay: 2.5 },
    { text: '∞', x: '90%', y: '88%', size: 'text-5xl', delay: 3.5 },
    { text: '01', x: '35%', y: '4%', size: 'text-sm', delay: 4.5 },
    { text: 'Δ', x: '65%', y: '92%', size: 'text-xl', delay: 5.5 },
    { text: '√', x: '4%', y: '85%', size: 'text-3xl', delay: 6.5 },
    { text: 'Ω', x: '96%', y: '8%', size: 'text-2xl', delay: 7.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {icons.map((item, i) => (
        <motion.div
          key={`icon-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            y: [0, -30, 0],
            x: [0, 15, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
          style={{ position: 'absolute', left: item.x, top: item.y }}
          className="text-blue-600/50 dark:text-blue-400/40"
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
      
      {symbols.map((item, i) => (
        <motion.div
          key={`symbol-${i}`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 12 + Math.random() * 6,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
          style={{ position: 'absolute', left: item.x, top: item.y }}
          className={`${item.size} font-serif font-bold text-slate-400/40 dark:text-slate-500/30`}
        >
          {item.text}
        </motion.div>
      ))}
    </div>
  );
};

// --- BRANDING COMPONENTS ---

const BrandName = ({ className = "" }: { className?: string }) => (
  <span className={`font-display tracking-tighter antialiased ${className}`}>
    <span className="font-semibold opacity-90">brainmed</span>
    <span className="relative inline-block font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-700">
      iq
      <span className="absolute -right-1.5 bottom-1.5 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
    </span>
  </span>
);

const BrandLogo = ({ size = "nav", className = "" }: { size?: "nav" | "footer" | "hero", className?: string }) => {
  const isNav = size === "nav";
  const isFooter = size === "footer";
  
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      <div className={`${isNav ? 'text-blue-600' : 'text-blue-600'} transition-colors`}>
        <Logos.BrainGrid 
          size={isNav ? 28 : isFooter ? 48 : 64} 
          className="animate-spin-soft"
        />
      </div>
      <BrandName className={isNav ? 'text-xl' : isFooter ? 'text-2xl' : 'text-5xl'} />
    </div>
  );
};

// --- VISUAL COMPONENTS FOR REPORT ---

const DomainBar = ({ label, value, desc, level, animate }: { label: string; value: number; desc: string; level: string; animate: boolean }) => (
  <div className="group">
    <div className="flex justify-between items-end mb-2">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</span>
        <span className="text-[10px] text-slate-400">{desc}</span>
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">{level}</span>
        <span className="ml-2 text-[10px] font-bold text-slate-300">{value}%</span>
      </div>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
      <div 
        className="h-full bg-blue-600 transition-transform duration-1000 ease-out origin-left no-print" 
        style={{ transform: animate ? `scaleX(${value / 100})` : 'scaleX(0)' }}
      ></div>
      <div 
        className="hidden print:block h-full bg-blue-600" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const PercentileAxis = ({ val, animate, label, hideScale }: { val: number; animate: boolean; label?: string; hideScale?: boolean }) => (
  <div className="relative py-14">
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
      <div 
        className="absolute inset-y-0 left-0 bg-blue-600/20 transition-transform duration-1000 ease-out origin-left no-print"
        style={{ transform: animate ? `scaleX(${val / 100})` : 'scaleX(0)' }}
      ></div>
    </div>
    
    {!hideScale && (
      <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        <span>Słabszy niż większość</span>
        <span>Przeciętny (50)</span>
        <span>Wybitny</span>
      </div>
    )}

    <div 
      className="absolute top-0 transition-all duration-1000 ease-out flex flex-col items-center"
      style={{ 
        left: animate ? `${val}%` : '0%', 
        opacity: animate ? 1 : 0, 
        transform: 'translateX(-50%)' 
      }}
    >
      <div className="bg-blue-600 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-xl mb-2 whitespace-nowrap">
        {label || `${val}. percentyl`}
      </div>
      <div className="w-1 h-14 bg-blue-600 rounded-full"></div>
    </div>
  </div>
);

const ConfidenceRange = ({ range, score, animate }: { range: [number, number]; score: number; animate: boolean }) => {
  const min = 70;
  const max = 130;
  const left = ((range[0] - min) / (max - min)) * 100;
  const width = ((range[1] - range[0]) / (max - min)) * 100;
  const scorePos = ((score - min) / (max - min)) * 100;

  return (
    <div className="relative h-20 flex items-center">
      <div className="absolute w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
      <div 
        className="absolute h-4 bg-blue-100 dark:bg-blue-900/40 border-x border-blue-300 dark:border-blue-700 transition-all duration-1000 no-print"
        style={{ left: animate ? `${left}%` : '40%', width: animate ? `${width}%` : '20%', opacity: animate ? 1 : 0 }}
      ></div>
      <div 
        className="hidden print:block absolute h-4 bg-blue-100 border-x border-blue-300"
        style={{ left: `${left}%`, width: `${width}%` }}
      ></div>
      
      <div 
        className="absolute w-1 h-8 bg-blue-600 z-10 transition-all duration-1000 no-print"
        style={{ left: animate ? `${scorePos}%` : '50%', transform: 'translateX(-50%)' }}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-600">{score}</div>
      </div>
      <div 
        className="hidden print:block absolute w-1 h-8 bg-blue-600 z-10"
        style={{ left: `${scorePos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-600">{score}</div>
      </div>
    </div>
  );
};

const HeroIllustration = () => (
  <div className="relative w-full h-[500px] flex items-center justify-center">
    <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-400/5 rounded-[3rem] -rotate-6 animate-pulse"></div>
    <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-400/10 rounded-[3rem] rotate-3"></div>
    <div className="relative w-64 h-64 text-blue-600 dark:text-blue-400 drop-shadow-2xl">
      <Logos.BrainGrid size={256} className="animate-spin-soft" />
    </div>
    {/* Decorative floating elements */}
    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-lg rotate-12 animate-bounce shadow-lg"></div>
    <div className="absolute bottom-1/4 right-1/4 w-6 h-6 border-2 border-blue-300 rounded-full animate-pulse shadow-xl"></div>
    <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
  </div>
);

// --- INFOGRAPHICS FOR METHODOLOGY PAGE ---

const ScoreGenerationInfographic = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] my-12 shadow-sm">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
      {/* Step 1 */}
      <div className="flex-1 flex flex-col items-center text-center z-10">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
          <Icons.Check />
        </div>
        <h5 className="font-bold text-sm mb-1">Wynik surowy</h5>
        <p className="text-[10px] text-slate-500 leading-relaxed">Suma poprawnych odpowiedzi we wszystkich domenach.</p>
      </div>

      <div className="hidden md:block w-8 h-8 text-slate-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      {/* Step 2 */}
      <div className="flex-1 flex flex-col items-center text-center z-10">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
          <Icons.Clock />
        </div>
        <h5 className="font-bold text-sm mb-1">Korekta czasu</h5>
        <p className="text-[10px] text-slate-500 leading-relaxed">Algorytm uwzględnia szybkość reakcji i trudność pytań.</p>
      </div>

      <div className="hidden md:block w-8 h-8 text-slate-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      {/* Step 3 */}
      <div className="flex-1 flex flex-col items-center text-center z-10">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
          <Icons.Chart />
        </div>
        <h5 className="font-bold text-sm mb-1">Skalowanie</h5>
        <p className="text-[10px] text-slate-500 leading-relaxed">Przeniesienie na standardową skalę populacyjną (mediana 100).</p>
      </div>

      <div className="hidden md:block w-8 h-8 text-slate-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      {/* Final */}
      <div className="flex-1 flex flex-col items-center text-center z-10">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl">
          <Icons.Award />
        </div>
        <h5 className="font-bold text-sm mb-1 text-blue-600">Wynik IQ</h5>
        <p className="text-[10px] text-slate-500 leading-relaxed">Końcowa estymacja z przedziałem ufności ±5.</p>
      </div>

      {/* Background Line (Desktop only) */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-[28px] hidden md:block"></div>
    </div>
  </div>
);

const BellCurveInfographic = () => (
  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] my-12">
    <div className="w-full max-w-lg mx-auto">
      <svg viewBox="0 0 400 180" className="w-full h-auto overflow-visible">
        {/* Shading for main population */}
        <path d="M20,160 Q200,20 380,160" fill="none" stroke="#e2e8f0" strokeWidth="2" />
        <path d="M20,160 Q200,20 380,160 L380,160 L20,160 Z" fill="rgba(37, 99, 235, 0.05)" />
        
        {/* Highlighted area (e.g. above average) */}
        <path d="M240,160 L240,93.45 Q310,105.55 380,160 Z" fill="rgba(37, 99, 235, 0.2)" />
        
        {/* Axis */}
        <line x1="10" y1="160" x2="390" y2="160" stroke="#cbd5e1" strokeWidth="1" />
        
        {/* Markers */}
        <line x1="200" y1="30" x2="200" y2="160" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
        <text x="200" y="175" textAnchor="middle" fontSize="10" className="fill-slate-400 font-bold">100 IQ (50%)</text>
        
        <text x="100" y="175" textAnchor="middle" fontSize="9" className="fill-slate-300">85 IQ</text>
        <text x="300" y="175" textAnchor="middle" fontSize="9" className="fill-slate-300">115 IQ</text>
        
        {/* Percentile labels */}
        <text x="200" y="80" textAnchor="middle" fontSize="11" className="fill-blue-600 font-black">68% POPULACJI</text>
        <text x="310" y="130" textAnchor="middle" fontSize="9" className="fill-slate-500">Wybitne</text>
        <text x="90" y="130" textAnchor="middle" fontSize="9" className="fill-slate-500">Poniżej normy</text>
      </svg>
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 italic">Percentyl określa Twoje miejsce w powyższym rozkładzie normalnym.</p>
      </div>
    </div>
  </div>
);

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const IQWorldMap = () => {
  const countries = [
    { name: "Hong Kong", median: 108, code: "HK", coordinates: [114.1694, 22.3193] },
    { name: "Singapur", median: 107, code: "SG", coordinates: [103.8198, 1.3521] },
    { name: "Korea Południowa", median: 106, code: "KR", coordinates: [127.7669, 35.9078] },
    { name: "Japonia", median: 105, code: "JP", coordinates: [138.2529, 36.2048] },
    { name: "Niemcy", median: 102, code: "DE", coordinates: [10.4515, 51.1657] },
    { name: "Włochy", median: 102, code: "IT", coordinates: [12.5674, 41.8719] },
    { name: "Kanada", median: 101, code: "CA", coordinates: [-106.3468, 56.1304] },
    { name: "Finlandia", median: 101, code: "FI", coordinates: [25.7482, 61.9241] },
    { name: "Polska", median: 99, code: "PL", coordinates: [19.1451, 51.9194] },
    { name: "USA", median: 98, code: "US", coordinates: [-95.7129, 37.0902] },
    { name: "Australia", median: 99, code: "AU", coordinates: [133.7751, -25.2744] },
    { name: "Nowa Zelandia", median: 100, code: "NZ", coordinates: [174.8860, -40.9006] },
    { name: "Brazylia", median: 87, code: "BR", coordinates: [-51.9253, -14.2350] },
    { name: "Argentyna", median: 87, code: "AR", coordinates: [-63.6167, -38.4161] },
    { name: "Chile", median: 90, code: "CL", coordinates: [-71.5430, -35.6751] },
    { name: "Egipt", median: 76, code: "EG", coordinates: [30.8025, 26.8206] },
    { name: "RPA", median: 77, code: "ZA", coordinates: [22.9375, -30.5595] },
    { name: "Maroko", median: 72, code: "MA", coordinates: [-7.0926, 31.7917] },
    { name: "Nigeria", median: 69, code: "NG", coordinates: [8.6753, 9.0820] },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden z-10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            Globalne Statystyki
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 dark:text-white leading-tight">
            Średnie wyniki IQ <br />
            <span className="text-blue-600">w wybranych krajach</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Porównaj wyniki z różnych części świata. Nasza baza danych jest stale aktualizowana o wyniki użytkowników z ponad 150 krajów.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row items-stretch gap-12">
          {/* Countries List */}
          <div className="w-full xl:w-1/3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 xl:max-h-[600px] xl:overflow-y-auto xl:pr-4 custom-scrollbar">
            {countries.map((c, i) => (
              <div key={i} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-600/40 uppercase mb-1">{c.code}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">{c.name}</span>
                </div>
                <span className="text-2xl font-black text-blue-600">{c.median}</span>
              </div>
            ))}
          </div>

          {/* Large Map Container */}
          <div className="w-full xl:w-2/3 relative">
            <div className="h-full min-h-[500px] bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 md:p-8 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-5 dot-grid pointer-events-none"></div>
              
              <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                <ComposableMap
                  projectionConfig={{
                    scale: 145,
                  }}
                  width={800}
                  height={400}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                >
                  <Sphere stroke="#E4E7EB" strokeWidth={0.5} id="sphere" fill="#F8FAFC" className="dark:fill-slate-900/50 dark:stroke-slate-800" />
                  <Graticule stroke="#E4E7EB" strokeWidth={0.5} className="dark:stroke-slate-800/80" />
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies && geographies.length > 0 ? (
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#D1D5DB"
                            stroke="#9CA3AF"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#9CA3AF", outline: "none" },
                              pressed: { fill: "#6B7280", outline: "none" },
                            }}
                            className="dark:fill-slate-700 dark:stroke-slate-600 dark:hover:fill-slate-600 transition-colors duration-300"
                          />
                        ))
                      ) : (
                        <text x="400" y="200" textAnchor="middle" className="fill-slate-400 text-xs italic">Ładowanie mapy świata...</text>
                      )
                    }
                  </Geographies>
                  {countries.map(({ name, coordinates, median }) => (
                    <Marker key={name} coordinates={coordinates as [number, number]}>
                      <g className="cursor-pointer group/marker">
                        {/* Outer glow */}
                        <circle r={14} fill="#2563EB" opacity={0.15} className="animate-pulse" />
                        {/* Ping animation */}
                        <circle r={10} fill="#2563EB" opacity={0.2} className="animate-ping" />
                        {/* Main dot */}
                        <circle r={5} fill="#2563EB" stroke="#fff" strokeWidth={2} className="shadow-lg" />
                        
                        <title>{name}: {median}</title>
                        
                        {/* Custom Tooltip on Marker */}
                        <g className="opacity-0 group-hover/marker:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover/marker:translate-y-0">
                          <rect
                            x={-45}
                            y={-40}
                            width={90}
                            height={28}
                            rx={14}
                            fill="#1E293B"
                            className="shadow-xl"
                          />
                          <text
                            y={-22}
                            textAnchor="middle"
                            style={{ fontFamily: "Inter, system-ui", fill: "#fff", fontSize: "11px", fontWeight: "800" }}
                          >
                            {name}: {median}
                          </text>
                        </g>
                      </g>
                    </Marker>
                  ))}
                </ComposableMap>
              </div>

              {/* Map Overlay Info */}
              <div className="absolute top-10 left-10 flex flex-col space-y-1 pointer-events-none">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Global IQ Monitoring</span>
              </div>

              <div className="absolute bottom-10 right-12 flex items-center space-x-8 pointer-events-none">
                 <div className="flex items-center space-x-3">
                   <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Live Feed</span>
                 </div>
                 <div className="flex items-center space-x-3">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">System: Active</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- COMPONENTS ---

const Header = ({ darkMode, toggleDarkMode, openPurchaseModal }: { darkMode: boolean; toggleDarkMode: () => void; openPurchaseModal: () => void }) => (
  <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <BrandLogo size="nav" />
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Start</Link>
          <Link to="/metoda" className="hover:text-blue-600 dark:hover:text-blue-400">O metodzie</Link>
          <div className="relative group flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: 1,
                rotate: [-3, -2, -3]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.5 }
              }}
              className="absolute -top-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 text-[10px] sm:text-[11px] font-black text-white px-2.5 py-0.5 rounded-full shadow-lg pointer-events-none uppercase tracking-widest border border-white/50 whitespace-nowrap z-50 transform antialiased flex items-center justify-center min-h-[18px] leading-none"
            >
              Nowość
            </motion.div>
            <Link to="/inne-testy" className="hover:text-blue-600 dark:hover:text-blue-400">
              Inne testy
            </Link>
          </div>
          <Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400">FAQ</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title={darkMode ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"}
          >
            <div className="w-5 h-5">{darkMode ? <Icons.Sun /> : <Icons.Moon />}</div>
          </button>
          <button onClick={openPurchaseModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg">
            Rozpocznij Test IQ
          </button>
        </div>
      </div>
    </div>
  </header>
);

const Footer = ({ openPurchaseModal }: { openPurchaseModal: () => void }) => (
  <footer className="bg-slate-900 text-slate-400 py-12 px-4 no-print border-t border-slate-800 relative z-10">
    <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="mb-4">
          <BrandLogo size="footer" className="mb-2" />
          <p className="max-w-sm mt-4 text-slate-400 text-sm leading-relaxed">
            Niezależna platforma psychometryczna oferująca nowoczesne narzędzia do ewaluacji predyspozycji poznawczych. Profesjonalna analiza struktury inteligencji.
          </p>
        </div>
        <p className="text-xs mt-8">© 2024 brainmediq Polska. Wszelkie prawa zastrzeżone.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Produkt</h4>
        <ul className="space-y-2 text-sm">
          <li><button onClick={openPurchaseModal} className="hover:text-white cursor-pointer">Rozpocznij test</button></li>
          <li><Link to="/metoda" className="hover:text-white">O metodzie</Link></li>
          <li className="relative inline-block">
            <Link to="/inne-testy" className="hover:text-white">Inne testy</Link>
          </li>
          <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/prywatnosc" className="hover:text-white">Polityka Prywatności</Link></li>
          <li><Link to="/regulamin" className="hover:text-white">Regulamin</Link></li>
          <li><Link to="/kontakt" className="hover:text-white">Kontakt</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

// --- HOMEPAGE: REPORT PREVIEW SECTION ---

const HomepageReportPreview = ({ openPurchaseModal }: { openPurchaseModal: () => void }) => {
  const [activeTab, setActiveTab] = useState("podsumowanie");
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setAnimate(true);
    }, { threshold: 0.15 });
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const mockData: ReportData = {
    isPaid: true,
    isPro: true,
    timestamp: Date.now(),
    stats: {
      iqScore: 112,
      percentile: 78,
      domainScores: {
        [QuestionType.MATRIX]: 88,
        [QuestionType.LOGIC]: 92,
        [QuestionType.SPATIAL]: 58,
        [QuestionType.NUMBER_SERIES]: 65,
        [QuestionType.ANALOGY]: 82
      },
      confidenceInterval: [108, 116]
    },
    analysis: {
      summary: "Twój wynik (112) jest bardzo wysoki. Świetnie radzisz sobie z logicznym myśleniem i szybkim kojarzeniem faktów w codziennych sytuacjach.",
      strengths: ["Bardzo szybkie łączenie faktów", "Łatwe wyłapywanie reguł i wzorców", "Skuteczne oddzielanie ważnych informacji od szumu"],
      weaknesses: ["Wyobraźnia przestrzenna przy trudniejszych bryłach", "Tempo pracy przy wielu rzeczach naraz"],
      careerPaths: ["Analityk Danych", "Architekt Systemów", "Strateg Biznesowy"],
      personalityTraits: ["Analityczność", "Skrupulatność", "Kreatywne rozwiązywanie problemów"],
      recommendations: [
        { title: "Trening Matryc", time: "10 min", diff: "Średni", desc: "Zadania oparte na zmianie dwóch zmiennych jednocześnie." },
        { title: "Rotacja 3D", time: "15 min", diff: "Wysoki", desc: "Skup się na rzutowaniu izometrycznym brył złożonych." },
        { title: "Pamięć Operacyjna", time: "5 min", diff: "Niski", desc: "Ciągi cyfr wstecznie i naprzemiennie." },
        { title: "Analiza Logiczna", time: "10 min", diff: "Średni", desc: "Rozwiązywanie zagadek typu 'kto kłamie, kto mówi prawdę'." },
        { title: "Szybkie Czytanie", time: "15 min", diff: "Średni", desc: "Trening poszerzania pola widzenia i szybkiego skanowania tekstu." }
      ]
    }
  };

  return (
    <div ref={containerRef}>
      <ReportContent 
        data={mockData} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        animate={animate} 
        openPurchaseModal={openPurchaseModal}
      />
    </div>
  );
};

// --- REUSABLE REPORT CONTENT ---

const ReportContent = ({ data, activeTab, setActiveTab, animate, openPurchaseModal }: { data: ReportData; activeTab: string; setActiveTab: (t: string) => void; animate: boolean; openPurchaseModal: () => void }) => {
  const { stats, analysis } = data;

  const renderTabContent = () => {
    switch (activeTab) {
      case "podsumowanie":
        return (
          <div className="space-y-8 animate-in animate-slide-in-from-bottom duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-800">
              <div className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-xl text-center min-w-[140px]">
                <div className="text-5xl font-black">{stats.iqScore}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Wynik IQ</div>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Brain size={20} className="text-blue-500" /> Interpretacja ogólna</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic max-w-prose">
                  "{analysis?.summary || `Twój wynik (${stats.iqScore}) plasuje Cię powyżej przeciętnej. Wykazujesz biegłość w zadaniach analitycznych.`}"
                </p>
              </div>
            </div>
            {(data.isMax || data.isPro) && (
              <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                      <h5 className="font-bold mb-3 flex items-center text-sm"><div className="w-4 h-4 mr-2 text-blue-600"><Star size={16} /></div> Mocne strony</h5>
                      <ul className="text-xs space-y-2 text-slate-500">
                        {analysis?.strengths.map((s, i) => <li key={i}>• {s}</li>) || (
                          <><li>• Szybkie wyciąganie trafnych wniosków</li><li>• Łatwe dostrzeganie ukrytych powiązań</li></>
                        )}
                      </ul>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                      <h5 className="font-bold mb-3 flex items-center text-sm text-slate-400"><div className="w-4 h-4 mr-2"><TrendingUp size={16} /></div> Do rozwoju</h5>
                      <ul className="text-xs space-y-2 text-slate-500">
                        {analysis?.weaknesses.map((w, i) => <li key={i}>• {w}</li>) || (
                          <><li>• Wyobraźnia przestrzenna (bryły 3D)</li><li>• Czas reakcji przy nagłych zmianach</li></>
                        )}
                      </ul>
                    </div>
                  </div>
                  {analysis && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-blue-50/50 dark:bg-blue-900/5 border border-blue-100 dark:border-blue-800/50 rounded-2xl">
                        <h5 className="font-bold mb-3 text-sm flex items-center"><div className="w-4 h-4 mr-2 text-blue-600"><Briefcase size={16} /></div> Kariera</h5>
                        <div className="flex flex-wrap gap-2">
                          {analysis.careerPaths.map((c, i) => (
                            <span key={i} className="text-[10px] font-bold bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
                        <h5 className="font-bold mb-3 text-sm flex items-center"><div className="w-4 h-4 mr-2 text-slate-400"><Fingerprint size={16} /></div> Cechy</h5>
                        <div className="flex flex-wrap gap-2">
                          {analysis.personalityTraits.map((t, i) => (
                            <span key={i} className="text-[10px] font-bold bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        );
      case "domeny":
        return (
          <div className="space-y-6 animate-in animate-slide-in-from-bottom duration-500">
            <h4 className="font-bold text-center flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
              <BrainCircuit size={20} className="text-blue-500" /> Szczegółowy profil domen
            </h4>
            <DomainBar label="Wzorce i matryce" value={stats.domainScores.MATRIX} desc="Identyfikacja trendów wizualnych" level={stats.domainScores.MATRIX > 80 ? "Wysoki" : "Średni"} animate={animate} />
            <DomainBar label="Logika i wnioskowanie" value={stats.domainScores.LOGIC} desc="Dedukcja i synteza" level={stats.domainScores.LOGIC > 80 ? "Wysoki" : "Średni"} animate={animate} />
            <DomainBar label="Przestrzeń" value={stats.domainScores.SPATIAL} desc="Rotacja i składanie brył" level={stats.domainScores.SPATIAL > 80 ? "Wysoki" : "Średni"} animate={animate} />
            <DomainBar label="Liczby" value={stats.domainScores.NUMBER_SERIES} desc="Operacje na sekwencjach" level={stats.domainScores.NUMBER_SERIES > 80 ? "Wysoki" : "Średni"} animate={animate} />
            <DomainBar label="Słowa" value={stats.domainScores.ANALOGY} desc="Zrozumienie relacji pojęć" level={stats.domainScores.ANALOGY > 80 ? "Wysoki" : "Średni"} animate={animate} />
          </div>
        );
      case "percentyl":
        return (
          <div className="space-y-8 animate-in animate-slide-in-from-bottom duration-500">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl">
              <h4 className="font-bold text-center mb-4 flex items-center justify-center gap-2">
                <Percent size={20} className="text-blue-500" /> Percentyl: {stats.percentile}%
              </h4>
              <p className="text-xs text-slate-500 text-center mb-8">Jesteś sprawniejszy poznawczo niż {stats.percentile}% populacji w naszym modelu referencyjnym.</p>
              <PercentileAxis val={stats.percentile} animate={animate} label={`Twój wynik: ${stats.percentile}%`} />
            </div>
          </div>
        );
      case "rekomendacje":
        const recs = analysis?.recommendations || [
          { title: "Trening Matryc", time: "10 min", diff: "Średni", desc: "Zadania oparte na zmianie dwóch zmiennych jednocześnie." },
          { title: "Rotacja 3D", time: "15 min", diff: "Wysoki", desc: "Skup się na rzutowaniu izometrycznym brył złożonych." },
          { title: "Pamięć Operacyjna", time: "5 min", diff: "Niski", desc: "Ciągi cyfr wstecznie i naprzemiennie." },
          { title: "Analiza Logiczna", time: "10 min", diff: "Średni", desc: "Rozwiązywanie zagadek typu 'kto kłamie, kto mówi prawdę'." },
          { title: "Szybkie Czytanie", time: "15 min", diff: "Średni", desc: "Trening poszerzania pola widzenia i szybkiego skanowania tekstu." }
        ];
        return (
          <div className="space-y-6 animate-in animate-slide-in-from-bottom duration-500">
            <h4 className="font-bold text-center flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
              <Rocket size={20} className="text-blue-500" /> Plan rozwoju poznawczego
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recs.map((rec, i) => (
              <div key={i} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:translate-y-[-2px] transition-transform">
                <h5 className="font-bold text-sm mb-1">{rec.title}</h5>
                <div className="flex gap-2 mb-3">
                  <span className="text-[9px] font-black bg-blue-50 dark:bg-blue-900/40 text-blue-600 px-2 py-0.5 rounded uppercase">{rec.time}</span>
                  <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">{rec.diff}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{rec.desc}</p>
              </div>
            ))}
            </div>
          </div>
        );
      case "certyfikat":
        return (
          <div className="animate-in animate-slide-in-from-bottom duration-500 flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border-8 border-slate-50 dark:border-slate-800 p-10 rounded-[2rem] shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/5 rounded-full -ml-12 -mb-12"></div>
              
              <div className="text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <Logos.BrainGrid size={48} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2 dark:text-white">Certyfikat Inteligencji</h3>
                <div className="w-16 h-0.5 bg-blue-600 mx-auto mb-8"></div>
                
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-10">Niniejszym potwierdza się wynik</p>
                
                <div className="mb-10">
                  <div className="text-7xl font-black text-blue-600 mb-2">{stats.iqScore}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Punktów IQ</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-8 mt-8">
                  <div className="text-left">
                    <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Data wydania</div>
                    <div className="text-xs font-bold dark:text-white">{new Date(data.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">ID Weryfikacji</div>
                    <div className="text-[9px] font-mono dark:text-slate-500">IQM-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const tabs = [
    { id: "podsumowanie", label: "Podsumowanie", icon: <LayoutDashboard size={16} /> },
    ...(data.isMax || data.isPro ? [
      { id: "domeny", label: "Profil Domen", icon: <BrainCircuit size={16} /> },
      { id: "percentyl", label: "Percentyl", icon: <Percent size={16} /> },
      { id: "rekomendacje", label: "Rozwój", icon: <Rocket size={16} /> }
    ] : []),
    { id: "certyfikat", label: "Certyfikat", icon: <Award size={16} /> }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-[1120px] mx-auto flex flex-col md:flex-row no-print relative z-10">
      {/* Sidebar Navigation */}
      <aside className="md:w-64 bg-slate-50 dark:bg-slate-800/40 border-r border-slate-100 dark:border-slate-800 p-6">
        <div className="mb-10 hidden md:block">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <div className="w-4 h-4"><BadgeCheck size={16} /></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{data.isPaid ? 'Pełny Raport' : 'Raport Przykład'}</span>
          </div>
          <h3 className="text-xl font-bold dark:text-white leading-tight">Twój potencjał <br />w pigułce</h3>
        </div>
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="w-4 h-4">{tab.icon}</div>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 p-8 md:p-12 min-h-[450px]">
        {renderTabContent()}
        {!data.isPaid && (
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 italic mb-6">Powyższe dane są przykładem wizualizacji wyników. Każdy raport jest unikalny i bazuje na Twoich odpowiedziach.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={openPurchaseModal} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm">Zacznij Test</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- PAGES ---

const Home = ({ openPurchaseModal }: { openPurchaseModal: () => void }) => {
  return (
    <div className="space-y-0 relative">
      {/* Hero */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden z-10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Test walidowany algorytmem psychometrycznym</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white leading-[0.95] max-w-[12ch]">
              Poznaj swój <br />
              <span className="text-blue-600 dark:text-blue-400 bg-clip-text">Poziom Intelektualny</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
              Sprawdź możliwości swojego mózgu i poznaj swoje mocne strony. Twój spersonalizowany raport będzie gotowy natychmiast po zakończeniu testu.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={openPurchaseModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-all text-center"
              >
                Rozpocznij Test IQ
              </button>
              <Link to="/metoda" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 px-12 py-5 rounded-2xl text-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center">
                Metodologia
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-slate-900/50 py-24 border-y border-slate-100 dark:border-slate-800 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold dark:text-white mb-4">
              Dlaczego <BrandName />?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
              Łączymy klasyczną psychometrię z najnowocześniejszą technologią pomiarową. Nasz test to nie tylko wynik punktowy, ale kompleksowy wgląd w architekturę Twojego umysłu, opracowany z dbałością o najwyższe standardy rzetelności i trafności naukowej. Zapewniamy najwyższą jakość pomiaru dzięki autorskim algorytmom analizującym nie tylko poprawność, ale i dynamikę Twoich procesów myślowych.
            </p>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-8 rounded-full"></div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: 'Matryce Logiczne', desc: 'Wykorzystujemy autorskie wzorce wektorowe SVG do badania inteligencji płynnej, oparte na najbardziej uznanych modelach psychometrycznych (Raven, Cattell).', icon: <Grid3X3 className="w-full h-full" strokeWidth={1.5} /> },
              { title: 'Szybka Analiza', desc: 'Zaawansowany silnik obliczeniowy przelicza Twoje wyniki w czasie rzeczywistym, uwzględniając czasy reakcji na każde z pytań, co zwiększa rzetelność pomiaru.', icon: <Zap className="w-full h-full" strokeWidth={1.5} /> },
              { title: 'Naukowy Model CHC', desc: 'Nasze testy są projektowane w oparciu o hierarchiczny model inteligencji Cattella-Horna-Carrolla, uznawany za światowy standard w psychologii poznawczej.', icon: <Atom className="w-full h-full animate-pulse" strokeWidth={1.5} /> }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-2 hover:translate-y-[-8px] transition-transform duration-500"
              >
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-[2rem] flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-sm">
                  <div className="w-10 h-10">{f.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 dark:text-white">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base max-w-prose">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IQ World Map Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <IQWorldMap />
      </motion.div>

      {/* Report Showcase - FULL PREVIEW ON HOMEPAGE */}
      <section id="report-preview-section" className="py-32 relative overflow-hidden z-10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-5xl font-bold mb-4 dark:text-white leading-tight">Głębsze spojrzenie <br /><span className="text-blue-600">na Twoje wyniki</span></h2>
            <div className="inline-block bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-8 shadow-lg shadow-blue-500/20">
              Przykład pełnego raportu z pakietu PRO
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-4">
              Płatny raport to nie tylko jedna liczba. To kompletna mapa Twojej struktury intelektualnej. Zobacz, jak prezentujemy Twoje wyniki:
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <HomepageReportPreview openPurchaseModal={openPurchaseModal} />
          </motion.div>
        </div>
      </section>

      {/* Other Tests Marquee Section */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden border-y border-slate-100 dark:border-slate-900 relative z-10">
        {/* Background Decorative Elements - Simplified for performance */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <div>
              <h3 className="text-4xl font-bold dark:text-white tracking-tight">Odkryj więcej testów</h3>
              <p className="text-slate-500 dark:text-slate-400 text-base mt-3 max-w-2xl leading-relaxed">
                Twoja inteligencja to fascynujący, wielowymiarowy krajobraz. Wyjdź poza standardowe ramy i zbadaj swoją pamięć, koncentrację oraz unikalne cechy osobowości.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/inne-testy" className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md group">
              Zobacz wszystkie <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Gradient Masks for seamless fade - Optimized */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-20 pointer-events-none" />

          <div className="flex overflow-hidden">
            <motion.div 
              animate={{ x: [0, -1488] }}
              transition={{ 
                duration: 45, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ willChange: "transform", transform: "translateZ(0)" }}
              className="flex space-x-8 whitespace-nowrap px-8 py-4 transform-gpu"
            >
              {[
                { id: 'osobowosc', title: 'Test Osobowości', icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', link: '/test-osobowosci', desc: 'Odkryj swój profil psychologiczny i dominujące cechy charakteru.' },
                { id: 'pamiec', title: 'Test Pamięci', icon: <Grid3X3 />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', link: '/test-pamieci', desc: 'Sprawdź pojemność swojej pamięci roboczej i zdolność zapamiętywania.' },
                { id: 'koncentracja', title: 'Test Koncentracji', icon: <Target />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', link: '/test-koncentracji', desc: 'Zmierz swoją odporność na dystraktory i zdolność skupienia uwagi.' },
                { id: 'reakcja', title: 'Szybkość Reakcji', icon: <Zap />, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', link: '/test-reakcji', desc: 'Zbadaj swój czas reakcji na bodźce wzrokowe w milisekundach.' },
                // Duplicate for loop
                { id: 'osobowosc-2', title: 'Test Osobowości', icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', link: '/test-osobowosci', desc: 'Odkryj swój profil psychologiczny i dominujące cechy charakteru.' },
                { id: 'pamiec-2', title: 'Test Pamięci', icon: <Grid3X3 />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', link: '/test-pamieci', desc: 'Sprawdź pojemność swojej pamięci roboczej i zdolność zapamiętywania.' },
                { id: 'koncentracja-2', title: 'Test Koncentracji', icon: <Target />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', link: '/test-koncentracji', desc: 'Zmierz swoją odporność na dystraktory i zdolność skupienia uwagi.' },
                { id: 'reakcja-2', title: 'Szybkość Reakcji', icon: <Zap />, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', link: '/test-reakcji', desc: 'Zbadaj swój czas reakcji na bodźce wzrokowe w milisekundach.' },
              ].map((test, idx) => (
                <Link 
                  key={`${test.id}-${idx}`}
                  to={test.link}
                  className="flex-shrink-0 w-[340px] bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group/card relative overflow-hidden transform-gpu"
                >
                  <div className={`w-16 h-16 rounded-2xl ${test.bg} ${test.color} flex items-center justify-center mb-8 group-hover/card:scale-105 transition-transform duration-300`}>
                    <div className="w-8 h-8">{test.icon}</div>
                  </div>
                  <h4 className="text-2xl font-bold dark:text-white mb-3 tracking-tight">{test.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 whitespace-normal leading-relaxed">{test.desc}</p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-bold">
                    Rozpocznij test <ArrowRight className="w-4 h-4 ml-2 group-hover/card:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-32 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-20 dark:text-white"
          >
            Wybierz swój test IQ
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none flex flex-col relative overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mb-8 justify-center items-start content-start relative z-10 h-auto md:h-32 mt-4">
                {["30 pytań", "Wynik + Certyfikat", "Wysyłka na e-mail"].map(tag => (
                  <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{tag}</span>
                ))}
              </div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white text-center relative z-10">Test Standard</h3>
              <div className="text-slate-500 font-black text-4xl mb-6 text-center relative z-10">4,99 PLN</div>
              <p className="text-slate-500 text-xs leading-relaxed mb-10 text-center flex-1 relative z-10">
                Klasyczny pomiar inteligencji płynnej. Oficjalny certyfikat z Twoim wynikiem punktowym oraz podstawowe podsumowanie wysłane na Twój e-mail za 4,99 PLN.
              </p>
              <Link to="/platnosc" className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-700 transition-all shadow-xl text-sm relative z-10">
                <span>Rozpocznij Standard</span>
              </Link>
            </motion.div>

            {/* PRO */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-blue-50 dark:bg-blue-900/10 p-10 rounded-[3rem] border-2 border-blue-500 shadow-2xl shadow-blue-500/10 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-6 py-1.5 rounded-b-xl uppercase tracking-widest whitespace-nowrap z-20">Najczęściej wybierany</div>
              <div className="flex flex-wrap gap-2 mb-8 justify-center items-start content-start relative z-10 h-auto md:h-32 mt-4">
                {["IQ Standard", "5 Domen", "Percentyl", "Rekomendacje", "Wysyłka na e-mail"].map(tag => (
                  <span key={tag} className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{tag}</span>
                ))}
              </div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white text-center relative z-10">Analiza PRO</h3>
              <div className="text-blue-600 dark:text-blue-400 font-black text-4xl mb-6 text-center relative z-10">9,99 PLN</div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-10 text-center flex-1 relative z-10">
                Pełny raport z analizą 5 domen poznawczych, percentylem oraz spersonalizowanymi rekomendacjami rozwoju wysłany na Twój e-mail.
              </p>
              <Link to="/platnosc?type=pro&intent=start" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-xl text-sm relative z-10">
                <span>Wybierz Analizę PRO</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- TEST SESSION ---

const TestSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const typeParam = new URLSearchParams(location.search).get('type');
  const isPro = typeParam === 'pro';
  const isMax = typeParam === 'max';
  const [state, setState] = useState<TestState | null>(null);
  const [trainingDone, setTrainingDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qCount = 30; // Standard test length
    
    // Group by difficulty and shuffle within each group
    const byDiff: Record<number, Question[]> = {};
    [...QUESTIONS].sort(() => 0.5 - Math.random()).forEach(q => {
      if (!byDiff[q.difficulty]) byDiff[q.difficulty] = [];
      byDiff[q.difficulty].push(q);
    });
    
    const diffLevels = Object.keys(byDiff).map(Number).sort((a, b) => a - b);
    const perLevel = Math.ceil(qCount / diffLevels.length);
    
    let selectedQuestions: Question[] = [];
    diffLevels.forEach(level => {
      selectedQuestions = selectedQuestions.concat(byDiff[level].slice(0, perLevel));
    });
    
    // Trim to exact qCount and sort by difficulty
    selectedQuestions = selectedQuestions.slice(0, qCount).sort((a, b) => a.difficulty - b.difficulty);
    
    setState({
      currentQuestionIndex: 0,
      answers: new Array(qCount).fill(null),
      startTime: null,
      endTime: null,
      questions: selectedQuestions,
      isFinished: false
    });

    setTimeLeft(15 * 60); 
  }, []);

  const startRealTest = () => {
    setTrainingDone(true);
    setState(prev => prev ? { ...prev, startTime: Date.now() } : null);
    setTimeout(() => {
      if (containerRef.current) {
        const y = containerRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'auto' });
      } else {
        window.scrollTo(0, 0);
      }
    }, 0);
  };

  useEffect(() => {
    if (!state || state.isFinished || !trainingDone) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state, trainingDone]);

  const handleAnswer = (optionIndex: number) => {
    if (!state) return;
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestionIndex] = optionIndex;
    
    if (state.currentQuestionIndex + 1 < state.questions.length) {
      setState({
        ...state,
        answers: newAnswers,
        currentQuestionIndex: state.currentQuestionIndex + 1
      });
      setTimeout(() => {
        if (containerRef.current) {
          const y = containerRef.current.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'auto' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 0);
    } else {
      finishTest(newAnswers);
    }
  };

  const finishTest = (finalAnswers?: number[]) => {
    if (!state) return;
    
    const endTime = Date.now();
    const durationMs = endTime - state.startTime!;
    
    const results = finalAnswers || state.answers;
    const stats = calculateStats(state.questions, results);
    
    const existingSaved = JSON.parse(localStorage.getItem('iq_results') || '{}');
    
    localStorage.setItem('iq_results', JSON.stringify({
      ...existingSaved,
      stats,
      timestamp: Date.now(),
      isPaid: existingSaved.isPaid || false,
      isPro: existingSaved.isPro || isPro
    }));
    navigate('/wynik');
  };

  const calculateStats = (questions: Question[], answers: (number | null)[]): UserStats => {
    let rawScore = 0;
    let maxRawScore = 0;

    const domainCorrect: any = {
      [QuestionType.MATRIX]: 0,
      [QuestionType.NUMBER_SERIES]: 0,
      [QuestionType.LOGIC]: 0,
      [QuestionType.SPATIAL]: 0,
      [QuestionType.ANALOGY]: 0,
    };
    const domainTotal: any = { ...domainCorrect };

    questions.forEach((q, i) => {
      domainTotal[q.type]++;
      maxRawScore += q.difficulty; // Waga pytania
      if (answers[i] === q.correctAnswer) {
        rawScore += q.difficulty;
        domainCorrect[q.type]++;
      }
    });

    // Psychometryczne mapowanie wyników
    // Zakładamy, że średni wynik w populacji to ok. 45% maksymalnej liczby punktów (biorąc pod uwagę trudność)
    const meanRaw = maxRawScore * 0.45; 
    // Odchylenie standardowe dla wyników surowych
    const stdDevRaw = maxRawScore * 0.18;

    // Obliczanie Z-score (ile odchyleń standardowych od średniej)
    let zScore = (rawScore - meanRaw) / stdDevRaw;
    
    // Ograniczenie Z-score do realistycznych wartości (IQ od ~55 do ~148)
    zScore = Math.max(-3.0, Math.min(3.2, zScore));

    // Obliczanie IQ (Średnia = 100, Odchylenie standardowe = 15)
    const iqScore = Math.round(100 + (zScore * 15));

    // Obliczanie Percentyla przy użyciu aproksymacji dystrybuanty rozkładu normalnego (CDF)
    const normalCDF = (x: number) => {
      const t = 1 / (1 + 0.2316419 * Math.abs(x));
      const d = 0.3989423 * Math.exp(-x * x / 2);
      let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      if (x > 0) p = 1 - p;
      return p;
    };
    
    let percentile = Math.round(normalCDF(zScore) * 1000) / 10;
    if (percentile > 99.9) percentile = 99.9;
    if (percentile < 0.1) percentile = 0.1;

    const domainScores: any = {};
    Object.keys(domainCorrect).forEach(key => {
      domainScores[key] = Math.round((domainCorrect[key] / (domainTotal[key] || 1)) * 100);
    });

    return { iqScore, percentile, domainScores, confidenceInterval: [iqScore - 4, iqScore + 4] };
  };

  if (!state) return <div className="p-20 text-center dark:text-white relative z-10">Inicjalizacja...</div>;

  if (!trainingDone) {
    return (
      <div className="max-w-2xl mx-auto py-32 px-6 relative z-10">
        <h2 className="text-4xl font-bold mb-8">Zadanie Próbne</h2>
        <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] border border-slate-200 shadow-xl">
          <h4 className="font-bold mb-10 text-xl leading-relaxed">Instrukcja: Wybierz liczbę, która logicznie uzupełnia ciąg: 2, 4, 6, 8, ...?</h4>
          <div className="grid grid-cols-2 gap-5">
            {['9', '10', '12', '14'].map((opt, i) => (
              <button key={i} onClick={startRealTest} className="p-6 border-2 border-slate-100 rounded-[2rem] hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-lg">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = state.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  return (
    <div className="min-h-screen py-16 px-6 relative z-10" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex-1 mr-12">
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl font-mono font-bold shadow-sm text-xl border border-slate-100 dark:border-slate-800">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-20 shadow-2xl border border-slate-100 dark:border-slate-800 min-h-[600px] flex flex-col">
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-16 dark:text-white leading-tight">{currentQ.content}</h3>
            {currentQ.svgContent && (
              <div className="max-w-[400px] mx-auto mb-16 text-slate-800 dark:text-slate-100">
                {typeof currentQ.svgContent === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: currentQ.svgContent }} />
                ) : (
                  currentQ.svgContent
                )}
              </div>
            )}
            {currentQ.imageUrl && <div className="max-w-[400px] mx-auto mb-16"><img src={currentQ.imageUrl} alt="Zadanie" className="w-full h-auto rounded-xl shadow-sm" /></div>}
          </div>
          <div className="grid grid-cols-2 gap-5 mt-auto">
            {currentQ.options.map((opt, idx) => {
              const isSvg = typeof opt === 'string' && opt.startsWith('<svg');
              return (
                <button key={idx} onClick={(e) => { e.currentTarget.blur(); handleAnswer(idx); }} className={`p-8 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all font-bold text-lg active:scale-[0.98] flex items-center ${isSvg ? 'justify-center' : 'text-left'}`}>
                  {!isSvg && <span className="mr-5 font-black text-blue-600/30 text-xl">{String.fromCharCode(65 + idx)}</span>}
                  {isSvg ? (
                    <div className="w-24 h-24 text-slate-800 dark:text-slate-100" dangerouslySetInnerHTML={{ __html: opt }} />
                  ) : (
                    opt
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- RESULTS ---

const Results = () => {
  const [data, setData] = useState<any>(null);
  const [animate, setAnimate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationStep, setGenerationStep] = useState(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('iq_results');
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      if (parsed.email) setEmail(parsed.email);
      
      // Simulate generation process
      const steps = 4;
      const stepDuration = 800;
      
      const interval = setInterval(() => {
        setGenerationStep(prev => {
          if (prev >= steps - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
              if (parsed.isPaid) {
                navigate('/raport');
              } else {
                setTimeout(() => setAnimate(true), 100);
              }
            }, stepDuration);
            return prev;
          }
          return prev + 1;
        });
      }, stepDuration);

      return () => clearInterval(interval);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...saved, email: newEmail }));
  };

  if (!data) return null;
  
  if (isGenerating && data.invalid !== 'too_fast') {
    const stepsText = [
      "Analizowanie wzorców odpowiedzi...",
      "Kalkulacja czasu reakcji...",
      "Porównywanie z modelem populacyjnym...",
      "Generowanie profilu poznawczego..."
    ];
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-32 h-32 text-blue-600 mb-12">
          <Logos.BrainGrid size={128} className="animate-spin-slow" />
        </div>
        <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">Przetwarzanie wyników</h2>
        
        <div className="w-full max-w-md space-y-4 mb-12">
          {stepsText.map((text, idx) => (
            <div 
              key={idx} 
              className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 ${
                idx <= generationStep 
                  ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                idx < generationStep ? 'bg-emerald-100 text-emerald-600' : 
                idx === generationStep ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-400'
              }`}>
                {idx < generationStep ? <Icons.Check /> : <div className="w-2 h-2 bg-current rounded-full" />}
              </div>
              <span className={`text-sm font-medium ${idx <= generationStep ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                {text}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-md bg-white/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">E-mail do wysyłki raportu (opcjonalnie)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Icons.Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="Twój e-mail (opcjonalnie)" 
              value={email}
              onChange={handleEmailChange}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 outline-none transition-all dark:text-white text-sm"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center uppercase tracking-widest font-bold">Możesz wpisać maila później</p>
        </div>
      </div>
    );
  }

  if (data.invalid === 'too_fast') {
    return (
      <div className="max-w-2xl mx-auto py-32 px-6 text-center relative z-10">
        <div className="bg-red-50 dark:bg-red-900/10 p-12 rounded-[3rem] border border-red-100 dark:border-red-900/40">
          <div className="w-20 h-20 text-red-500 mx-auto mb-6"><Icons.AlertTriangle /></div>
          <h2 className="text-3xl font-bold mb-4 text-red-900 dark:text-red-400">Test Odrzucony</h2>
          <p className="text-red-800 dark:text-red-400/80 text-lg mb-8 leading-relaxed">Wykryto nienaturalnie szybkie tempo rozwiązywania zadań (poniżej minimalnego czasu potrzebnego na przeczytanie pytań). Wynik nie może zostać uznany za wiarygodny.</p>
          <Link to="/test" className="inline-block bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all">Rozwiąż test ponownie</Link>
        </div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="max-w-[1120px] mx-auto py-24 px-6 space-y-16 relative z-10">
      {/* 1. Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black dark:text-white uppercase tracking-widest animate-in animate-fade-in">Analiza Zakończona</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mt-4 font-medium animate-in animate-fade-in delay-100">Podejście: {new Date(data.timestamp).toLocaleDateString()}</p>
      </div>

      {/* 2. Main Result Card (Teaser) */}
      <div className="bg-white dark:bg-slate-900 rounded-[4rem] shadow-[0_48px_80px_-20px_rgba(37,99,235,0.2)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden animate-in animate-slide-in-from-bottom">
        <div className="bg-blue-600 p-16 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 dot-grid pointer-events-none"></div>
          <div className="w-16 h-16 mx-auto mb-6 text-blue-200"><Icons.Lock /></div>
          <h2 className="text-2xl font-black uppercase tracking-[0.4em] opacity-80 mb-6">Twój Wynik IQ</h2>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => {
                const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
                localStorage.setItem('iq_results', JSON.stringify({ ...s, isPaid: true, email: email || 'test@example.com' }));
                navigate('/raport');
              }}
              className="inline-flex items-center justify-center px-12 py-5 bg-white text-blue-600 rounded-2xl text-lg font-bold shadow-xl hover:bg-blue-50 transition-all hover:scale-105"
            >
              <div className="w-5 h-5 mr-3"><Icons.Lock /></div> Odblokuj Wynik (Dostęp Testowy)
            </button>
            <Link 
              to="/platnosc?intent=unlock" 
              className="text-white/70 hover:text-white text-sm font-bold underline underline-offset-4 transition-colors"
            >
              Przejdź do oficjalnej płatności
            </Link>
          </div>
        </div>
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/20">
          <h3 className="text-2xl font-bold mb-4 dark:text-white">Odblokuj swój wynik i pełny raport</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Twój test został pomyślnie przetworzony. Podaj swój adres e-mail (opcjonalnie), abyśmy mogli wysłać Ci kopię wyników oraz certyfikat.
          </p>
          
          <div className="max-w-md mx-auto mb-10">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Icons.Mail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="Twój adres e-mail (opcjonalnie)" 
                value={email}
                onChange={handleEmailChange}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-medium"
              />
            </div>
          </div>

          <button 
            onClick={() => {
              const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
              localStorage.setItem('iq_results', JSON.stringify({ ...s, isPaid: true, email: email || 'test@example.com' }));
              navigate('/raport');
            }}
            className="inline-flex items-center justify-center px-12 py-5 bg-blue-600 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:scale-105"
          >
            <div className="w-5 h-5 mr-3"><Icons.Lock /></div> Odblokuj Wynik (Dostęp Testowy)
          </button>
        </div>
      </div>

      {/* 7. Paywall */}
      <section className="bg-slate-900 text-white p-16 md:p-24 rounded-[4.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-grid pointer-events-none"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-3 text-blue-400 font-black mb-8 uppercase text-sm tracking-[0.2em]">
            <div className="w-6 h-6"><Award /></div>
            <span>Pakiet Ekspert Psychometrii</span>
          </div>
          <h3 className="text-5xl font-bold mb-8">Pobierz pełną analizę</h3>
          <p className="text-slate-400 mb-12 leading-relaxed text-xl max-w-prose mx-auto">
            Otrzymaj pełen dostęp do szczegółowego rozkładu 5 domen, wnikliwej analizy Twoich mocnych stron oraz imienny certyfikat.
          </p>
          <div className="bg-slate-800/50 p-10 rounded-[3rem] mb-16 text-left space-y-5 max-w-2xl mx-auto">
             {[
               "Pełny breakdown 5 domen poznawczych",
               "Percentyl i rozkład populacyjny",
               "Szczegółowa analiza mocnych i słabych stron",
               "Imienny Certyfikat PDF do druku",
               "5 spersonalizowanych rekomendacji ćwiczeń"
             ].map((item, i) => (
               <div key={i} className="flex items-center text-lg font-medium"><div className="w-5 h-5 text-blue-500 mr-5 shrink-0"><CheckCircle2 /></div>{item}</div>
             ))}
          </div>
          <div className="flex flex-col items-center gap-5">
            <button 
              onClick={() => {
                const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
                localStorage.setItem('iq_results', JSON.stringify({ ...s, isPaid: true }));
                navigate('/raport');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-6 rounded-3xl font-bold shadow-2xl text-2xl transition-all hover:scale-105"
            >
              Odblokuj Wynik (Dostęp Testowy)
            </button>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">Jednorazowo | Bezpieczna płatność Stripe</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get('type');
  const intentParam = queryParams.get('intent');
  
  const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');
  const isPro = typeParam === 'pro' || saved.isPro;

  useEffect(() => {
    if (saved.email) setEmail(saved.email);
  }, []);

  let productName = 'Test IQ Standard + Certyfikat';
  let price = '4,99';
  
  if (isPro) {
    productName = 'Analiza Ekspercka PRO + Certyfikat';
    price = '9,99';
  }
  
  // Logic: If intent is 'unlock', we go to report. If 'start' or not specified, we go to test.
  // Exception: If they have stats and no intent, they probably just finished and want results.
  let redirectUrl = `/test?type=${typeParam || 'standard'}`;
  if (intentParam === 'unlock' || (saved.stats && !intentParam)) {
    redirectUrl = '/raport';
  }

  if (typeParam === 'osobowosc') {
    productName = 'Test Osobowości (Big Five)';
    price = '4,99';
    redirectUrl = '/test-osobowosci';
  } else if (typeParam === 'pamiec') {
    productName = 'Test Pamięci Przestrzennej';
    price = '4,99';
    redirectUrl = '/test-pamieci';
  } else if (typeParam === 'koncentracja') {
    productName = 'Test Koncentracji (Stroop)';
    price = '4,99';
    redirectUrl = '/test-koncentracji';
  } else if (typeParam === 'reakcja') {
    productName = 'Test Szybkości Reakcji';
    price = '4,99';
    redirectUrl = '/test-reakcji';
  }

  const handlePay = (bypass: boolean = false) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const updatedSaved = { ...saved, email: email || 'test@example.com' };
      
      // If starting a new test, clear old stats
      if (intentParam === 'start' || !intentParam) {
        delete updatedSaved.stats;
        delete updatedSaved.analysis;
      }

      if (typeParam === 'osobowosc') updatedSaved.hasOsobowosc = true;
      else if (typeParam === 'pamiec') updatedSaved.hasPamiec = true;
      else if (typeParam === 'koncentracja') updatedSaved.hasKoncentracja = true;
      else if (typeParam === 'reakcja') updatedSaved.hasReakcja = true;
      else {
        updatedSaved.isPaid = true;
        if (isPro) updatedSaved.isPro = true;
      }
      
      localStorage.setItem('iq_results', JSON.stringify(updatedSaved));
      navigate(redirectUrl);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-24 px-6 relative z-10">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-10 md:p-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">{productName}</h2>
            <p className="text-slate-500 dark:text-slate-400">Finalizacja dostępu do testu</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/20 p-8 rounded-3xl mb-10 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Cena</span>
              <span className="font-bold dark:text-white text-xl">{price} PLN</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700 mb-4"></div>
            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
              <Icons.Check className="text-emerald-500 w-4 h-4" />
              <span>Natychmiastowy dostęp i certyfikat PDF</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Adres E-mail (opcjonalnie)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twój e-mail do wysyłki wyników"
                className="w-full px-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 outline-none transition-all dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handlePay(false)}
                disabled={loading || !email.includes('@')}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Zapłać ${price} PLN`
                )}
              </button>

              <button 
                onClick={() => handlePay(true)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
              >
                Kontynuuj bez płatności (Dostęp Testowy)
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Płatność jest bezpieczna i szyfrowana. Wyniki zostaną wysłane na podany adres e-mail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificateTemplate = ({ data, userName }: { data: ReportData, userName: string }) => {
  return (
    <div className="w-[1123px] h-[794px] bg-white text-slate-900 p-16 flex flex-col items-center justify-center relative border-[24px] border-blue-600/10" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="absolute top-12 left-12 w-32 h-32 opacity-10">
        <Logos.BrainGrid size={128} className="text-blue-600" />
      </div>
      <div className="absolute bottom-12 right-12 w-32 h-32 opacity-10">
        <Logos.BrainGrid size={128} className="text-blue-600" />
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-slate-900 tracking-tight uppercase mb-4">Certyfikat IQ</h1>
        <p className="text-2xl text-slate-500 uppercase tracking-widest">
          Wystawiony przez <BrandName className="text-2xl" /> Polska
        </p>
      </div>

      <div className="text-center mb-16">
        <p className="text-xl text-slate-600 mb-6">Niniejszym zaświadcza się, że</p>
        <h2 className="text-5xl font-bold text-blue-600 border-b-2 border-blue-200 pb-4 inline-block min-w-[400px]">
          {userName || "Uczestnik Badania"}
        </h2>
      </div>

      <div className="flex items-center gap-16 mb-16">
        <div className="text-center">
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Wynik Ogólny</p>
          <div className="text-8xl font-black text-slate-900">{data.stats.iqScore}</div>
        </div>
        <div className="w-px h-32 bg-slate-200"></div>
        <div className="text-left space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Percentyl</p>
            <p className="text-2xl font-bold text-slate-800">{data.stats.percentile}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Data Badania</p>
            <p className="text-xl font-medium text-slate-800">{new Date().toLocaleDateString('pl-PL')}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-16">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <Icons.Award />
          </div>
          <div>
            <p className="font-bold text-slate-900"><BrandName className="text-lg" /> Polska</p>
            <p className="text-sm text-slate-500">Certyfikowany Pomiar Inteligencji</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Report = ({ openPurchaseModal }: { openPurchaseModal: () => void }) => {
  const [activeTab, setActiveTab] = useState("podsumowanie");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [userName, setUserName] = useState("");
  const [animate, setAnimate] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('iq_results');
    if (saved) {
      const parsed = JSON.parse(saved) as ReportData;
      if (!parsed.isPaid) { navigate('/platnosc'); return; }
      
      if (parsed.userName) setUserName(parsed.userName);

      const fetchReport = async () => {
        try {
          const analysis = await generateDetailedReport(parsed.stats);
          const updatedData = { ...parsed, analysis: analysis || undefined };
          setData(updatedData);
          localStorage.setItem('iq_results', JSON.stringify(updatedData));
          setTimeout(() => setAnimate(true), 300);
        } catch (e) { 
          console.error(e);
          setData(parsed);
        } finally { 
          setLoading(false); 
        }
      };
      
      const needsProInsights = false; // Pro insights removed
      
      if (parsed.analysis && !needsProInsights) {
        setData(parsed);
        setLoading(false);
        setTimeout(() => setAnimate(true), 300);
      } else {
        setData(parsed);
        fetchReport();
      }
    } else navigate('/');
  }, [navigate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setUserName(newName);
    if (data) {
      const updated = { ...data, userName: newName };
      setData(updated);
      localStorage.setItem('iq_results', JSON.stringify(updated));
    }
  };

  const handlePrint = async () => {
    if (!certificateRef.current) return;
    setIsPrinting(true);
    
    const currentScrollY = window.scrollY;
    
    try {
      // Scroll to top to prevent html2canvas blank rendering bug
      window.scrollTo(0, 0);
      
      // Small delay to ensure any UI changes (like hiding buttons) are rendered
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1123,
        windowHeight: 794
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certyfikat_IQ_${userName || 'Uczestnik'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to window.print() if html2canvas fails
      window.print();
    } finally {
      // Restore scroll position
      window.scrollTo(0, currentScrollY);
      setIsPrinting(false);
    }
  };

  if (!data) return null;

  return (
    <>
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={certificateRef}>
          <CertificateTemplate data={data} userName={userName} />
        </div>
      </div>
      <div className="max-w-[1120px] mx-auto py-24 px-6 animate-in animate-fade-in duration-1000 relative z-10" ref={reportRef}>
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex items-center space-x-6">
           <Logos.BrainGrid size={64} className="text-blue-600 animate-spin-soft" />
           <div>
             <h1 className="text-5xl font-bold dark:text-white mb-3">Szczegółowa Analiza IQ</h1>
             <p className="text-slate-500 dark:text-slate-400 text-lg">Zaawansowana Analiza Psychometryczna — Model CHC v2.5</p>
              <p className="text-blue-600 font-bold mt-2 no-print">Pełny raport oraz certyfikat zostały wysłane na Twój adres e-mail.</p>
             {userName && <p className="text-xl font-bold text-blue-600 mt-2 print:block hidden">Certyfikat wystawiony dla: {userName}</p>}
           </div>
        </div>
        <div className="text-right bg-blue-600 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200 dark:shadow-none min-w-[180px]">
          <div className="text-7xl font-black text-white">{data.stats.iqScore}</div>
          <div className="text-[12px] font-black text-blue-200 uppercase tracking-[0.2em] mt-2">WYNIK OGÓLNY</div>
        </div>
      </div>

      {loading ? (
        <div className="py-40 text-center bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600/20 border-t-blue-600 mx-auto mb-10"></div>
          <p className="text-slate-500 font-bold text-xl animate-pulse">Trwa zestawianie merytorycznych danych raportu...</p>
        </div>
      ) : (
        <div className="space-y-12">
          <ReportContent 
            data={data} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            animate={animate} 
            openPurchaseModal={openPurchaseModal}
          />
          
          <div className="no-print pt-12 flex flex-col items-center space-y-6" data-html2canvas-ignore="true">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Imię i nazwisko na certyfikacie</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={handleNameChange} 
                  placeholder="Jan Kowalski"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-mail do wysyłki raportu</label>
                <input 
                  type="email" 
                  value={data.email || ""} 
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    if (data) {
                      const updated = { ...data, email: newEmail };
                      setData(updated);
                      localStorage.setItem('iq_results', JSON.stringify(updated));
                    }
                  }} 
                  placeholder="Twój e-mail"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>
            <button 
              onClick={handlePrint} 
              disabled={isPrinting}
              className={`bg-blue-600 text-white px-16 py-6 rounded-3xl font-bold transition-all shadow-2xl shadow-blue-200 flex items-center space-x-5 text-lg ${isPrinting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              <div className="w-6 h-6">{isPrinting ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div> : <Award size={24} />}</div>
              <span>{isPrinting ? 'Generowanie PDF...' : 'Drukuj / Zapisz Certyfikat PDF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

const personalityQuestions = [
  { id: 1, trait: 'E', reverse: false, text: "Łatwo nawiązuję nowe kontakty i lubię być w centrum uwagi." },
  { id: 2, trait: 'A', reverse: false, text: "Zazwyczaj ufam innym ludziom i zakładam ich dobre intencje." },
  { id: 3, trait: 'C', reverse: false, text: "Zawsze staram się realizować swoje plany i obowiązki na czas." },
  { id: 4, trait: 'N', reverse: true, text: "Zazwyczaj pozostaję spokojny/a i opanowany/a, nawet w stresujących sytuacjach." },
  { id: 5, trait: 'O', reverse: false, text: "Lubię próbować nowych rzeczy, poznawać nieznane miejsca i idee." },
  { id: 6, trait: 'E', reverse: true, text: "Wolę spędzać czas w samotności lub w bardzo małym gronie znajomych." },
  { id: 7, trait: 'A', reverse: true, text: "Często wdaję się w kłótnie i bywam sceptyczny/a wobec innych." },
  { id: 8, trait: 'C', reverse: true, text: "Często działam pod wpływem impulsu i mam problem z utrzymaniem porządku." },
  { id: 9, trait: 'N', reverse: false, text: "Często odczuwam niepokój, stres lub wahania nastroju z błahych powodów." },
  { id: 10, trait: 'O', reverse: true, text: "Preferuję rutynę, sprawdzone sposoby działania i twarde fakty zamiast abstrakcji." },
  { id: 11, trait: 'E', reverse: false, text: "Często przejmuję inicjatywę w grupie i łatwo wyrażam swoje zdanie." },
  { id: 12, trait: 'A', reverse: false, text: "Chętnie pomagam innym, nawet jeśli wymaga to ode mnie poświęcenia." },
  { id: 13, trait: 'C', reverse: false, text: "Jestem osobą bardzo zorganizowaną i zwracam uwagę na detale." },
  { id: 14, trait: 'N', reverse: false, text: "Łatwo się denerwuję i długo przeżywam niepowodzenia." },
  { id: 15, trait: 'O', reverse: false, text: "Mam bogatą wyobraźnię, doceniam sztukę i głębokie dyskusje." }
];

const traitInfo = {
  O: { name: "Otwartość na doświadczenia", low: "Praktyczny, tradycyjny, preferuje rutynę.", high: "Kreatywny, ciekawy świata, otwarty na nowości." },
  C: { name: "Sumienność", low: "Spontaniczny, elastyczny, czasem zdezorganizowany.", high: "Zorganizowany, zdyscyplinowany, zorientowany na cel." },
  E: { name: "Ekstrawersja", low: "Spokojny, niezależny, ceniący samotność (Introwertyk).", high: "Towarzyski, energiczny, asertywny." },
  A: { name: "Ugodowość", low: "Rywalizujący, krytyczny, sceptyczny.", high: "Współczujący, ufny, chętny do współpracy." },
  N: { name: "Neurotyczność", low: "Spokojny, odporny na stres, stabilny emocjonalnie.", high: "Wrażliwy, podatny na stres, często odczuwający niepokój." }
};

const PersonalityTest = () => {
  const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');
  const hasAccess = saved.hasOsobowosc === true;

  const [step, setStep] = useState<'intro' | 'test' | 'calculating' | 'results'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [email, setEmail] = useState(saved.email || '');

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center relative z-10">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <Icons.Lock />
        </div>
        <h2 className="text-4xl font-bold mb-6 dark:text-white">Wymagany dostęp</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">Ten test jest dostępny po zakupie.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/platnosc?type=osobowosc&intent=start" className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-lg">
            Kup Test Osobowości za 4,99 PLN
          </Link>
        </div>
      </div>
    );
  }

  const handleEmailSave = () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    alert('Wyniki zostaną wysłane na podany adres e-mail.');
  };

  const handleAnswer = (val: number) => {
    if (selectedAnswer !== null) return; // Prevent double clicks
    setSelectedAnswer(val);

    setTimeout(() => {
      const newAnswers = [...answers, val];
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      if (currentQ < personalityQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        calculateResults(newAnswers);
      }
    }, 500); // 500ms delay for animation
  };

  const calculateResults = (finalAnswers: number[]) => {
    setStep('calculating');
    const raw = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    finalAnswers.forEach((ans, idx) => {
      const q = personalityQuestions[idx];
      const val = q.reverse ? (6 - ans) : ans;
      raw[q.trait as keyof typeof raw] += val;
    });

    const finalScores = {
      O: Math.round(((raw.O - 3) / 12) * 100),
      C: Math.round(((raw.C - 3) / 12) * 100),
      E: Math.round(((raw.E - 3) / 12) * 100),
      A: Math.round(((raw.A - 3) / 12) * 100),
      N: Math.round(((raw.N - 3) / 12) * 100),
    };

    setTimeout(() => {
      setScores(finalScores);
      setStep('results');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 min-h-[70vh] flex flex-col justify-center">
      {step === 'intro' && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Users className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-6 dark:text-white">Test Osobowości (Big Five)</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Poznaj swój unikalny profil psychologiczny oparty na najpopularniejszym i najbardziej wiarygodnym naukowo modelu Wielkiej Piątki. Test składa się z 15 pytań i zajmuje około 2 minut.
          </p>
          <button 
            onClick={() => setStep('test')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-500/30 transition-all hover:scale-105"
          >
            Rozpocznij Test
          </button>
        </div>
      )}

      {step === 'test' && (
        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="mb-12">
            <div className="flex justify-between text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">
              <span>Pytanie {currentQ + 1} z {personalityQuestions.length}</span>
              <span>{Math.round(((currentQ) / personalityQuestions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentQ) / personalityQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white leading-tight">
            "{personalityQuestions[currentQ].text}"
          </h2>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2">
            {[
              { val: 1, label: "Zdecydowanie nie zgadzam się", color: "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50" },
              { val: 2, label: "Raczej nie zgadzam się", color: "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50" },
              { val: 3, label: "Neutralnie", color: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700" },
              { val: 4, label: "Raczej zgadzam się", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50" },
              { val: 5, label: "Zdecydowanie zgadzam się", color: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50" }
            ].map((btn) => {
              const isSelected = selectedAnswer === btn.val;
              const isDimmed = selectedAnswer !== null && !isSelected;
              
              return (
                <button
                  key={btn.val}
                  onClick={() => handleAnswer(btn.val)}
                  disabled={selectedAnswer !== null}
                  className={`flex-1 w-full md:w-auto py-4 px-2 rounded-2xl text-sm font-bold transition-all duration-300 ${btn.color} flex flex-col items-center justify-center gap-2
                    ${isSelected ? 'scale-105 ring-4 ring-current shadow-lg' : ''}
                    ${isDimmed ? 'opacity-40 scale-95 grayscale' : 'hover:scale-105'}
                  `}
                >
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${isSelected ? 'border-current bg-current' : 'border-current opacity-50'}`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-center">{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 'calculating' && (
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-3xl font-bold dark:text-white mb-4">Analiza profilu psychologicznego...</h2>
          <p className="text-slate-500 dark:text-slate-400">Przetwarzanie wyników dla 5 wymiarów osobowości.</p>
        </div>
      )}

      {step === 'results' && scores && (
        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <div className="w-4 h-4"><Icons.Check /></div>
              <span className="ml-2">Analiza Zakończona</span>
            </div>
            <h2 className="text-4xl font-bold dark:text-white mb-4">Twój Profil Osobowości</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Poniżej znajduje się Twój wynik w modelu Wielkiej Piątki (OCEAN). Wyższe wartości oznaczają silniejsze natężenie danej cechy.
            </p>
          </div>

          <div className="space-y-8 mb-16">
            {Object.entries(scores).map(([key, value]) => {
              const val = value as number;
              const info = traitInfo[key as keyof typeof traitInfo];
              return (
                <div key={key} className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">{info.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {val > 66 ? info.high : val < 33 ? info.low : "Umiarkowane natężenie cechy, elastyczność w zachowaniu."}
                      </p>
                    </div>
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{val}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${val}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center mb-12">
            <h3 className="text-xl font-bold dark:text-white mb-4">Wyślij wyniki na e-mail</h3>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Twój e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <button 
                onClick={handleEmailSave}
                disabled={!email.includes('@')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                Wyślij
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/inne-testy" className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              Wróć do listy testów
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const MemoryTest = () => {
  const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');
  const hasAccess = saved.hasPamiec === true;

  const [step, setStep] = useState<'intro' | 'showing' | 'playing' | 'results'>('intro');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [wrongBlock, setWrongBlock] = useState<number | null>(null);
  const [email, setEmail] = useState(saved.email || '');

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center relative z-10">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <Icons.Lock />
        </div>
        <h2 className="text-4xl font-bold mb-6 dark:text-white">Wymagany dostęp</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">Ten test jest dostępny po zakupie.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/platnosc?type=pamiec&intent=start" className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-lg">
            Kup Test Pamięci za 4,99 PLN
          </Link>
        </div>
      </div>
    );
  }

  const handleEmailSave = () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    alert('Wyniki zostaną wysłane na podany adres e-mail.');
  };

  const startGame = () => {
    // Start with a sequence of 3 blocks
    const initialSeq = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
    setSequence(initialSeq);
    setLevel(1);
    playSequence(initialSeq);
  };

  const playSequence = (seq: number[]) => {
    setStep('showing');
    setUserStep(0);
    setActiveBlock(null);
    setWrongBlock(null);

    let i = 0;
    const interval = setInterval(() => {
      if (i < seq.length) {
        setActiveBlock(seq[i]);
        setTimeout(() => setActiveBlock(null), 400); // Light up for 400ms
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep('playing'), 400);
      }
    }, 800); // 800ms between blocks
  };

  const handleBlockClick = (index: number) => {
    if (step !== 'playing') return;

    if (index === sequence[userStep]) {
      // Correct click
      setActiveBlock(index);
      setTimeout(() => setActiveBlock(null), 200);

      if (userStep + 1 === sequence.length) {
        // Level complete!
        setStep('showing'); // Block further clicks
        setTimeout(() => {
          const newSeq = [...sequence, Math.floor(Math.random() * 9)];
          setSequence(newSeq);
          setLevel(level + 1);
          playSequence(newSeq);
        }, 1000);
      } else {
        setUserStep(userStep + 1);
      }
    } else {
      // Wrong click
      setWrongBlock(index);
      setStep('showing'); // Block further clicks
      setTimeout(() => {
        setStep('results');
      }, 1500);
    }
  };

  const getResultInterpretation = (capacity: number) => {
    if (capacity < 5) return { title: "Poniżej przeciętnej", desc: "Twój wynik wskazuje na nieco mniejszą pojemność pamięci roboczej niż średnia populacyjna. Może to wynikać ze zmęczenia lub rozkojarzenia." };
    if (capacity <= 6) return { title: "Przeciętnie (Norma)", desc: "Twój wynik mieści się w normie. Przeciętny dorosły potrafi zapamiętać sekwencję 5-7 elementów (tzw. Magiczna Liczba Millera)." };
    if (capacity <= 8) return { title: "Powyżej przeciętnej", desc: "Świetny wynik! Posiadasz bardzo dobrą pamięć przestrzenną i potrafisz utrzymać w uwadze więcej elementów niż większość ludzi." };
    return { title: "Wybitnie", desc: "Fenomenalny wynik! Twoja pamięć robocza działa na poziomie eksperckim. Prawdopodobnie świetnie radzisz sobie z zadaniami wymagającymi wielozadaniowości." };
  };

  const capacity = sequence.length - 1; // The length they successfully completed
  const interpretation = getResultInterpretation(capacity);

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 min-h-[70vh] flex flex-col justify-center">
      {step === 'intro' && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Grid3X3 className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-6 dark:text-white">Test Pamięci Przestrzennej</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Ten test (oparty na teście bloków Corsiego) mierzy pojemność Twojej pamięci roboczej. 
            Zapamiętaj sekwencję podświetlających się kafelków i odtwórz ją w tej samej kolejności. 
            Z każdym poziomem sekwencja wydłuża się o jeden element.
          </p>
          <button 
            onClick={startGame}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-500/30 transition-all hover:scale-105"
          >
            Rozpocznij Test
          </button>
        </div>
      )}

      {(step === 'showing' || step === 'playing') && (
        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-2xl mx-auto w-full">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">Poziom {level}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Długość sekwencji: {sequence.length}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-colors ${step === 'showing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 animate-pulse'}`}>
              {step === 'showing' ? 'Obserwuj...' : 'Twój ruch!'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <button
                key={i}
                onClick={() => handleBlockClick(i)}
                disabled={step !== 'playing'}
                className={`aspect-square rounded-2xl transition-all duration-300 ${
                  activeBlock === i 
                    ? 'bg-emerald-500 scale-105 shadow-lg shadow-emerald-500/50' 
                    : wrongBlock === i
                      ? 'bg-rose-500 scale-95 shadow-inner'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm'
                }`}
              ></button>
            ))}
          </div>
          
          <div className="text-center h-6">
            {wrongBlock !== null && (
              <span className="text-rose-500 font-bold animate-in fade-in slide-in-from-bottom-2">Błąd! Zła kolejność.</span>
            )}
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <div className="w-4 h-4"><Icons.Check /></div>
              <span className="ml-2">Koniec Gry</span>
            </div>
            <h2 className="text-4xl font-bold dark:text-white mb-4">Twój Wynik</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Dotarłeś do {level} poziomu.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center mb-12">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Pojemność pamięci roboczej</div>
            <div className="text-6xl font-black text-emerald-600 dark:text-emerald-400 mb-6">{capacity} <span className="text-2xl text-slate-400">elementów</span></div>
            
            <h3 className="text-xl font-bold dark:text-white mb-2">{interpretation.title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{interpretation.desc}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center mb-12">
            <h3 className="text-xl font-bold dark:text-white mb-4">Wyślij wyniki na e-mail</h3>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Twój e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
              <button 
                onClick={handleEmailSave}
                disabled={!email.includes('@')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                Wyślij
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
            >
              Spróbuj ponownie
            </button>
            <Link to="/inne-testy" className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all relative group">
              Inne testy
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const ConcentrationTest = () => {
  const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');
  const hasAccess = saved.hasKoncentracja === true;

  const [step, setStep] = useState<'intro' | 'playing' | 'results'>('intro');
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentTask, setCurrentTask] = useState({ word: '', colorValue: '', colorHex: '' });
  const [email, setEmail] = useState(saved.email || '');

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center relative z-10">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <Icons.Lock />
        </div>
        <h2 className="text-4xl font-bold mb-6 dark:text-white">Wymagany dostęp</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">Ten test jest dostępny po zakupie.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/platnosc?type=koncentracja&intent=start" className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-lg">
            Kup Test Koncentracji za 4,99 PLN
          </Link>
        </div>
      </div>
    );
  }

  const handleEmailSave = () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    alert('Wyniki zostaną wysłane na podany adres e-mail.');
  };

  const colors = [
    { name: 'CZERWONY', value: 'red', hex: '#ef4444', btnClass: 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50' },
    { name: 'NIEBIESKI', value: 'blue', hex: '#3b82f6', btnClass: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50' },
    { name: 'ZIELONY', value: 'green', hex: '#10b981', btnClass: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50' },
    { name: 'ŻÓŁTY', value: 'yellow', hex: '#eab308', btnClass: 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50' },
    { name: 'FIOLETOWY', value: 'purple', hex: '#8b5cf6', btnClass: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50' }
  ];

  const generateTask = () => {
    const wordObj = colors[Math.floor(Math.random() * colors.length)];
    let colorObj = colors[Math.floor(Math.random() * colors.length)];
    
    // Zwiększamy szansę na konflikt (Efekt Stroopa) do 70%
    if (Math.random() < 0.7) {
      while (colorObj.value === wordObj.value) {
        colorObj = colors[Math.floor(Math.random() * colors.length)];
      }
    }
    
    setCurrentTask({ word: wordObj.name, colorValue: colorObj.value, colorHex: colorObj.hex });
  };

  const startGame = () => {
    setScore(0);
    setErrors(0);
    setTimeLeft(30);
    setStep('playing');
    generateTask();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (step === 'playing' && timeLeft === 0) {
      setStep('results');
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleAnswer = (selectedColorValue: string) => {
    if (selectedColorValue === currentTask.colorValue) {
      setScore(s => s + 1);
    } else {
      setErrors(e => e + 1);
    }
    generateTask();
  };

  const getResultInterpretation = (correct: number, mistakes: number) => {
    const total = correct + mistakes;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    if (correct < 15) return { title: "Poniżej przeciętnej", desc: `Twój wynik wskazuje na trudności z utrzymaniem uwagi selektywnej. Skuteczność: ${accuracy}%. Może to być efekt zmęczenia lub silnego stresu.` };
    if (correct <= 25) return { title: "Przeciętnie (Norma)", desc: `Dobry wynik, mieszczący się w normie. Twój mózg radzi sobie z konfliktem poznawczym na standardowym poziomie. Skuteczność: ${accuracy}%.` };
    if (correct <= 35) return { title: "Powyżej przeciętnej", desc: `Świetna koncentracja! Posiadasz wysoką zdolność do ignorowania dystraktorów i skupiania się na właściwym zadaniu. Skuteczność: ${accuracy}%.` };
    return { title: "Wybitnie", desc: `Fenomenalny wynik! Twoja uwaga selektywna i szybkość przetwarzania informacji są na poziomie eksperckim. Skuteczność: ${accuracy}%.` };
  };

  const interpretation = getResultInterpretation(score, errors);

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 min-h-[70vh] flex flex-col justify-center">
      {step === 'intro' && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Target className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-6 dark:text-white">Test Koncentracji (Stroop)</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Ten test mierzy Twoją uwagę selektywną i odporność na dystraktory. 
            Twoim zadaniem jest wskazanie <strong>KOLORU CZCIONKI</strong>, ignorując znaczenie samego słowa. 
            Masz na to 30 sekund. Bądź szybki, ale dokładny!
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl max-w-md mx-auto mb-12 border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest font-bold">Przykład:</p>
            <div className="text-3xl font-black mb-4" style={{ color: '#3b82f6' }}>CZERWONY</div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Poprawna odpowiedź to <strong>Niebieski</strong> (ponieważ taki jest kolor liter).
            </p>
          </div>
          <button 
            onClick={startGame}
            className="bg-amber-500 hover:bg-amber-600 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-amber-500/30 transition-all hover:scale-105"
          >
            Rozpocznij Test
          </button>
        </div>
      )}

      {step === 'playing' && (
        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex justify-between items-center mb-12">
            <div className="flex space-x-8">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Punkty</p>
                <p className="text-2xl font-black text-emerald-500">{score}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Błędy</p>
                <p className="text-2xl font-black text-rose-500">{errors}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Czas</p>
              <p className={`text-3xl font-black ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`}>00:{timeLeft.toString().padStart(2, '0')}</p>
            </div>
          </div>

          <div className="h-48 flex items-center justify-center mb-12 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h2 
              className="text-5xl md:text-7xl font-black tracking-tighter uppercase"
              style={{ color: currentTask.colorHex }}
            >
              {currentTask.word}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => handleAnswer(c.value)}
                className={`py-4 px-2 rounded-2xl text-sm md:text-base font-bold transition-all hover:scale-105 active:scale-95 ${c.btnClass}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <div className="w-4 h-4"><Icons.Check /></div>
              <span className="ml-2">Czas minął</span>
            </div>
            <h2 className="text-4xl font-bold dark:text-white mb-4">Twój Wynik</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Test dobiegł końca. Oto podsumowanie Twojej koncentracji.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 text-center">
              <div className="text-sm font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-1">Poprawne</div>
              <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{score}</div>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30 text-center">
              <div className="text-sm font-bold text-rose-600/70 dark:text-rose-400/70 uppercase tracking-widest mb-1">Błędy</div>
              <div className="text-5xl font-black text-rose-600 dark:text-rose-400">{errors}</div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center mb-12">
            <h3 className="text-xl font-bold dark:text-white mb-2">{interpretation.title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{interpretation.desc}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center mb-12">
            <h3 className="text-xl font-bold dark:text-white mb-4">Wyślij wyniki na e-mail</h3>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Twój e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
              />
              <button 
                onClick={handleEmailSave}
                disabled={!email.includes('@')}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-700 transition-all disabled:opacity-50"
              >
                Wyślij
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
            >
              Spróbuj ponownie
            </button>
            <Link to="/inne-testy" className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all relative group">
              Inne testy
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const ReactionTest = () => {
  const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');
  const hasAccess = saved.hasReakcja === true;

  const [step, setStep] = useState<'intro' | 'waiting' | 'ready' | 'early' | 'result' | 'finished'>('intro');
  const [attempts, setAttempts] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [lastTime, setLastTime] = useState<number>(0);
  const [email, setEmail] = useState(saved.email || '');

  const MAX_ATTEMPTS = 5;

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center relative z-10">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <Icons.Lock />
        </div>
        <h2 className="text-4xl font-bold mb-6 dark:text-white">Wymagany dostęp</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">Ten test jest dostępny po zakupie.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/platnosc?type=reakcja&intent=start" className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-lg">
            Kup Test Reakcji za 4,99 PLN
          </Link>
        </div>
      </div>
    );
  }

  const handleEmailSave = () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    alert('Wyniki zostaną wysłane na podany adres e-mail.');
  };

  const startAttempt = () => {
    setStep('waiting');
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2 to 5 seconds
    const id = setTimeout(() => {
      setStartTime(Date.now());
      setStep('ready');
    }, delay);
    setTimeoutId(id);
  };

  const startGame = () => {
    setAttempts(0);
    setTimes([]);
    startAttempt();
  };

  const handleClick = () => {
    if (step === 'waiting') {
      if (timeoutId) clearTimeout(timeoutId);
      setStep('early');
    } else if (step === 'ready') {
      const reactionTime = Date.now() - startTime;
      setLastTime(reactionTime);
      const newTimes = [...times, reactionTime];
      setTimes(newTimes);
      setAttempts(a => a + 1);
      
      if (newTimes.length >= MAX_ATTEMPTS) {
        setStep('finished');
      } else {
        setStep('result');
      }
    } else if (step === 'early' || step === 'result') {
      startAttempt();
    }
  };

  const getResultInterpretation = (avgTime: number) => {
    // Średnia w testach przeglądarkowych to ok. 300-400ms (uwzględniając opóźnienia sprzętowe)
    if (avgTime < 250) return { title: "Wybitnie (Poziom e-sportowy)", desc: "Twój czas reakcji jest fenomenalny! Biorąc pod uwagę opóźnienia sprzętowe, masz refleks na poziomie profesjonalnych graczy." };
    if (avgTime <= 320) return { title: "Powyżej przeciętnej", desc: "Świetny wynik! Reagujesz szybciej niż większość populacji. Średni wynik w tym teście to około 350 ms." };
    if (avgTime <= 450) return { title: "Przeciętnie (Norma)", desc: "Twój wynik mieści się w normie. Średni czas reakcji na bodziec wzrokowy w testach internetowych (uwzględniając opóźnienie myszki i monitora) to około 350-400 ms." };
    return { title: "Poniżej przeciętnej", desc: "Twój czas reakcji jest nieco wolniejszy niż średnia (ok. 350 ms). Może to wynikać ze zmęczenia, braku skupienia lub używania sprzętu z dużym opóźnieniem (np. stary monitor lub myszka bezprzewodowa)." };
  };

  const averageTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const interpretation = getResultInterpretation(averageTime);

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 min-h-[70vh] flex flex-col justify-center">
      {step === 'intro' && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Zap className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-6 dark:text-white">Test Szybkości Reakcji</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Ten test mierzy Twój czas reakcji na bodziec wzrokowy w milisekundach. 
            Gdy czerwony ekran zmieni kolor na zielony, kliknij najszybciej jak potrafisz. 
            Test składa się z {MAX_ATTEMPTS} prób.
          </p>
          <button 
            onClick={startGame}
            className="bg-rose-600 hover:bg-rose-700 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-rose-500/30 transition-all hover:scale-105"
          >
            Rozpocznij Test
          </button>
        </div>
      )}

      {(step === 'waiting' || step === 'ready' || step === 'early' || step === 'result') && (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="mb-8 flex justify-between w-full px-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Próba {Math.min(attempts + 1, MAX_ATTEMPTS)} z {MAX_ATTEMPTS}</span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Średnia: {attempts > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : '---'} ms</span>
          </div>
          
          <button
            onClick={handleClick}
            className={`w-full aspect-video md:aspect-[21/9] rounded-[3rem] flex flex-col items-center justify-center text-white transition-colors duration-100 shadow-2xl ${
              step === 'waiting' ? 'bg-rose-500 hover:bg-rose-600 cursor-pointer' :
              step === 'ready' ? 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer' :
              step === 'early' ? 'bg-amber-500 hover:bg-amber-600 cursor-pointer' :
              'bg-blue-500 hover:bg-blue-600 cursor-pointer'
            }`}
          >
            {step === 'waiting' && (
              <>
                <div className="w-16 h-16 mb-6 opacity-80"><Icons.AlertTriangle /></div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Czekaj na zielony...</h2>
              </>
            )}
            {step === 'ready' && (
              <>
                <div className="w-16 h-16 mb-6 opacity-80"><Icons.Sun /></div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight">KLIKNIJ!</h2>
              </>
            )}
            {step === 'early' && (
              <>
                <div className="w-16 h-16 mb-6 opacity-80"><Icons.AlertTriangle /></div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Za wcześnie!</h2>
                <p className="text-xl font-medium opacity-80">Kliknij, aby spróbować ponownie.</p>
              </>
            )}
            {step === 'result' && (
              <>
                <div className="w-16 h-16 mb-6 opacity-80"><Icons.Clock /></div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">{lastTime} ms</h2>
                <p className="text-xl font-medium opacity-80">Kliknij, aby kontynuować.</p>
              </>
            )}
          </button>
        </div>
      )}

      {step === 'finished' && (
        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <div className="w-4 h-4"><Icons.Check /></div>
              <span className="ml-2">Test Zakończony</span>
            </div>
            <h2 className="text-4xl font-bold dark:text-white mb-4">Twój Wynik</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Oto podsumowanie Twojego czasu reakcji na podstawie {MAX_ATTEMPTS} prób.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center mb-12">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Średni czas reakcji</div>
            <div className="text-6xl font-black text-rose-600 dark:text-rose-400 mb-6">{averageTime} <span className="text-2xl text-slate-400">ms</span></div>
            
            <h3 className="text-xl font-bold dark:text-white mb-2">{interpretation.title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{interpretation.desc}</p>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-12">
            {times.map((t, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Próba {i + 1}</div>
                <div className="font-bold dark:text-white">{t} ms</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center mb-12">
            <h3 className="text-xl font-bold dark:text-white mb-4">Wyślij wyniki na e-mail</h3>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Twój e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
              />
              <button 
                onClick={handleEmailSave}
                disabled={!email.includes('@')}
                className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all disabled:opacity-50"
              >
                Wyślij
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20"
            >
              Spróbuj ponownie
            </button>
            <Link to="/inne-testy" className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all relative group">
              Inne testy
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const OtherTests = () => {
  const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');

  const tests = [
    {
      id: 'osobowosc',
      title: 'Test Osobowości',
      price: '4,99 PLN',
      desc: 'Poznaj swój unikalny profil psychologiczny oparty na modelu Wielkiej Piątki (Big Five).',
      icon: <Users className="w-full h-full" />,
      color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      status: 'Dostępny',
      link: '/test-osobowosci',
      hasAccess: saved.hasOsobowosc === true
    },
    {
      id: 'pamiec',
      title: 'Test Pamięci Przestrzennej',
      price: '4,99 PLN',
      desc: 'Sprawdź pojemność swojej pamięci krótkotrwałej i roboczej w serii interaktywnych zadań.',
      icon: <Grid3X3 className="w-full h-full" />,
      color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      status: 'Dostępny',
      link: '/test-pamieci',
      hasAccess: saved.hasPamiec === true
    },
    {
      id: 'koncentracja',
      title: 'Test Koncentracji',
      price: '4,99 PLN',
      desc: 'Zmierz swoją zdolność do utrzymania uwagi i ignorowania dystraktorów.',
      icon: <Target className="w-full h-full" />,
      color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      status: 'Dostępny',
      link: '/test-koncentracji',
      hasAccess: saved.hasKoncentracja === true
    },
    {
      id: 'reakcja',
      title: 'Szybkość Reakcji',
      price: '4,99 PLN',
      desc: 'Zbadaj swój czas reakcji na bodźce wzrokowe i słuchowe w milisekundach.',
      icon: <Zap className="w-full h-full" />,
      color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
      status: 'Dostępny',
      link: '/test-reakcji',
      hasAccess: saved.hasReakcja === true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-32 px-6 relative z-10">
      <div className="text-center mb-20 relative">
        <div className="inline-block relative">
          <h2 className="text-5xl font-bold mb-6 dark:text-white relative z-10">Inne testy</h2>
          
          {/* Decorative animated circles behind title */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 rounded-full blur-3xl -z-10"
          />
        </div>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-4">
          Rozwijamy naszą platformę o kolejne narzędzia psychometryczne. Każdy test dostępny jest indywidualnie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tests.map(test => (
          <div key={test.id} className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all group flex flex-col hover:shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${test.color}`}>
                <div className="w-8 h-8">{test.icon}</div>
              </div>
              <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${test.status === 'Dostępny' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {test.status}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-2 dark:text-white">{test.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10 flex-1">
              {test.desc}
            </p>
            {test.link && test.hasAccess ? (
              <Link to={test.link} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-500/20">
                <span>Rozpocznij Test</span>
              </Link>
            ) : test.link && !test.hasAccess ? (
              <Link to={`/platnosc?type=${test.id}`} className="w-full bg-slate-800 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all hover:bg-slate-700 shadow-lg">
                <div className="w-5 h-5 mr-2"><Icons.Lock /></div>
                <span>Kup za {test.price}</span>
              </Link>
            ) : (
              <button disabled className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 cursor-not-allowed">
                <span>Dostępne wkrótce</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FAQ = () => (
  <div className="max-w-4xl mx-auto py-32 px-6 relative z-10">
    <h2 className="text-5xl font-bold mb-20 text-center dark:text-white">Częste pytania</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {[
        { q: "Czy test jest w pełni anonimowy?", a: "Tak, Twoje dane osobowe nie są wymagane do rozpoczęcia testu. Adres e-mail prosimy podać jedynie w celu przesłania gotowego raportu i certyfikatu po zakończeniu badania." },
        { q: "Ile trwa test i ile ma pytań?", a: "Czas trwania i liczba pytań zależą od wybranego badania. Standardowy test IQ oraz Analiza PRO składają się z 30 zadań (ok. 15 min). Inne testy specjalistyczne, jak test osobowości (15 pytań) czy testy szybkości reakcji, mają własne, krótsze ramy czasowe." },
        { q: "Czym różni się wersja Standard od Analizy PRO?", a: "Wersja Standard zawiera wynik punktowy i certyfikat. Analiza PRO to rozszerzony raport badający 5 kluczowych domen poznawczych, Twój percentyl na tle populacji oraz spersonalizowane wskazówki rozwojowe." },
        { q: "Jak i kiedy otrzymam swój wynik?", a: "Wynik zobaczysz na ekranie natychmiast po zakończeniu testu. Pełny dostęp do analizy oraz certyfikat zostaną odblokowane w profilu i wysłane na Twój adres e-mail w ciągu kilku minut od zakupu." },
        { q: "Czy certyfikat jest uznawany oficjalnie?", a: "Nasz test opiera się na uznanych metodach psychometrycznych, jednak certyfikat ma charakter edukacyjno-rozwojowy. Nie zastępuje on diagnozy klinicznej ani oficjalnych testów Mensy." },
        { q: "Co jeśli nie otrzymałem e-maila z raportem?", a: "Najpierw sprawdź folder SPAM. Jeśli raportu nadal nie ma, skontaktuj się z naszym wsparciem pod adresem kontakt@iq-metric.pl – prześlemy go ponownie niezwłocznie." },
        { q: "Czy mogę powtórzyć test?", a: "Możesz powtórzyć test, jednak pamiętaj, że efekt uczenia się może sztucznie zawyżyć wynik. Dla rzetelnej oceny zalecamy zachowanie odstępu czasowego." },
        { q: "Jakie metody płatności są dostępne?", a: "Obsługujemy bezpieczne płatności online, w tym BLIK, szybkie przelewy oraz karty płatnicze za pośrednictwem certyfikowanych operatorów." }
      ].map((item, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h4 className="font-bold text-xl mb-6 dark:text-white leading-tight">{item.q}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-prose">{item.a}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- ABOUT METHOD PAGE ---

const AboutMethod = ({ openPurchaseModal }: { openPurchaseModal: () => void }) => {
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
    }
  }, [location]);

  const sections = [
    { id: "co-mierzymy", title: "1. Co mierzy ten test?" },
    { id: "format-czas", title: "2. Format i czas" },
    { id: "jak-liczymy", title: "3. Jak liczymy wynik" },
    { id: "analiza-pro", title: "4. Analiza PRO" },
    { id: "nie-diagnoza", title: "5. To nie jest diagnoza" },
    { id: "slownik", title: "6. Słownik pojęć" }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-24 flex flex-col md:flex-row gap-20 relative z-10">
      {/* Sidebar TOC */}
      <aside className="md:w-80 shrink-0 md:sticky md:top-28 h-fit hidden md:block">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Nawigacja metodologii</h4>
        <nav className="space-y-2">
          {sections.map(s => (
            <a 
              key={s.id} 
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', `#${s.id}`);
                setActiveSection(s.id);
              }}
              className={`block text-sm py-3.5 px-6 rounded-2xl transition-all ${activeSection === s.id ? 'bg-blue-600 text-white font-bold shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {s.title}
            </a>
          ))}
        </nav>
      </aside>

      {/* Full Content Area */}
      <article className="flex-1 space-y-32">
        <div id="co-mierzymy" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Co mierzy ten test?</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg max-w-prose">
            Nasz pomiar koncentruje się na tzw. <strong>inteligencji płynnej</strong> — zdolności do rozwiązywania nowych, abstrakcyjnych problemów bez opierania się na nabytej wiedzy czy kulturze. To procesy takie jak rozpoznawanie relacji, dedukcja i synteza wzorców.
          </p>
        </div>

        <div id="format-czas" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Format i czas</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-10 max-w-prose">Nasz test został zaprojektowany tak, aby zoptymalizować czas pomiaru przy zachowaniu maksymalnej precyzji psychometrycznej:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px]">
            <div className="p-8 bg-white dark:bg-slate-900 border rounded-3xl border-blue-200 shadow-sm">
              <h4 className="font-bold text-lg mb-3">Struktura testu</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Test składa się z 30 zadań podzielonych na 5 domen poznawczych (matryce, ciągi liczbowe, analogie, wyobraźnia przestrzenna, logika).</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 border rounded-3xl shadow-sm">
              <h4 className="font-bold text-lg mb-3">Limit czasu (15 min)</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Masz średnio 30 sekund na zadanie. Czas ten wymusza sprawne procesowanie informacji, co jest kluczowym elementem inteligencji płynnej.</p>
            </div>
          </div>
        </div>

        <div id="jak-liczymy" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Jak liczymy wynik</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-12 max-w-prose">
            Nie stosujemy prostego przeliczania "ilość poprawnych odpowiedzi = IQ". Nasz algorytm opiera się na zaawansowanym modelu psychometrycznym:
          </p>
          <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-12 max-w-prose space-y-4">
            <li><strong>Wagi trudności:</strong> Każde zadanie ma przypisaną wagę (od 1 do 5). Rozwiązanie trudnego problemu daje znacznie więcej punktów niż łatwego.</li>
            <li><strong>Z-Score:</strong> Twój wynik surowy jest porównywany ze średnią populacyjną, aby obliczyć odchylenie standardowe (Z-Score).</li>
            <li><strong>Skala Wechslera:</strong> Z-Score jest przeliczany na klasyczną skalę IQ, gdzie średnia populacyjna wynosi równe 100 punktów, a jedno odchylenie standardowe to 15 punktów.</li>
          </ul>
          
          <ScoreGenerationInfographic />
          
          <p className="text-base text-slate-500 leading-relaxed italic mt-12 max-w-prose">
            Powyższa infografika przedstawia uproszczony schemat procesowania danych psychometrycznych przez nasz autorski silnik obliczeniowy.
          </p>
        </div>

        <div id="analiza-pro" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Analiza PRO</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-10 max-w-prose">
            Wersja PRO naszego testu to nie tylko wynik punktowy, ale kompleksowa mapa Twojego potencjału intelektualnego. Analiza ta pozwala na głębsze zrozumienie procesów poznawczych, które są Twoją najsilniejszą stroną.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { t: "5 Domen Poznawczych", d: "Szczegółowy podział na logikę, matematykę, orientację przestrzenną, analogie i sekwencje." },
              { t: "Percentyl Populacyjny", d: "Dokładne określenie Twojej pozycji na tle statystycznej setki osób o podobnym profilu." },
              { t: "Rekomendacje", d: "Spersonalizowane wskazówki dotyczące rozwoju Twoich najsilniejszych i najsłabszych stron." }
            ].map(item => (
              <div key={item.t} className="p-8 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-[2.5rem]">
                <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3">{item.t}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <h4 className="text-xl font-bold mb-6 dark:text-white">Dlaczego warto wybrać Analizę PRO?</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Standardowy wynik IQ to tylko liczba. Analiza PRO tłumaczy tę liczbę na konkretne kompetencje. Dowiesz się, czy Twoja inteligencja ma charakter bardziej matematyczno-logiczny, czy może opiera się na wybitnej wyobraźni przestrzennej. To narzędzie, które pomaga w planowaniu ścieżki edukacyjnej i zawodowej.
            </p>
            <div className="flex items-center space-x-4 text-blue-600 font-bold">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <Icons.Check className="w-6 h-6" />
              </div>
              <span>Pełna analiza wszystkich 5 domen poznawczych</span>
            </div>
          </div>
        </div>

        <div id="nie-diagnoza" className="scroll-mt-32">
          <div className="bg-red-50 dark:bg-red-900/10 p-12 md:p-16 rounded-[4rem] border border-red-100 dark:border-red-900/40 max-w-[1000px]">
            <h2 className="text-3xl font-bold mb-6 text-red-900 dark:text-red-400">To nie jest diagnoza kliniczna</h2>
            <p className="text-lg text-red-800 dark:text-red-400/80 leading-relaxed max-w-prose">
              Pomiar wykonany przez serwis <BrandName className="text-lg" /> ma charakter wyłącznie edukacyjno-rozrywkowy. Nie zastępuje profesjonalnej diagnozy psychologicznej, badań klinicznych ani orzekania o stanie zdrowia. Oficjalne testy IQ (jak WAIS-IV) powinny być przeprowadzane stacjonarnie u licencjonowanego psychologa.
            </p>
          </div>
        </div>

        <div id="slownik" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-12 dark:text-white">Słownik pojęć</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px]">
            {[
              { t: "IQ Score", d: "Standardowy wskaźnik sprawności procesów poznawczych na skali populacyjnej." },
              { t: "Przedział Ufności", d: "Zakres statystyczny (np. ±5 pkt), w którym z dużym prawdopodobieństwem znajduje się Twój wynik rzeczywisty." },
              { t: "Inteligencja Płynna", d: "Zdolność do myślenia logicznego i szybkiego rozwiązywania problemów w nowych, abstrakcyjnych sytuacjach." },
              { t: "Percentyl", d: "Miara położenia, określająca Twoje miejsce w szeregu na tle statystycznej setki osób." }
            ].map(i => (
              <div key={i.t} className="p-8 border border-slate-100 dark:border-slate-800 rounded-3xl">
                <h5 className="font-bold text-blue-600 mb-2 text-lg">{i.t}</h5>
                <p className="text-sm text-slate-500 leading-relaxed">{i.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-20">
          <button 
            onClick={openPurchaseModal}
            className="bg-blue-600 text-white px-16 py-6 rounded-3xl font-bold shadow-2xl hover:bg-blue-700 transition-all text-xl"
          >
            Rozpocznij test
          </button>
        </div>
      </article>
    </div>
  );
};

const PurchaseModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Wybierz swój test IQ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Standard */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col">
              <h3 className="text-xl font-bold mb-2 dark:text-white text-center">Test Standard</h3>
              <div className="text-slate-500 font-black text-3xl mb-4 text-center">4,99 PLN</div>
              <p className="text-slate-500 text-xs leading-relaxed mb-6 text-center flex-1">
                Klasyczny pomiar inteligencji płynnej. Oficjalny certyfikat z Twoim wynikiem punktowym oraz podstawowe podsumowanie wysłane na e-mail.
              </p>
              <Link to="/platnosc?intent=start" onClick={onClose} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-700 transition-all text-sm">
                Rozpocznij Standard
              </Link>
            </div>

            {/* PRO */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border-2 border-blue-500 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Najczęściej wybierany</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white text-center">Analiza PRO</h3>
              <div className="text-blue-600 dark:text-blue-400 font-black text-3xl mb-4 text-center">9,99 PLN</div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-6 text-center flex-1">
                Pełny raport z analizą 5 domen poznawczych, percentylem oraz spersonalizowanymi rekomendacjami rozwoju wysłanymi na e-mail.
              </p>
              <Link to="/platnosc?type=pro&intent=start" onClick={onClose} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-500/20">
                Wybierz Analizę PRO
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link to="/inne-testy" onClick={onClose} className="inline-flex items-center justify-center space-x-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-semibold transition-colors">
              <span>Zobacz inne testy</span>
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP ROOT ---

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
        <BackgroundMotif />
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} openPurchaseModal={() => setIsPurchaseModalOpen(true)} />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home openPurchaseModal={() => setIsPurchaseModalOpen(true)} />} />
            <Route path="/test" element={<TestSession />} />
            <Route path="/wynik" element={<Results />} />
            <Route path="/platnosc" element={<Checkout />} />
            <Route path="/raport" element={<Report openPurchaseModal={() => setIsPurchaseModalOpen(true)} />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/metoda" element={<AboutMethod openPurchaseModal={() => setIsPurchaseModalOpen(true)} />} />
            <Route path="/inne-testy" element={<OtherTests />} />
            <Route path="/test-osobowosci" element={<PersonalityTest />} />
            <Route path="/test-pamieci" element={<MemoryTest />} />
            <Route path="/test-koncentracji" element={<ConcentrationTest />} />
            <Route path="/test-reakcji" element={<ReactionTest />} />
            <Route path="/prywatnosc" element={<div className="max-w-3xl mx-auto py-32 px-6"><h2>Polityka Prywatności</h2></div>} />
            <Route path="/regulamin" element={<div className="max-w-3xl mx-auto py-32 px-6"><h2>Regulamin</h2></div>} />
            <Route path="*" element={<div className="p-32 text-center text-2xl font-bold">404 - Strony nie znaleziono</div>} />
          </Routes>
        </main>
        <Footer openPurchaseModal={() => setIsPurchaseModalOpen(true)} />
        <PurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} />
      </div>
    </HashRouter>
  );
};

export default App;
