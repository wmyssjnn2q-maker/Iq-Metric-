
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Grid3X3, Target, Zap, ArrowRight, Search, Cpu, Dna, Lightbulb, Atom, LayoutDashboard, TrendingUp, ShieldCheck, Briefcase, Layout, BarChart3, Globe, Rocket, Award, BadgeCheck, Fingerprint, Star, ArrowUpCircle, CheckCircle2, Brain, Percent, Info, PieChart, BrainCircuit, Activity, Trophy, AreaChart, ClipboardList, Check, Clock, Sun, Moon, AlertTriangle, Lock, Mail, Layers, LayoutGrid, Eye, Gauge, ClipboardCheck, SlidersHorizontal } from 'lucide-react';
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
import { IQ_AGE_BRACKETS, getAgeBracketById } from './ageBrackets';
import { QUESTIONS } from './questions';
import { Icons, COLORS, Logos } from './constants';
import { generateDetailedReport } from './services/geminiService';
import {
  DOMAIN_ITEMS,
  buildPlanFromDomains,
  resolveDevelopmentPlan,
  getDomainLevel,
  normalizeDiffLabel,
  type PlanStep,
} from './reportHelpers';
import { REGULAMIN_MARKDOWN } from './regulaminContent';
import { PRIVACY_POLICY_MARKDOWN } from './privacyPolicyContent';
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
  <span className={`font-display tracking-tight antialiased ${className}`}>
    <span className="font-black text-slate-950 dark:text-white">Brain</span>
    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
      mediq
    </span>
  </span>
);

const BrandLogo = ({ size = "nav", className = "" }: { size?: "nav" | "footer" | "hero", className?: string }) => {
  const isNav = size === "nav";
  const isFooter = size === "footer";
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`${isNav ? 'h-9 w-9 rounded-2xl' : isFooter ? 'h-12 w-12 rounded-3xl' : 'h-16 w-16 rounded-[1.6rem]'} flex items-center justify-center bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-1 ring-blue-400/30 transition-colors`}>
        <Logos.BrainGrid 
          size={isNav ? 24 : isFooter ? 32 : 42} 
        />
      </div>
      <BrandName className={isNav ? 'text-xl' : isFooter ? 'text-2xl' : 'text-5xl'} />
    </div>
  );
};

const buildResultEmailHtml = ({
  title,
  subtitle,
  summary,
  rows,
}: {
  title: string;
  subtitle: string;
  summary: string;
  rows: Array<{ label: string; value: string | number }>;
}) => {
  const year = new Date().getFullYear();
  const rowsHtml = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px">${row.label}</td>
          <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;text-align:right;color:#0f172a;font-size:14px;font-weight:800">${row.value}</td>
        </tr>`,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08)">
        <tr><td style="background:#1e293b;padding:34px 44px;text-align:center">
          <p style="margin:0;font-size:11px;font-weight:800;color:#94a3b8;letter-spacing:0.2em;text-transform:uppercase">brainmediq</p>
          <h1 style="margin:8px 0 0;font-size:28px;font-weight:900;color:#ffffff">${title}</h1>
          <p style="margin:10px 0 0;font-size:13px;color:#cbd5e1">${subtitle}</p>
        </td></tr>
        <tr><td style="padding:34px 44px 20px">
          <h2 style="margin:0 0 10px;font-size:20px;font-weight:900;color:#0f172a">Twoje wyniki są gotowe</h2>
          <p style="margin:0;color:#64748b;line-height:1.7;font-size:15px">${summary}</p>
        </td></tr>
        <tr><td style="padding:0 44px 34px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;background:#f8fafc">
            ${rowsHtml}
          </table>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:22px 44px;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6">
            © ${year} brainmediq Polska · kontakt@brainmediq.com<br>
            Ta wiadomość została wygenerowana automatycznie po zakończeniu testu.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

const sendResultEmail = async ({
  to,
  subject,
  title,
  subtitle,
  summary,
  rows,
}: {
  to: string;
  subject: string;
  title: string;
  subtitle: string;
  summary: string;
  rows: Array<{ label: string; value: string | number }>;
}) => {
  if (!to.includes('@')) throw new Error('Podaj poprawny adres e-mail.');

  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      subject,
      html: buildResultEmailHtml({ title, subtitle, summary, rows }),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'Nie udało się wysłać wiadomości.');
  }
};

// --- VISUAL COMPONENTS FOR REPORT ---

const DomainBar = ({
  label,
  value,
  desc,
  level,
  animate,
}: {
  label: string;
  value: number;
  desc: string;
  level: string;
  animate: boolean;
}) => {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-2xl font-black tabular-nums text-blue-600 dark:text-blue-400">{pct}%</span>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{level}</p>
        </div>
      </div>
      <div
        className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${pct}%`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, minWidth: pct > 0 ? '4px' : 0 }}
        />
      </div>
    </div>
  );
};

const DomainProfilePanel = ({
  domainScores,
  animate,
}: {
  domainScores: UserStats['domainScores'];
  animate: boolean;
}) => (
  <div className="space-y-4">
    <p className="text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
      Każdy pasek pokazuje wynik w danej części testu (0–100%). Im wyżej, tym więcej poprawnych odpowiedzi w tej kategorii.
    </p>
    {DOMAIN_ITEMS.map((d) => {
      const value = domainScores[d.key] ?? 0;
      const { label: level } = getDomainLevel(value);
      return (
        <DomainBar label={d.label} value={value} desc={d.desc} level={level} animate={animate} />
      );
    })}
  </div>
);

const DevelopmentPlanPanel = ({ steps }: { steps: PlanStep[] }) => (
  <div className="space-y-6">
    <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Jak korzystać z planu</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Masz 5 krótkich kroków — od obszaru, który wymaga najwięcej uwagi, do utrwalenia mocnych stron. Wykonuj po jednym kroku dziennie.
      </p>
    </div>
    <ol className="space-y-4">
      {steps.map((rec, i) => (
        <li
          key={`${rec.title}-${i}`}
          className="list-none rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
              {i + 1}
            </span>
            <h5 className="flex-1 text-base font-bold text-slate-800 dark:text-slate-100">{rec.title}</h5>
          </div>
          {rec.domainLabel && (
            <p className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">Obszar: {rec.domainLabel}</p>
          )}
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              ⏱ {rec.time}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {normalizeDiffLabel(rec.diff)}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{rec.desc}</p>
        </li>
      ))}
    </ol>
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
        <span>Dolna połowa</span>
        <span>Średnia (50%)</span>
        <span>Górna połowa</span>
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
    <div className="relative flex h-64 w-64 items-center justify-center rounded-[4rem] bg-white text-blue-600 shadow-2xl shadow-blue-600/10 ring-1 ring-blue-100 dark:bg-slate-900 dark:text-blue-400 dark:ring-blue-900/40">
      <Logos.BrainGrid size={180} />
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
            Nasza baza danych jest stale aktualizowana o wyniki tysięcy użytkowników z całego globu. Zobacz, jak wypadają inne kraje.
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
                            x={-85}
                            y={-42}
                            width={170}
                            height={32}
                            rx={16}
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
  const [activeTab, setActiveTab] = useState("domeny");
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
      confidenceInterval: [108, 116],
      ageBracketId: '25-34',
      ageBracketLabel: '25–34 lata',
    },
    analysis: {
      summary: "Twój wynik (112) jest bardzo wysoki. Świetnie radzisz sobie z logicznym myśleniem i szybkim kojarzeniem faktów w codziennych sytuacjach.",
      strengths: ["Bardzo szybkie łączenie faktów", "Łatwe wyłapywanie reguł i wzorców", "Skuteczne oddzielanie ważnych informacji od szumu"],
      weaknesses: ["Wyobraźnia przestrzenna — warto poćwiczyć", "Skupienie przy wielu zadaniach naraz"],
      careerPaths: ["Analityk Danych", "Architekt Systemów", "Strateg Biznesowy"],
      personalityTraits: ["Analityczność", "Skrupulatność", "Kreatywne rozwiązywanie problemów"],
      recommendations: []
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
                  "{analysis?.summary || `Twój wynik (${stats.iqScore}) jest bardzo dobry. Wykazujesz sprawne i logiczne myślenie.`}"
                </p>
                {stats.ageBracketLabel && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    Norma odniesienia: <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.ageBracketLabel}</span>
                  </p>
                )}
              </div>
            </div>
            {data.isPro && (
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
              <BrainCircuit size={20} className="text-blue-500" /> Profil 5 domen
            </h4>
            <DomainProfilePanel domainScores={stats.domainScores} animate={animate} />
          </div>
        );
      case "percentyl":
        return (
          <div className="space-y-8 animate-in animate-slide-in-from-bottom duration-500">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl">
              <h4 className="font-bold text-center mb-4 flex items-center justify-center gap-2">
                <Percent size={20} className="text-blue-500" /> Pozycja w populacji: {stats.percentile}%
              </h4>
              <p className="text-xs text-slate-500 text-center mb-8 px-6">
                {stats.iqScore >= 90 && stats.iqScore <= 110 
                  ? `Twój wynik mieści się w standardowej normie intelektualnej (którą dzieli ok. 50% populacji). Wynik ten wskazuje na pełną sprawność procesów poznawczych.`
                  : `Twój wynik wskazuje, że jesteś sprawniejszy poznawczo niż ${stats.percentile}% populacji w naszym modelu referencyjnym.`
                }
              </p>
              {stats.ageBracketLabel && (
                <p className="text-[11px] text-slate-500 text-center mb-6 px-6 leading-relaxed">
                  Percentyl i skala IQ są liczone względem zadeklarowanej grupy wiekowej: <strong>{stats.ageBracketLabel}</strong>.
                  Porównanie dotyczy modelu referencyjnego w obrębie tej grupy, a nie całej populacji bez podziału wieku.
                </p>
              )}
              <PercentileAxis val={stats.percentile} animate={animate} label={`Twój wynik: ${stats.percentile}%`} />
            </div>
          </div>
        );
      case "rekomendacje": {
        const planSteps = resolveDevelopmentPlan(stats.domainScores, analysis?.recommendations);
        return (
          <div className="space-y-6 animate-in animate-slide-in-from-bottom duration-500">
            <h4 className="font-bold text-center flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
              <Rocket size={20} className="text-blue-500" /> Plan rozwoju — 5 kroków
            </h4>
            <DevelopmentPlanPanel steps={planSteps} />
          </div>
        );
      }
      case "certyfikat":
        return (
          <div className="animate-in animate-slide-in-from-bottom duration-500 flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border-8 border-slate-50 dark:border-slate-800 p-10 rounded-[2rem] shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/5 rounded-full -ml-12 -mb-12"></div>
              
              <div className="text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <Logos.BrainGrid size={36} />
                  </div>
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
    { id: "podsumowanie", label: data.isPro ? "Podsumowanie" : "Twój Wynik", icon: <ClipboardList size={16} /> },
    ...(data.isPro ? [
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {data.isPro ? 'Analiza PRO' : data.isPaid ? 'Wynik Standard' : 'Przykład Analizy'}
            </span>
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
              <Link 
                to="/test"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-all text-center"
              >
                Rozpocznij Test IQ
              </Link>
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
              Raport to nie tylko jedna liczba. To szczegółowa analiza Twoich umiejętności. Zobacz, jak wyglądają wyniki:
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
                { id: 'osobowosc', title: 'Test Osobowości', icon: <Layers />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', link: '/test-osobowosci', desc: 'Odkryj swój profil psychologiczny i dominujące cechy charakteru.' },
                { id: 'pamiec', title: 'Test Pamięci', icon: <LayoutGrid />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', link: '/test-pamieci', desc: 'Sprawdź pojemność swojej pamięci roboczej i zdolność zapamiętywania.' },
                { id: 'koncentracja', title: 'Test Koncentracji', icon: <Eye />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', link: '/test-koncentracji', desc: 'Zmierz swoją odporność na dystraktory i zdolność skupienia uwagi.' },
                { id: 'reakcja', title: 'Szybkość Reakcji', icon: <Gauge />, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', link: '/test-reakcji', desc: 'Zbadaj swój czas reakcji na bodźce wzrokowe w milisekundach.' },
                // Duplicate for loop
                { id: 'osobowosc-2', title: 'Test Osobowości', icon: <Layers />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', link: '/test-osobowosci', desc: 'Odkryj swój profil psychologiczny i dominujące cechy charakteru.' },
                { id: 'pamiec-2', title: 'Test Pamięci', icon: <LayoutGrid />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', link: '/test-pamieci', desc: 'Sprawdź pojemność swojej pamięci roboczej i zdolność zapamiętywania.' },
                { id: 'koncentracja-2', title: 'Test Koncentracji', icon: <Eye />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', link: '/test-koncentracji', desc: 'Zmierz swoją odporność na dystraktory i zdolność skupienia uwagi.' },
                { id: 'reakcja-2', title: 'Szybkość Reakcji', icon: <Gauge />, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', link: '/test-reakcji', desc: 'Zbadaj swój czas reakcji na bodźce wzrokowe w milisekundach.' },
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
                {["19 pytań", "Wynik + Certyfikat", "Wysyłka na e-mail"].map(tag => (
                  <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{tag}</span>
                ))}
              </div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white text-center relative z-10">Test Standard</h3>
              <div className="text-slate-500 font-black text-4xl mb-6 text-center relative z-10">4,99 PLN</div>
              <p className="text-slate-500 text-xs leading-relaxed mb-10 text-center flex-1 relative z-10">
                Dokładny pomiar IQ, oficjalny certyfikat oraz krótkie podsumowanie wyników wysłane na e-mail. Tylko 4,99 PLN.
              </p>
              <Link to="/test" className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-700 transition-all shadow-xl text-sm relative z-10">
                <span>Rozpocznij Test</span>
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
                Kompletny raport: analiza 5 umiejętności, Twoja pozycja na tle innych oraz wskazówki jak ćwiczyć mózg. Wszystko na e-mail.
              </p>
              <Link to="/test" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-xl text-sm relative z-10">
                <span>Rozpocznij Test</span>
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
    const qCount = QUESTIONS.length;

    const byId = (a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id);

    const easyPool = QUESTIONS.filter(q => q.difficulty <= 4).sort((a, b) => a.difficulty - b.difficulty || byId(a, b));
    const mediumPool = QUESTIONS.filter(q => q.difficulty >= 5 && q.difficulty <= 7).sort((a, b) => a.difficulty - b.difficulty || byId(a, b));
    const hardPool = QUESTIONS.filter(q => q.difficulty >= 8).sort((a, b) => a.difficulty - b.difficulty || byId(a, b));

    const takeFromPool = (pool: Question[], count: number) => pool.slice(0, Math.min(count, pool.length));

    const easyPart = takeFromPool(easyPool, 10);
    const mediumPart = takeFromPool(mediumPool, 10);
    const hardPart = takeFromPool(hardPool, 10);

    let selectedQuestions: Question[] = [...easyPart, ...mediumPart, ...hardPart];

    if (selectedQuestions.length < qCount) {
      const usedIds = new Set(selectedQuestions.map(q => q.id));
      const fallback = QUESTIONS.filter(q => !usedIds.has(q.id)).sort((a, b) => a.difficulty - b.difficulty || byId(a, b));
      selectedQuestions = selectedQuestions.concat(fallback.slice(0, qCount - selectedQuestions.length));
    }
    
    setState({
      currentQuestionIndex: 0,
      answers: new Array(selectedQuestions.length).fill(null),
      startTime: null,
      endTime: null,
      questions: selectedQuestions,
      isFinished: false,
      ageBracketId: null,
    });

    setTimeLeft(14 * 60);
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
    const stats = calculateStats(state.questions, results, state.ageBracketId);
    
    const existingSaved = JSON.parse(localStorage.getItem('iq_results') || '{}');
    const bracket = getAgeBracketById(state.ageBracketId);
    
    // Create new results, explicitly resetting Pro/Max status and old analysis
    const newResults = {
      ...existingSaved,
      stats,
      ageBracketId: bracket.id,
      ageBracketLabel: bracket.label,
      timestamp: Date.now(),
      isPaid: false,
      isPro: false,
      isMax: false
    };
    
    // Remove old analysis if it exists
    delete (newResults as any).analysis;
    
    localStorage.setItem('iq_results', JSON.stringify(newResults));
    navigate('/wynik');
  };

  const calculateStats = (
    questions: Question[],
    answers: (number | null)[],
    ageBracketId: string | null,
  ): UserStats => {
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

    const bracket = getAgeBracketById(ageBracketId);

    // Psychometryczne mapowanie — średnia i rozrzut zależą od zadeklarowanej grupy wiekowej (uproszczona norma).
    const meanRaw = maxRawScore * bracket.meanRawFactor;
    const stdDevRaw = maxRawScore * bracket.stdRawFactor;

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
      const rawPct = (domainCorrect[key] / (domainTotal[key] || 1)) * 100;
      // Normalizacja wizualna: 45% (średnia) -> 50% na pasku
      let uiScore;
      if (rawPct <= 45) {
        uiScore = (rawPct / 45) * 50;
      } else {
        uiScore = 50 + ((rawPct - 45) / 55) * 50;
      }
      domainScores[key] = Math.round(uiScore);
    });

    return {
      iqScore,
      percentile,
      domainScores,
      confidenceInterval: [iqScore - 4, iqScore + 4],
      ageBracketId: bracket.id,
      ageBracketLabel: bracket.label,
    };
  };

  if (!state) return <div className="p-20 text-center dark:text-white relative z-10">Inicjalizacja...</div>;

  if (state.ageBracketId === null) {
    return (
      <div className="iq-test-session iq-assessment-ui relative z-10 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--iq-muted)]">
              Przed rozpoczęciem
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--iq-ink)] md:text-3xl">
              Przedział wiekowy
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--iq-muted)]">
              Wybierz grupę, do której należysz. Wynik IQ i percentyl zostaną odniesione do uproszczonej normy dla tej grupy (jak w
              standaryzowanych testach z podziałem wiekowym).
            </p>
          </div>
          <div className="iq-assessment-sheet overflow-hidden">
            <div className="iq-assessment-topbar px-6 py-4 md:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--iq-faint)]">
                Twoja grupa
              </p>
              <p className="mt-2 text-sm text-[var(--iq-muted)]">
                Wybierz jedną opcję — możesz wrócić tylko przed rozpoczęciem rozgrzewki.
              </p>
            </div>
            <div className="iq-answers-panel px-4 py-5 md:px-6 md:py-6">
              <div className="flex flex-col gap-2">
                {IQ_AGE_BRACKETS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() =>
                      setState((prev) => (prev ? { ...prev, ageBracketId: b.id } : null))
                    }
                    className="iq-option-btn flex min-h-[3.25rem] flex-row items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="flex-1 text-[15px] font-medium text-[var(--iq-ink)]">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trainingDone) {
    return (
      <div className="iq-test-session iq-assessment-ui relative z-10 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--iq-muted)]">
              Rozgrzewka
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--iq-ink)] md:text-3xl">
              Przed rozpoczęciem
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--iq-muted)]">
              Test zawiera wyłącznie zadania przygotowane na podstawie przesłanych screenów. Wybierz przycisk poniżej, gdy jesteś gotowy.
            </p>
          </div>
          <div className="iq-assessment-sheet overflow-hidden">
            <div className="iq-assessment-topbar px-6 py-4 md:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--iq-faint)]">
                Instrukcja
              </p>
              <h4 className="mt-2 text-base font-medium leading-relaxed text-[var(--iq-ink)] md:text-lg">
                W każdym zadaniu wybierz jedną odpowiedź, która najlepiej uzupełnia brakujące pole w układzie.
              </h4>
            </div>
            <div className="iq-answers-panel px-4 py-6 md:px-8 md:py-8">
              <button
                type="button"
                onClick={startRealTest}
                className="iq-option-btn flex min-h-[4.5rem] w-full flex-row items-center justify-center gap-3 px-4 py-4 text-center text-lg font-semibold text-[var(--iq-ink)]"
              >
                Rozpocznij test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = state.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  return (
    <div
      className="iq-test-session iq-assessment-ui relative z-10 px-4 py-6 pb-20 md:py-10"
      ref={containerRef}
    >
      <div className="mx-auto max-w-3xl md:max-w-4xl">
        <header className="iq-assessment-sheet iq-assessment-topbar mb-6 px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iq-faint)]">
                Sesja pomiarowa · matryce logiczne
              </p>
              <p className="mt-1 text-sm text-[var(--iq-muted)]">
                Pozycja{' '}
                <span className="font-semibold tabular-nums text-[var(--iq-ink)]">
                  {String(state.currentQuestionIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-[var(--iq-faint)]"> / </span>
                <span className="tabular-nums text-[var(--iq-muted)]">{state.questions.length}</span>
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-3 sm:max-w-md sm:flex-row sm:items-center sm:justify-end">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-between text-[11px] font-medium uppercase tracking-wider text-[var(--iq-faint)]">
                  <span>Postęp</span>
                  <span className="tabular-nums">{Math.round(progress)}%</span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-none"
                  style={{ backgroundColor: 'var(--iq-progress-track)' }}
                >
                  <div
                    className="h-full transition-[width] duration-300 ease-out"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: 'var(--iq-progress-fill)',
                    }}
                  />
                </div>
              </div>
              <div
                className="iq-timer-box shrink-0 border px-4 py-2 text-[15px] font-semibold text-[var(--iq-ink)]"
                style={{
                  borderColor: 'var(--iq-border-strong)',
                  backgroundColor: 'var(--iq-paper)',
                }}
                aria-live="polite"
              >
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </header>

        <div className="iq-assessment-sheet overflow-hidden">
          <div className="iq-stimulus-panel px-5 py-8 md:px-10 md:py-10">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iq-faint)]">
              Instrukcja
            </p>
            <h3 className="mx-auto mt-3 max-w-2xl text-center text-lg font-medium leading-snug text-[var(--iq-ink)] md:text-xl">
              {currentQ.content}
            </h3>
            {currentQ.svgContent && (
              <div className="iq-matrix-frame mt-8 text-[var(--iq-ink)]">
                {typeof currentQ.svgContent === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: currentQ.svgContent }} />
                ) : (
                  currentQ.svgContent
                )}
              </div>
            )}
            {currentQ.imageUrl && (
              <div className="mx-auto mt-6 max-w-md">
                <img
                  src={currentQ.imageUrl}
                  alt="Zadanie"
                  className="h-auto w-full border border-[var(--iq-border-strong)]"
                  style={{ backgroundColor: 'var(--iq-paper)' }}
                />
              </div>
            )}
            <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-[var(--iq-muted)]">
              Wybierz jedną odpowiedź spośród pól A–F. Tylko jedna opcja jest poprawna.
            </p>
          </div>

          <div className="iq-answers-panel px-4 py-6 md:px-8 md:py-8">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--iq-faint)]">
              Odpowiedzi
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSvg = typeof opt === 'string' && opt.startsWith('<svg');
                const letter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      handleAnswer(idx);
                    }}
                    className={`iq-option-btn group relative flex p-3 text-left focus:outline-none active:scale-[0.99] ${
                      isSvg ? 'flex-col items-stretch' : 'min-h-[5.5rem] flex-row items-center gap-3'
                    }`}
                  >
                    <span
                      className={`iq-option-letter inline-flex h-8 w-8 shrink-0 items-center justify-center ${
                        isSvg ? 'mb-2' : ''
                      }`}
                    >
                      {letter}
                    </span>
                    {isSvg ? (
                      <div
                        className="iq-option-svg-host flex flex-1 items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: opt }}
                      />
                    ) : (
                      <span className="flex-1 text-base font-medium text-[var(--iq-ink)] md:text-lg">
                        {opt}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
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
      
      // Much faster results calculation feel
      const steps = 4;
      const interval = setInterval(() => {
        setGenerationStep(prev => {
          if (prev >= steps - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
              // Only auto-navigate if they ALREADY paid for this specific result
              if (parsed.isPaid) {
                navigate('/raport');
              }
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 400);

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
  
  if (isGenerating) {
    const stepsText = [
      "Analizowanie wzorców...",
      "Kalkulacja wyników...",
      "Normalizacja populacyjna...",
      "Kończenie raportu..."
    ];
    
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-32 h-32 text-blue-600 mb-12 relative">
          <Logos.BrainGrid size={128} className="opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">Analizujemy Twoje odpowiedzi</h2>
        
        <div className="w-full max-w-sm space-y-3 mb-12">
          {stepsText.map((text, idx) => (
            <div 
              key={idx} 
              className={`flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 ${
                idx <= generationStep 
                  ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm opacity-100' 
                  : 'opacity-30'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                idx < generationStep ? 'bg-emerald-500 text-white' : 
                idx === generationStep ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700'
              }`}>
                {idx < generationStep ? <Check size={12} strokeWidth={4} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
              </div>
              <span className={`text-sm font-bold ${idx <= generationStep ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="max-w-[1200px] mx-auto py-12 md:py-24 px-6 space-y-16 relative z-10 animate-in fade-in duration-700">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
          <Icons.Check /> Gotowe do wyświetlenia
        </div>
        <h1 className="text-4xl md:text-6xl font-black dark:text-white mb-6 uppercase tracking-tight">Twój Wynik IQ gotowy</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
          Zaliczyliśmy Twoje podejście z dnia {new Date(data.timestamp).toLocaleDateString()}. Wybierz teraz opcję wyświetlenia swojego rezultatu.
        </p>
        {(data.stats?.ageBracketLabel || data.ageBracketLabel) && (
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            Grupa wiekowa (norma wyniku):{' '}
            <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
              {data.stats?.ageBracketLabel || data.ageBracketLabel}
            </span>
          </p>
        )}
      </div>

      <div className="mx-auto max-w-2xl rounded-[2rem] border border-blue-100 bg-blue-50/70 p-6 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/20">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Wyślij wynik na e-mail</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Podaj adres teraz, a po odblokowaniu raportu wyślemy wynik i certyfikat automatycznie na Twoją skrzynkę.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Twój e-mail"
            className="flex-1 rounded-2xl border border-blue-100 bg-white px-4 py-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-blue-900/50 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="button"
            disabled={!email.includes('@')}
            onClick={() => alert('Adres e-mail zapisany. Po odblokowaniu raport zostanie wysłany automatycznie.')}
            className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Zapisz do wysyłki
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Standard */}
        <div className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center relative hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-3xl flex items-center justify-center mb-8"><Award size={32} /></div>
          <h3 className="text-2xl font-bold mb-2 dark:text-white">Wynik Standard</h3>
          <div className="text-4xl font-black mb-6 text-slate-800 dark:text-slate-200">4,99 PLN</div>
          
          <div className="space-y-4 mb-10 text-left w-full">
            {[
              "Twój wynik punktowy IQ",
              "Percentyl (pozycja w populacji)",
              "Oficjalny certyfikat PDF",
              "Wysyłka na e-mail natychmiast"
            ].map((item, i) => (
              <div key={i} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400">
                <Check size={16} className="text-emerald-500 mr-3 shrink-0" /> {item}
              </div>
            ))}
          </div>

          <Link 
            to="/platnosc?intent=unlock" 
            className="w-full bg-slate-800 text-white py-5 rounded-2xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-lg"
          >
            Wybierz Standard
          </Link>
        </div>

        {/* PRO */}
        <div className="bg-blue-600 p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-blue-500/20 flex flex-col items-center text-center relative hover:scale-[1.02] transition-all">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">Najczęściej wybierany</div>
          <div className="w-16 h-16 bg-blue-500 text-blue-100 rounded-3xl flex items-center justify-center mb-8"><Brain size={32} /></div>
          <h3 className="text-2xl font-bold mb-2 text-white">Analiza PRO</h3>
          <div className="text-4xl font-black mb-6 text-white">9,99 PLN</div>
          
          <div className="space-y-4 mb-10 text-left w-full">
            {[
              "Wszystko z opcji Standard",
              "Profil 5 domen z paskami wyniku (%)",
              "Plan rozwoju — 5 jasnych kroków",
              "Mocne strony i obszary do ćwiczeń",
              "Percentyl w Twojej grupie wiekowej"
            ].map((item, i) => (
              <div key={i} className="flex items-center text-sm font-medium text-blue-100">
                <Check size={16} className="text-amber-400 mr-3 shrink-0" /> {item}
              </div>
            ))}
          </div>

          <Link 
            to="/platnosc?type=pro&intent=unlock" 
            className="w-full bg-white text-blue-600 py-5 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-lg shadow-xl"
          >
            Wybierz Analizę PRO
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { i: <Icons.ShieldCheck />, t: "Prywatność", d: "Twoje dane są w pełni anonimowe i bezpieczne." },
            { i: <Icons.Mail />, t: "E-mail", d: "Wiadomość otrzymasz bezpośrednio na swoją skrzynkę." },
            { i: <Icons.Award />, t: "Certyfikat", d: "Wystawiony przez autoryzowany system testowy." }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">{item.i}</div>
              <h4 className="font-bold dark:text-white text-sm mb-1">{item.t}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={() => {
            const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
            localStorage.setItem('iq_results', JSON.stringify({ ...s, isPaid: true, isPro: false, email: email || 'test@example.com' }));
            navigate('/raport');
          }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold underline underline-offset-4 transition-colors"
        >
          Tryb programisty: Zobacz raport (skip payment)
        </button>
      </div>
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
  } else if (typeParam === 'alzheimer') {
    productName = 'Test Funkcji Poznawczych';
    price = '4,99';
    redirectUrl = '/test-funkcji-poznawczych';
  } else if (typeParam === 'adhd') {
    productName = 'Test ADHD (ASRS)';
    price = '4,99';
    redirectUrl = '/test-adhd';
  }

  const sendConfirmationEmail = async (toEmail: string, product: string, price: string) => {
    const year = new Date().getFullYear();
    const dateStr = new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmail,
          subject: `✅ Potwierdzenie zakupu – brainmediq`,
          html: `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr><td style="background:#1e293b;padding:36px 48px;text-align:center">
          <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.2em;text-transform:uppercase">Centrum Badań Psychometrycznych</p>
          <h1 style="margin:8px 0 0;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-0.02em">brainmediq</h1>
        </td></tr>

        <!-- Green stripe -->
        <tr><td style="background:#10b981;padding:14px 48px">
          <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.05em">✅ ZAMÓWIENIE ZREALIZOWANE</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 48px">
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1e293b">Dziękujemy za zakup!</h2>
          <p style="margin:0 0 28px;color:#64748b;line-height:1.7;font-size:15px">
            Twoje zamówienie zostało pomyślnie zrealizowane. Dostęp do produktu jest już aktywny.
          </p>

          <!-- Order box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:28px">
            <tr><td style="padding:20px 24px;border-bottom:1px solid #e2e8f0">
              <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Produkt</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#1e293b">${product}</p>
            </td></tr>
            <tr><td style="padding:20px 24px;border-bottom:1px solid #e2e8f0">
              <table width="100%"><tr>
                <td><p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Kwota</p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#1e293b">${price} PLN</p></td>
                <td align="right"><p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Data</p>
                <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#475569">${dateStr}</p></td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:20px 24px">
              <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">E-mail</p>
              <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#475569">${toEmail}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 8px;color:#475569;line-height:1.7;font-size:14px">
            Po ukończeniu testu Twój <strong>certyfikat IQ oraz szczegółowy wynik</strong> zostaną automatycznie wysłane na ten adres e-mail w osobnej wiadomości.
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 48px 40px;text-align:center">
          <a href="https://brainmediq.com" style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:700;font-size:15px;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.02em">
            Wróć do aplikacji →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:24px 48px;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6">
            © ${year} brainmediq Polska · kontakt@brainmediq.com<br>
            Ta wiadomość jest automatycznym potwierdzeniem. Nie odpowiadaj na ten e-mail.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
        }),
      });
    } catch (e) {
      console.warn('Email sending failed (non-critical):', e);
    }
  };

  const handlePay = (bypass: boolean = false) => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const updatedSaved = { ...saved, email: email || 'test@example.com' };
      
      // If starting a new test, clear old stats
      if (intentParam === 'start' || !intentParam) {
        delete updatedSaved.stats;
        delete updatedSaved.analysis;
        delete updatedSaved.ageBracketId;
        delete updatedSaved.ageBracketLabel;
      }

      if (typeParam === 'osobowosc') updatedSaved.hasOsobowosc = true;
      else if (typeParam === 'pamiec') updatedSaved.hasPamiec = true;
      else if (typeParam === 'koncentracja') updatedSaved.hasKoncentracja = true;
      else if (typeParam === 'reakcja') updatedSaved.hasReakcja = true;
      else if (typeParam === 'alzheimer') updatedSaved.hasAlzheimer = true;
      else if (typeParam === 'adhd') updatedSaved.hasADHD = true;
      else {
        updatedSaved.isPaid = true;
        updatedSaved.isPro = typeParam === 'pro';
        updatedSaved.isMax = typeParam === 'max';
      }
      
      localStorage.setItem('iq_results', JSON.stringify(updatedSaved));

      if (email && email.includes('@') && !bypass) {
        await sendConfirmationEmail(email, productName, price);
      }

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
  const certId = `BMQ-${data.stats.iqScore}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
  const domainLabels: Record<string, string> = {
    MATRIX: 'Matryce',
    NUMBER_SERIES: 'Ciągi',
    ANALOGY: 'Analogie',
    SPATIAL: 'Przestrzeń',
    LOGIC: 'Logika',
  };
  const displayName = userName || 'Uczestnik Badania';
  const domains = Object.entries(data.stats.domainScores).map(([key, value]) => ({
    key,
    label: domainLabels[key] || key,
    value: Math.max(0, Math.min(100, Math.round(value as number))),
  }));

  return (
    <div style={{
      width: '1123px',
      height: '794px',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #f8fafc 0%, #fffaf0 45%, #f8fafc 100%)',
      color: '#0f172a',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(circle at 50% 42%, rgba(37, 99, 235, 0.10), transparent 34%)' }} />
      <div style={{ position: 'absolute', inset: '28px', border: '2px solid #0f2d5c', borderRadius: '30px' }} />
      <div style={{ position: 'absolute', inset: '40px', border: '1px solid rgba(180, 145, 77, 0.75)', borderRadius: '22px' }} />
      <div style={{ position: 'absolute', top: '51px', left: '51px', right: '51px', height: '6px', borderTop: '1px solid rgba(15, 45, 92, 0.35)', borderBottom: '1px solid rgba(180, 145, 77, 0.7)' }} />
      <div style={{ position: 'absolute', bottom: '51px', left: '51px', right: '51px', height: '6px', borderTop: '1px solid rgba(180, 145, 77, 0.7)', borderBottom: '1px solid rgba(15, 45, 92, 0.35)' }} />

      {[
        ['46px', '46px', undefined, undefined],
        ['46px', undefined, undefined, '46px'],
        [undefined, '46px', '46px', undefined],
        [undefined, undefined, '46px', '46px'],
      ].map(([top, left, bottom, right], i) => (
        <div key={i} style={{ position: 'absolute', top, left, bottom, right, width: '34px', height: '34px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '1px solid #b4914d', transform: 'rotate(45deg)' }} />
          <div style={{ position: 'absolute', inset: '11px', background: '#0f2d5c', borderRadius: '50%' }} />
        </div>
      ))}

      <div style={{
        position: 'absolute',
        left: '50%',
        top: '47%',
        transform: 'translate(-50%, -50%)',
        width: '520px',
        height: '520px',
        border: '1px solid rgba(15, 45, 92, 0.08)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '47%',
        transform: 'translate(-50%, -50%)',
        fontSize: '118px',
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: '-0.08em',
        color: '#0f2d5c',
        opacity: 0.035,
        whiteSpace: 'nowrap',
      }}>
        brainmediq
      </div>

      <div style={{ position: 'absolute', top: '78px', left: '86px', right: '86px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '34px' }}>
          <div style={{ width: '230px', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#64748b' }}>
              Dokument cyfrowy
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 700, color: '#0f2d5c' }}>{certId}</div>
          </div>

          <div style={{
            width: '82px',
            height: '82px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0f2d5c, #2563eb)',
            boxShadow: '0 16px 32px rgba(37, 99, 235, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10.5C4 6.9 7 4 10.6 4h2.8C17 4 20 6.9 20 10.5c0 2.9-1.9 5.4-4.5 6.2" />
              <path d="M8.5 16.7C5.9 15.9 4 13.4 4 10.5" />
              <path d="M9 10h6" />
              <path d="M12 7v6" />
              <path d="M8 20h8" />
              <path d="M12 16v4" />
            </svg>
          </div>

          <div style={{ width: '230px', textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#64748b' }}>
              Data badania
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 700, color: '#0f2d5c' }}>{dateStr}</div>
          </div>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.36em', textTransform: 'uppercase', color: '#b4914d', marginBottom: '14px' }}>
          Brainmediq Polska
        </div>
        <div style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: '58px', fontWeight: 700, letterSpacing: '0.08em', color: '#0f2d5c', lineHeight: 1 }}>
          CERTYFIKAT IQ
        </div>
        <div style={{ width: '170px', height: '2px', background: 'linear-gradient(90deg, transparent, #b4914d, transparent)', margin: '22px auto 28px' }} />

        <div style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: '18px', fontStyle: 'italic', color: '#475569', marginBottom: '12px' }}>
          Niniejszym potwierdza się, że
        </div>
        <div style={{
          display: 'inline-block',
          minWidth: '560px',
          padding: '0 38px 12px',
          borderBottom: '1px solid rgba(180, 145, 77, 0.9)',
          fontFamily: 'Georgia, Times New Roman, serif',
          fontSize: '48px',
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#111827',
          lineHeight: 1.1,
        }}>
          {displayName}
        </div>

        <div style={{ maxWidth: '690px', margin: '22px auto 20px', fontSize: '15px', lineHeight: 1.7, color: '#475569' }}>
          ukończył/a test inteligencji na platformie brainmediq.com i uzyskał/a poniższy wynik w pomiarze zdolności poznawczych.
        </div>

        <div style={{
          width: '690px',
          margin: '0 auto 24px',
          padding: '18px 28px',
          borderRadius: '28px',
          border: '1px solid rgba(180, 145, 77, 0.55)',
          background: 'rgba(255, 255, 255, 0.82)',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '34px',
        }}>
          <div style={{ textAlign: 'center', minWidth: '220px' }}>
            <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
              Wynik ogólny
            </div>
            <div style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: '104px', fontWeight: 700, color: '#0f2d5c', lineHeight: 0.95 }}>
              {data.stats.iqScore}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#b4914d' }}>
              IQ score
            </div>
          </div>

          <div style={{ width: '1px', height: '132px', background: 'linear-gradient(#ffffff, #cbd5e1, #ffffff)' }} />

          <div style={{ textAlign: 'left', width: '300px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#64748b' }}>Percentyl</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#111827', marginTop: '2px' }}>{data.stats.percentile}%</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#64748b' }}>Przedział ufności 95%</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f2d5c', marginTop: '4px' }}>{data.stats.confidenceInterval[0]} - {data.stats.confidenceInterval[1]}</div>
            </div>
            {data.stats.ageBracketLabel ? (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#64748b' }}>Norma wieku</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f2d5c', marginTop: '4px' }}>{data.stats.ageBracketLabel}</div>
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ width: '760px', margin: '0 auto', display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, domains.length)}, 1fr)`, gap: '10px' }}>
          {domains.map((domain) => (
            <div key={domain.key} style={{
              padding: '12px 10px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.68)',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f2d5c' }}>{domain.value}%</div>
              <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', margin: '7px 0 8px' }}>
                <div style={{ height: '100%', width: `${domain.value}%`, background: 'linear-gradient(90deg, #2563eb, #b4914d)', borderRadius: '999px' }} />
              </div>
              <div style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b' }}>{domain.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '78px', left: '92px', right: '92px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ width: '245px', textAlign: 'center' }}>
          <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '8px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            brainmediq.com
          </div>
          <div style={{ marginTop: '9px', fontSize: '9px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>
            Platforma badania
          </div>
        </div>

        <div style={{
          width: '104px',
          height: '104px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #d8b45c 0%, #b4914d 58%, #8a6a2f 100%)',
          boxShadow: '0 0 0 4px rgba(180, 145, 77, 0.26), 0 16px 28px rgba(15, 23, 42, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: '#ffffff',
        }}>
          <div style={{ position: 'absolute', inset: '9px', border: '1px solid rgba(255, 255, 255, 0.55)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '19px', left: 0, right: 0, textAlign: 'center', fontSize: '7px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            verified
          </div>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2.35 4.76l5.25.76l-3.8 3.7l.9 5.23L12 15l-4.7 2.47l.9-5.23l-3.8-3.7l5.25-.76L12 3z" />
          </svg>
          <div style={{ position: 'absolute', bottom: '19px', left: 0, right: 0, textAlign: 'center', fontSize: '7px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            result
          </div>
        </div>

        <div style={{ width: '245px', textAlign: 'center' }}>
          <div style={{
            borderBottom: '1px solid #94a3b8',
            paddingBottom: '8px',
            fontFamily: 'Georgia, Times New Roman, serif',
            fontSize: '30px',
            fontStyle: 'italic',
            fontWeight: 700,
            color: '#0f2d5c',
          }}>
            Brainmediq
          </div>
          <div style={{ marginTop: '9px', fontSize: '9px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>
            Autoryzacja systemowa
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '42px', left: '90px', right: '90px', textAlign: 'center', fontSize: '9px', color: '#94a3b8', lineHeight: 1.5 }}>
        Certyfikat ma charakter informacyjno-rozwojowy i potwierdza wynik uzyskany w teście online. Nie stanowi diagnozy klinicznej ani dokumentu urzędowego.
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
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const emailSentRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('iq_results');
    if (saved) {
      const parsed = JSON.parse(saved) as ReportData;
      if (!parsed.isPaid) { navigate('/platnosc'); return; }
      
      if (parsed.userName) setUserName(parsed.userName);

      const fetchReport = async () => {
        if (!parsed.isPro) {
          setData(parsed);
          setLoading(false);
          setTimeout(() => setAnimate(true), 300);
          return;
        }

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

  // Auto-send results email once report is ready and certificate is rendered
  useEffect(() => {
    if (!loading && data && animate) {
      // Give certificate element time to render fully in the hidden div
      const timer = setTimeout(() => {
        sendResultsEmail(data, userName);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, animate, data]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setUserName(newName);
    if (data) {
      const updated = { ...data, userName: newName };
      setData(updated);
      localStorage.setItem('iq_results', JSON.stringify(updated));
    }
  };

  const generateCertificatePdfBase64 = async (): Promise<string | null> => {
    if (!certificateRef.current) return null;
    try {
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 200));
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1123,
        windowHeight: 794,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      const dataUri = pdf.output('datauristring');
      return dataUri.split(',')[1];
    } catch (e) {
      console.error('PDF generation failed:', e);
      return null;
    }
  };

  const sendResultsEmail = async (reportData: ReportData, name: string, force = false) => {
    const toEmail = (reportData as ReportData & { email?: string }).email;
    if (!toEmail || !toEmail.includes('@')) {
      setEmailStatus('error');
      return;
    }

    const sessionKey = `certEmailSent_${reportData.timestamp}`;
    if (!force && localStorage.getItem(sessionKey)) return;
    if (!force && emailSentRef.current) return;
    emailSentRef.current = true;

    setEmailStatus('sending');
    const year = new Date().getFullYear();
    const dateStr = new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
    const displayName = name || 'Uczestnik Badania';

    const pdfBase64 = await generateCertificatePdfBase64();

    const domainLabels: Record<string, string> = {
      MATRIX: 'Myślenie matrycowe',
      NUMBER_SERIES: 'Ciągi liczbowe',
      ANALOGY: 'Analogie',
      SPATIAL: 'Wyobraźnia przestrzenna',
      LOGIC: 'Logika',
    };

    const domainRows = Object.entries(reportData.stats.domainScores)
      .map(([key, val]) => `
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9">${domainLabels[key] || key}</td>
          <td style="padding:10px 16px;text-align:right;border-bottom:1px solid #f1f5f9">
            <div style="display:inline-block;background:#e0e7ff;border-radius:6px;padding:2px 10px;font-weight:700;font-size:13px;color:#3730a3">${Math.round(val)}</div>
          </td>
        </tr>`).join('');

    const ageNormRow =
      reportData.stats.ageBracketLabel != null && reportData.stats.ageBracketLabel !== ''
        ? `<p style="margin:10px 0 0;font-size:12px;color:#94a3b8">Norma: grupa wiekowa <strong style="color:#e2e8f0">${reportData.stats.ageBracketLabel}</strong></p>`
        : '';

    const html = `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr><td style="background:#1e293b;padding:36px 48px;text-align:center">
          <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.2em;text-transform:uppercase">Centrum Badań Psychometrycznych</p>
          <h1 style="margin:8px 0 0;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-0.02em">brainmediq</h1>
          <p style="margin:10px 0 0;font-size:13px;color:#94a3b8">Twój certyfikat i wyniki testu IQ</p>
        </td></tr>

        <!-- Blue accent -->
        <tr><td style="background:#2563eb;padding:14px 48px">
          <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.05em">🏆 WYNIKI BADANIA GOTOWE</p>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding:40px 48px 20px">
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1e293b">Cześć, ${displayName}!</h2>
          <p style="margin:0;color:#64748b;line-height:1.7;font-size:15px">
            Twoje badanie zostało zakończone. Poniżej znajdziesz pełne wyniki testu IQ. <strong>Certyfikat w formacie PDF</strong> jest dołączony do tej wiadomości jako załącznik.
          </p>
        </td></tr>

        <!-- Score hero -->
        <tr><td style="padding:0 48px 32px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1e293b;border-radius:16px;padding:32px;text-align:center" width="45%">
                <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.15em">Wynik IQ</p>
                <p style="margin:8px 0;font-size:64px;font-weight:900;color:#ffffff;line-height:1">${reportData.stats.iqScore}</p>
                ${ageNormRow}
                <p style="margin:0;font-size:12px;color:#64748b">Przedział: ${reportData.stats.confidenceInterval[0]}–${reportData.stats.confidenceInterval[1]}</p>
              </td>
              <td width="10%"></td>
              <td style="vertical-align:middle" width="45%">
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:12px">
                  <p style="margin:0;font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.1em">Percentyl</p>
                  <p style="margin:4px 0 0;font-size:24px;font-weight:900;color:#15803d">${reportData.stats.percentile}%</p>
                </div>
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 20px">
                  <p style="margin:0;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.1em">Data badania</p>
                  <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#1d4ed8">${dateStr}</p>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Domain scores -->
        <tr><td style="padding:0 48px 32px">
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:0.1em">Wyniki w kategoriach</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
            ${domainRows}
          </table>
        </td></tr>

        <!-- Certificate note -->
        <tr><td style="padding:0 48px 32px">
          <div style="background:#fefce8;border:1px solid #fde047;border-radius:14px;padding:20px 24px">
            <p style="margin:0;font-size:14px;font-weight:700;color:#713f12">📎 Certyfikat PDF w załączniku</p>
            <p style="margin:8px 0 0;font-size:13px;color:#92400e;line-height:1.6">
              Do tej wiadomości dołączony jest Certyfikat Ilorazu Inteligencji w formacie PDF. Możesz go pobrać, wydrukować lub udostępnić.
            </p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:24px 48px;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6">
            © ${year} brainmediq Polska · kontakt@brainmediq.com<br>
            Ta wiadomość jest automatyczną odpowiedzią. Nie odpowiadaj na ten e-mail.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmail,
          subject: `🏆 Twój Certyfikat IQ ${reportData.stats.iqScore} – brainmediq`,
          html,
          ...(pdfBase64 ? { attachment: { filename: `Certyfikat_IQ_${displayName.replace(/\s+/g, '_')}.pdf`, content: pdfBase64 } } : {}),
        }),
      });
      if (res.ok) {
        setEmailStatus('sent');
        localStorage.setItem(sessionKey, '1');
      } else {
        setEmailStatus('error');
        emailSentRef.current = false;
      }
    } catch {
      setEmailStatus('error');
      emailSentRef.current = false;
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
           <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
             <Logos.BrainGrid size={42} />
           </div>
           <div>
             <h1 className="text-5xl font-bold dark:text-white mb-3">{data.isPro ? "Szczegółowa Analiza IQ" : "Wynik Twojego Testu"}</h1>
             <p className="text-slate-500 dark:text-slate-400 text-lg">{data.isPro ? "Zaawansowana Analiza Psychometryczna — Model CHC v2.5" : "Oficjalny Wynik i Certyfikat Inteligencji"}</p>
              <div className="mt-2 no-print flex items-center gap-3">
                {emailStatus === 'sending' && (
                  <span className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"/>
                    Wysyłanie certyfikatu na e-mail...
                  </span>
                )}
                {emailStatus === 'sent' && (
                  <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4"/> Certyfikat PDF wysłany na Twój e-mail!
                  </span>
                )}
                {emailStatus === 'error' && (
                  <span className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4"/> Błąd wysyłki —
                    <button onClick={() => { emailSentRef.current = false; data && sendResultsEmail(data, userName, true); }} className="underline hover:no-underline">
                      spróbuj ponownie
                    </button>
                  </span>
                )}
                {emailStatus === 'idle' && (
                  <span className="text-slate-400 text-sm">{data.isPro ? "Przygotowujemy pełny raport i certyfikat..." : "Przygotowujemy certyfikat..."}</span>
                )}
              </div>
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
          <p className="text-slate-500 font-bold text-xl animate-pulse">
            {data.isPro ? "Trwa generowanie szczegółowego raportu..." : "Przygotowujemy Twój wynik i certyfikat..."}
          </p>
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
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{data.isPro ? "E-mail do wysyłki raportu" : "E-mail do wysyłki certyfikatu"}</label>
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
                <button
                  type="button"
                  onClick={() => data && sendResultsEmail(data, userName, true)}
                  disabled={emailStatus === 'sending' || !String(data.email || '').includes('@')}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {emailStatus === 'sending' ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Wysyłanie...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Wyślij raport na e-mail
                    </>
                  )}
                </button>
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

  const handleEmailSave = async () => {
    if (!scores) return;
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    try {
      await sendResultEmail({
        to: email,
        subject: 'Twój wynik testu osobowości - brainmediq',
        title: 'Wynik testu osobowości',
        subtitle: 'Profil Big Five / OCEAN',
        summary: 'Poniżej znajdziesz podsumowanie wyników w pięciu głównych wymiarach osobowości.',
        rows: Object.entries(scores).map(([key, value]) => ({
          label: traitInfo[key as keyof typeof traitInfo].name,
          value: `${Math.round(value as number)}%`,
        })),
      });
      alert('Wyniki zostały wysłane na e-mail.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości.');
    }
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

  const sortedTraits = scores
    ? Object.entries(scores).sort(([, a], [, b]) => (b as number) - (a as number))
    : [];
  const strongestTrait = sortedTraits[0];
  const calmestTrait = sortedTraits[sortedTraits.length - 1];
  const balancedTraits = sortedTraits.filter(([, value]) => (value as number) >= 40 && (value as number) <= 60).length;
  const strongestTraitInfo = strongestTrait ? traitInfo[strongestTrait[0] as keyof typeof traitInfo] : null;
  const calmestTraitInfo = calmestTrait ? traitInfo[calmestTrait[0] as keyof typeof traitInfo] : null;

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 min-h-[70vh] flex flex-col justify-center">
      {step === 'intro' && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Layers className="w-10 h-10" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 text-center dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-300">Najsilniejsza cecha</div>
              <div className="mt-3 text-xl font-black text-indigo-700 dark:text-indigo-300">{strongestTraitInfo?.name}</div>
              <div className="mt-1 text-sm font-bold text-indigo-500">{strongestTrait?.[1]}%</div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profil zbalansowany</div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{balancedTraits}/5</div>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 text-center dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">Najniższy wymiar</div>
              <div className="mt-3 text-xl font-black text-blue-700 dark:text-blue-300">{calmestTraitInfo?.name}</div>
              <div className="mt-1 text-sm font-bold text-blue-500">{calmestTrait?.[1]}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-lg font-bold dark:text-white">Jak czytać profil?</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Wynik nie ocenia osobowości jako dobrej lub złej. Pokazuje raczej preferowany styl działania: sposób reagowania na ludzi, stres, obowiązki, nowość i współpracę.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-lg font-bold dark:text-white">Najważniejszy wniosek</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Najmocniej wyróżnia się u Ciebie obszar: <strong className="text-slate-800 dark:text-slate-100">{strongestTraitInfo?.name}</strong>. Najniższy wynik w obszarze <strong className="text-slate-800 dark:text-slate-100">{calmestTraitInfo?.name}</strong> oznacza, że ta cecha rzadziej dominuje w Twoich typowych reakcjach.
              </p>
            </div>
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

  const handleEmailSave = async () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    try {
      await sendResultEmail({
        to: email,
        subject: 'Twój wynik testu pamięci przestrzennej - brainmediq',
        title: 'Wynik testu pamięci przestrzennej',
        subtitle: 'Pamięć robocza i sekwencje przestrzenne',
        summary: 'Poniżej znajdziesz wynik najdłuższej poprawnie odtworzonej sekwencji oraz krótką interpretację.',
        rows: [
          { label: 'Pojemność pamięci roboczej', value: `${capacity} elementów` },
          { label: 'Ukończone poziomy', value: completedLevels },
          { label: 'Kolejny cel', value: `${nextGoal} elementów` },
          { label: 'Interpretacja', value: interpretation.title },
        ],
      });
      alert('Wyniki zostały wysłane na e-mail.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości.');
    }
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
  const completedLevels = Math.max(0, level - 1);
  const nextGoal = capacity + 1;
  const resultNote =
    capacity < 5
      ? 'Wynik warto traktować ostrożnie, jeśli test był wykonywany w hałasie, pośpiechu albo przy zmęczeniu.'
      : capacity <= 6
        ? 'To stabilny wynik dla codziennych zadań wymagających zapamiętywania położenia i kolejności.'
        : 'Taki wynik sugeruje sprawne utrzymywanie informacji przestrzennej oraz dobrą kontrolę uwagi.';
  const trainingTips =
    capacity < 5
      ? ['Wykonuj krótkie serie 3-4 elementów i zwiększaj długość dopiero po kilku bezbłędnych próbach.', 'Przed klikaniem odtwórz sekwencję w głowie jeszcze raz, bez pośpiechu.']
      : capacity <= 6
        ? ['Ćwicz grupowanie kafelków w małe wzory, np. linia, róg, przekątna.', 'Zwiększaj trudność stopniowo: najpierw dokładność, później tempo.']
        : ['Utrzymuj wynik przez trudniejsze układy, zmieniając tempo i długość sekwencji.', 'Dobrym kolejnym celem jest stabilne powtarzanie sekwencji o jeden element dłuższej.'];

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 min-h-[70vh] flex flex-col justify-center">
      {step === 'intro' && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <LayoutGrid className="w-10 h-10" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Ukończone poziomy</div>
              <div className="mt-3 text-3xl font-black text-emerald-700 dark:text-emerald-300">{completedLevels}</div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Najdłuższa sekwencja</div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{capacity}</div>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 text-center dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">Kolejny cel</div>
              <div className="mt-3 text-3xl font-black text-blue-700 dark:text-blue-300">{nextGoal}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-lg font-bold dark:text-white">Co oznacza wynik?</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Test sprawdza, ile elementów przestrzennych potrafisz utrzymać w pamięci i odtworzyć w poprawnej kolejności. {resultNote}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-lg font-bold dark:text-white">Jak poprawiać wynik?</h3>
              <div className="space-y-3">
                {trainingTips.map((tip, i) => (
                  <div key={i} className="flex gap-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{i + 1}</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
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

  const handleEmailSave = async () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    try {
      await sendResultEmail({
        to: email,
        subject: 'Twój wynik testu koncentracji - brainmediq',
        title: 'Wynik testu koncentracji',
        subtitle: 'Test Stroopa',
        summary: 'Poniżej znajdziesz podsumowanie poprawnych odpowiedzi, błędów i skuteczności w teście koncentracji.',
        rows: [
          { label: 'Poprawne odpowiedzi', value: score },
          { label: 'Błędy', value: errors },
          { label: 'Skuteczność', value: `${accuracy}%` },
          { label: 'Tempo', value: `${pace} odpowiedzi/min` },
          { label: 'Interpretacja', value: interpretation.title },
        ],
      });
      alert('Wyniki zostały wysłane na e-mail.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości.');
    }
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
  const totalAnswers = score + errors;
  const accuracy = totalAnswers > 0 ? Math.round((score / totalAnswers) * 100) : 0;
  const pace = Math.round(totalAnswers / 0.5);
  const concentrationTips =
    accuracy < 75
      ? ['Najpierw zwolnij tempo i skup się na kolorze liter, nie na treści słowa.', 'Pomaga krótkie nazwanie koloru w myślach przed kliknięciem odpowiedzi.']
      : score < 25
        ? ['Masz dobrą dokładność, więc kolejnym celem jest stopniowe zwiększanie tempa.', 'Ćwicz krótkimi seriami po 30 sekund, zachowując jak najmniej błędów.']
        : ['Utrzymuj balans między szybkością i dokładnością; nie zwiększaj tempa kosztem błędów.', 'Dla dalszego rozwoju dodawaj rozpraszacze, np. cichy dźwięk lub presję czasu.'];

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 min-h-[70vh] flex flex-col justify-center">
      {step === 'intro' && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Eye className="w-10 h-10" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-6 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Skuteczność</div>
              <div className="mt-3 text-3xl font-black text-amber-700 dark:text-amber-300">{accuracy}%</div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Odpowiedzi</div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{totalAnswers}</div>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 text-center dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">Tempo / min</div>
              <div className="mt-3 text-3xl font-black text-blue-700 dark:text-blue-300">{pace}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-lg font-bold dark:text-white">Co mierzy ten wynik?</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Wynik pokazuje, jak szybko potrafisz ignorować znaczenie słowa i reagować tylko na kolor czcionki. To praktyczna miara uwagi selektywnej, kontroli impulsu i odporności na dystraktory.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-lg font-bold dark:text-white">Jak poprawiać wynik?</h3>
              <div className="space-y-3">
                {concentrationTips.map((tip, i) => (
                  <div key={i} className="flex gap-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-black text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{i + 1}</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
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

  const handleEmailSave = async () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    try {
      await sendResultEmail({
        to: email,
        subject: 'Twój wynik testu reakcji - brainmediq',
        title: 'Wynik testu szybkości reakcji',
        subtitle: 'Czas reakcji na bodziec wzrokowy',
        summary: 'Poniżej znajdziesz średni czas reakcji oraz wyniki poszczególnych prób.',
        rows: [
          { label: 'Średni czas reakcji', value: `${averageTime} ms` },
          { label: 'Najlepsza próba', value: `${bestTime} ms` },
          { label: 'Najwolniejsza próba', value: `${slowestTime} ms` },
          { label: 'Stabilność', value: consistencyLabel },
          { label: 'Interpretacja', value: interpretation.title },
        ],
      });
      alert('Wyniki zostały wysłane na e-mail.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości.');
    }
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
  const bestTime = times.length > 0 ? Math.min(...times) : 0;
  const slowestTime = times.length > 0 ? Math.max(...times) : 0;
  const stabilityRange = slowestTime - bestTime;
  const consistencyLabel =
    stabilityRange <= 80 ? 'Bardzo stabilnie' : stabilityRange <= 160 ? 'Stabilnie' : 'Duża zmienność';
  const reactionTips =
    averageTime <= 320
      ? ['Utrzymuj tę szybkość, ale pilnuj, żeby nie klikać przed zmianą koloru.', 'Dalszy progres zwykle zależy od koncentracji, snu i jakości sprzętu.']
      : averageTime <= 450
        ? ['Skup wzrok na środku pola i trzymaj palec gotowy przed zmianą koloru.', 'Ćwicz krótkimi seriami; po kilku minutach reakcja zwykle zaczyna zwalniać.']
        : ['Wykonaj test ponownie innego dnia, jeśli byłeś/aś zmęczony/a lub rozproszony/a.', 'Sprawdź też opóźnienie myszy, gładzika i monitora, bo mocno wpływa na wynik.'];

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 min-h-[70vh] flex flex-col justify-center">
      {step === 'intro' && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Gauge className="w-10 h-10" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Najlepsza próba</div>
              <div className="mt-3 text-3xl font-black text-emerald-700 dark:text-emerald-300">{bestTime} ms</div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stabilność</div>
              <div className="mt-3 text-xl font-black text-slate-900 dark:text-white">{consistencyLabel}</div>
              <div className="mt-1 text-xs font-bold text-slate-400">rozrzut {stabilityRange} ms</div>
            </div>
            <div className="rounded-3xl border border-rose-100 bg-rose-50/70 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-300">Najwolniejsza próba</div>
              <div className="mt-3 text-3xl font-black text-rose-700 dark:text-rose-300">{slowestTime} ms</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-lg font-bold dark:text-white">Co oznacza wynik?</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Średnia pokazuje typowy czas reakcji, a rozrzut między próbami mówi, czy reakcje były równe. Na wynik wpływa uwaga, zmęczenie, stres oraz opóźnienie urządzenia.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-lg font-bold dark:text-white">Jak poprawiać wynik?</h3>
              <div className="space-y-3">
                {reactionTips.map((tip, i) => (
                  <div key={i} className="flex gap-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-black text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">{i + 1}</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
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
            <Link to="/inne-testy" className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all relative group">
              Inne testy
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ALZHEIMER TEST ---

const alzheimerQuestions = [
  {
    id: 1,
    category: 'Orientacja czasowa',
    question: 'Który mamy teraz rok?',
    type: 'text' as const,
    correctAnswer: new Date().getFullYear().toString(),
    points: 1,
  },
  {
    id: 2,
    category: 'Orientacja czasowa',
    question: 'Jaka jest teraz pora roku?',
    type: 'choice' as const,
    options: ['Wiosna', 'Lato', 'Jesień', 'Zima'],
    correctAnswer: (() => {
      const m = new Date().getMonth();
      if (m >= 2 && m <= 4) return 'Wiosna';
      if (m >= 5 && m <= 7) return 'Lato';
      if (m >= 8 && m <= 10) return 'Jesień';
      return 'Zima';
    })(),
    points: 1,
  },
  {
    id: 3,
    category: 'Orientacja czasowa',
    question: 'Który mamy miesiąc?',
    type: 'choice' as const,
    options: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
    correctAnswer: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'][new Date().getMonth()],
    points: 1,
  },
  {
    id: 4,
    category: 'Orientacja czasowa',
    question: 'Który mamy dzień tygodnia?',
    type: 'choice' as const,
    options: ['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela'],
    correctAnswer: ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'][new Date().getDay()],
    points: 1,
  },
  {
    id: 5,
    category: 'Pamięć krótkotrwała',
    question: 'Przeczytaj uważnie trzy słowa i spróbuj je zapamiętać:\n\n🍎 JABŁKO — 🏠 DOM — 🌊 MORZE\n\nCzy możesz je teraz powtórzyć (wpisz wszystkie trzy)?',
    type: 'memory_register' as const,
    correctAnswer: 'jabłko dom morze',
    points: 3,
    hint: 'jabłko, dom, morze',
  },
  {
    id: 6,
    category: 'Uwaga i obliczenia',
    question: 'Odejmij 7 od 100. Następnie odejmuj 7 kolejno pięć razy. Jaki jest ostatni wynik?',
    type: 'choice' as const,
    options: ['58', '63', '65', '72'],
    correctAnswer: '65',
    points: 5,
  },
  {
    id: 7,
    category: 'Pamięć — przypomnienie',
    question: 'Jakie trzy słowa prosiłem Cię wcześniej zapamiętać?',
    type: 'choice' as const,
    options: [
      'Jabłko, dom, morze',
      'Gruszka, ogród, rzeka',
      'Jabłko, las, góra',
      'Dom, chmura, morze',
    ],
    correctAnswer: 'Jabłko, dom, morze',
    points: 3,
  },
  {
    id: 8,
    category: 'Język i rozumienie',
    question: 'Co robi się z parasolem, gdy pada deszcz?',
    type: 'choice' as const,
    options: ['Zamyka się go', 'Otwiera się go', 'Odkłada się go', 'Wyrzuca się go'],
    correctAnswer: 'Otwiera się go',
    points: 1,
  },
  {
    id: 9,
    category: 'Język i rozumienie',
    question: 'Dokończ zdanie: "Kamień wrzucony do wody..."',
    type: 'choice' as const,
    options: ['...płynie', '...tonie', '...wyparowuje', '...spala się'],
    correctAnswer: '...tonie',
    points: 1,
  },
  {
    id: 10,
    category: 'Orientacja przestrzenna',
    question: 'Gdzie zazwyczaj jest słońce o godzinie 12:00 w południe?',
    type: 'choice' as const,
    options: ['Na wschodzie', 'Na zachodzie', 'Na południu (wysoko)', 'Na północy'],
    correctAnswer: 'Na południu (wysoko)',
    points: 1,
  },
  {
    id: 11,
    category: 'Myślenie abstrakcyjne',
    question: 'Co łączy jabłko, banan i pomarańczę?',
    type: 'choice' as const,
    options: ['Są okrągłe', 'Są owocami', 'Są żółte', 'Rosną na drzewach'],
    correctAnswer: 'Są owocami',
    points: 1,
  },
  {
    id: 12,
    category: 'Myślenie abstrakcyjne',
    question: 'Pociąg jest do torów jak samolot jest do...?',
    type: 'choice' as const,
    options: ['Chmur', 'Nieba', 'Pasa startowego', 'Skrzydeł'],
    correctAnswer: 'Pasa startowego',
    points: 1,
  },
  {
    id: 13,
    category: 'Pamięć epizodyczna',
    question: 'Co robiłeś/aś wczoraj rano?',
    type: 'self_report' as const,
    options: ['Pamiętam dokładnie', 'Pamiętam ogólnie', 'Mam trudności z przypomnieniem', 'Nie pamiętam'],
    correctAnswer: 'Pamiętam dokładnie',
    points: 3,
  },
  {
    id: 14,
    category: 'Koncentracja',
    question: 'Czy potrafisz skupić uwagę na jednej czynności przez co najmniej 20 minut bez przerwy?',
    type: 'self_report' as const,
    options: ['Tak, bez problemu', 'Raczej tak', 'Mam z tym trudności', 'Nie, bardzo trudne'],
    correctAnswer: 'Tak, bez problemu',
    points: 2,
  },
  {
    id: 15,
    category: 'Funkcje wykonawcze',
    question: 'Wyobraź sobie, że planujesz wyjazd. W jakiej kolejności wykonujesz kroki?',
    type: 'choice' as const,
    options: [
      'Pakuję → rezerwuję → wyjeżdżam → planuję',
      'Planuję → rezerwuję → pakuję → wyjeżdżam',
      'Wyjeżdżam → planuję → rezerwuję → pakuję',
      'Rezerwuję → wyjeżdżam → planuję → pakuję',
    ],
    correctAnswer: 'Planuję → rezerwuję → pakuję → wyjeżdżam',
    points: 2,
  },
];

const AlzheimerTest = () => {
  const navigate = useNavigate();
  const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');
  const hasAccess = saved.hasAlzheimer === true;

  const [phase, setPhase] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(alzheimerQuestions.length).fill(''));
  const [selected, setSelected] = useState<string>('');
  const [textInput, setTextInput] = useState('');
  const [email, setEmail] = useState(saved.email || '');

  const totalPoints = alzheimerQuestions.reduce((s, q) => s + q.points, 0);

  const calcScore = () => {
    let score = 0;
    alzheimerQuestions.forEach((q, i) => {
      const ans = answers[i]?.toLowerCase().trim();
      if (q.type === 'memory_register') {
        const words = ['jabłko', 'dom', 'morze'];
        words.forEach(w => { if (ans?.includes(w)) score++; });
      } else if (q.type === 'self_report') {
        const idx = (q.options as string[]).indexOf(answers[i]);
        const maxIdx = (q.options as string[]).indexOf(q.correctAnswer as string);
        const earned = Math.max(0, q.points - idx);
        score += Math.min(earned, q.points);
      } else if (ans === (q.correctAnswer as string).toLowerCase()) {
        score += q.points;
      }
    });
    return score;
  };

  const handleNext = () => {
    const q = alzheimerQuestions[currentQ];
    const val = q.type === 'text' || q.type === 'memory_register' ? textInput : selected;
    const newAnswers = [...answers];
    newAnswers[currentQ] = val;
    setAnswers(newAnswers);

    if (currentQ + 1 < alzheimerQuestions.length) {
      setCurrentQ(currentQ + 1);
      setSelected('');
      setTextInput('');
    } else {
      setAnswers(newAnswers);
      setPhase('result');
    }
  };

  const score = phase === 'result' ? calcScore() : 0;
  const pct = Math.round((score / totalPoints) * 100);

  const handleEmailSave = async () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    const interp = getInterpretation(pct);
    try {
      await sendResultEmail({
        to: email,
        subject: 'Twój wynik testu funkcji poznawczych - brainmediq',
        title: 'Wynik testu funkcji poznawczych',
        subtitle: 'Orientacyjny test poznawczy',
        summary: 'Poniżej znajdziesz podsumowanie wyniku. Test ma charakter edukacyjny i nie zastępuje konsultacji medycznej.',
        rows: [
          { label: 'Wynik punktowy', value: `${score}/${totalPoints}` },
          { label: 'Procent wyniku', value: `${pct}%` },
          { label: 'Interpretacja', value: interp.label },
          { label: 'Charakter testu', value: 'orientacyjny' },
        ],
      });
      alert('Wyniki zostały wysłane na e-mail.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości.');
    }
  };

  const getInterpretation = (pct: number) => {
    if (pct >= 85) return { label: 'Wynik prawidłowy', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200', desc: 'Twoje wyniki wskazują na prawidłowe funkcjonowanie poznawcze w badanych obszarach. Nie stwierdzono niepokojących odchyleń.' };
    if (pct >= 65) return { label: 'Wynik w normie z drobnymi odchyleniami', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200', desc: 'Większość wyników jest w normie, jednak niektóre obszary mogą wymagać uwagi. Zalecamy regularną aktywność umysłową.' };
    if (pct >= 45) return { label: 'Wynik poniżej normy', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200', desc: 'Wyniki sugerują możliwe trudności w kilku obszarach poznawczych. Warto skonsultować się z lekarzem pierwszego kontaktu.' };
    return { label: 'Wynik wskazujący na trudności', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200', desc: 'Wyniki mogą wskazywać na istotne trudności poznawcze. Zalecamy pilną konsultację z lekarzem lub neurologiem.' };
  };

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto py-32 px-6 text-center">
        <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ClipboardCheck className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Test Funkcji Poznawczych</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Aby uzyskać dostęp do tego testu, dokonaj zakupu.</p>
          <Link to="/platnosc?type=alzheimer" className="inline-flex items-center px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg">
            Kup za 4,99 PLN
          </Link>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto py-24 px-6 relative z-10">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-3xl flex items-center justify-center mb-8">
            <ClipboardCheck className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Test Funkcji Poznawczych</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg leading-relaxed">
            Ten test bada orientację, pamięć, uwagę, język i myślenie abstrakcyjne. Składa się z {alzheimerQuestions.length} pytań i zajmuje ok. 10 minut.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-300 mb-1">Ważna informacja medyczna</p>
                <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                  Ten test ma wyłącznie charakter edukacyjny i orientacyjny. <strong>Nie jest narzędziem diagnostycznym</strong> i nie zastępuje badania lekarskiego ani specjalistycznej oceny neuropsychologicznej. Wyniki testu nie stanowią porady medycznej ani diagnozy choroby Alzheimera lub demencji. W razie jakichkolwiek obaw dotyczących funkcji poznawczych skonsultuj się z lekarzem.
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => setPhase('test')} className="w-full bg-teal-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20">
            Rozpocznij Test
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const interp = getInterpretation(pct);
    const cognitiveAreas = new Set(alzheimerQuestions.map((q) => q.category)).size;
    const nextSteps =
      pct >= 85
        ? ['Utrzymuj regularną aktywność umysłową, sen i ruch.', 'Powtórz test okresowo tylko wtedy, gdy zauważysz zmianę funkcjonowania.']
        : pct >= 65
          ? ['Zwróć uwagę na obszary z błędami i obserwuj, czy trudności powtarzają się w codziennym życiu.', 'Warto zadbać o sen, nawodnienie i spokojne warunki pracy umysłowej.']
          : ['Rozważ konsultację z lekarzem rodzinnym lub specjalistą, szczególnie jeśli trudności są nowe.', 'Zapisz przykłady sytuacji z codzienności, w których pamięć lub orientacja sprawiają problem.'];
    return (
      <div className="max-w-2xl mx-auto py-24 px-6 relative z-10">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
          <div className="text-center">
            <div className="text-7xl font-black text-teal-600 mb-2">{score}<span className="text-3xl text-slate-400">/{totalPoints}</span></div>
            <p className={`text-2xl font-bold ${interp.color}`}>{interp.label}</p>
          </div>

          <div className={`border rounded-2xl p-6 ${interp.bg}`}>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{interp.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-teal-50 p-5 text-center dark:bg-teal-900/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-300">Procent wyniku</p>
              <p className="mt-2 text-3xl font-black text-teal-700 dark:text-teal-300">{pct}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Obszary</p>
              <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{cognitiveAreas}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5 text-center dark:bg-blue-900/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">Charakter testu</p>
              <p className="mt-2 text-sm font-bold text-blue-700 dark:text-blue-300">orientacyjny</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/30">
            <h3 className="mb-4 text-lg font-bold dark:text-white">Co dalej?</h3>
            <div className="space-y-3">
              {nextSteps.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-black text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                <strong>Przypomnienie:</strong> Ten wynik ma charakter wyłącznie orientacyjny i nie stanowi diagnozy medycznej ani porady lekarskiej. Nie zastępuje profesjonalnej oceny klinicznej. Jeśli masz obawy co do swojego zdrowia poznawczego, skonsultuj się z lekarzem.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {alzheimerQuestions.map((q, i) => {
              const ans = answers[i]?.toLowerCase().trim();
              let correct = false;
              if (q.type === 'memory_register') {
                correct = ['jabłko','dom','morze'].every(w => ans?.includes(w));
              } else if (q.type === 'self_report') {
                correct = answers[i] === q.correctAnswer;
              } else {
                correct = ans === (q.correctAnswer as string).toLowerCase();
              }
              return (
                <div key={q.id} className={`p-4 rounded-2xl border text-sm ${correct ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200'}`}>
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">{q.category}</p>
                  <p className={correct ? 'text-emerald-600' : 'text-rose-600'}>{correct ? '✓ Prawidłowa odpowiedź' : `✗ Oczekiwano: ${q.correctAnswer}`}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <h3 className="text-lg font-bold dark:text-white mb-4">Wyślij wyniki na e-mail</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Twój e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
              />
              <button
                onClick={handleEmailSave}
                disabled={!email.includes('@')}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all disabled:opacity-50"
              >
                Wyślij
              </button>
            </div>
          </div>

          <Link to="/inne-testy" className="block w-full text-center bg-teal-600 text-white py-5 rounded-2xl font-bold hover:bg-teal-700 transition-all">
            Powrót do testów
          </Link>
        </div>
      </div>
    );
  }

  const q = alzheimerQuestions[currentQ];
  const progress = ((currentQ) / alzheimerQuestions.length) * 100;
  const canProceed = q.type === 'text' || q.type === 'memory_register' ? textInput.trim().length > 0 : selected !== '';

  return (
    <div className="max-w-2xl mx-auto py-24 px-6 relative z-10">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Pytanie {currentQ + 1} z {alzheimerQuestions.length}</span>
            <span className="font-bold text-teal-600">{q.category}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 leading-relaxed whitespace-pre-line">{q.question}</h2>

        {(q.type === 'text' || q.type === 'memory_register') ? (
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder={q.type === 'memory_register' ? 'Wpisz zapamiętane słowa...' : 'Wpisz odpowiedź...'}
            className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-teal-500 resize-none"
            rows={3}
          />
        ) : (
          <div className="space-y-3">
            {(q.options as string[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`w-full text-left px-6 py-4 rounded-2xl border-2 font-medium transition-all ${selected === opt ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-300'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="mt-8 w-full bg-teal-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentQ + 1 === alzheimerQuestions.length ? 'Zobacz wyniki' : 'Następne pytanie'}
        </button>
      </div>
    </div>
  );
};

// --- ADHD TEST ---

const adhdQuestions = [
  { id: 1, part: 'A', text: 'Jak często masz trudności z dokończeniem ostatnich szczegółów projektu, gdy najtrudniejsza część jest już za Tobą?' },
  { id: 2, part: 'A', text: 'Jak często masz trudności z porządkowaniem spraw, gdy musisz wykonać zadanie wymagające organizacji?' },
  { id: 3, part: 'A', text: 'Jak często masz problem z zapamiętywaniem spotkań lub zobowiązań?' },
  { id: 4, part: 'A', text: 'Gdy masz zadanie wymagające dużo myślenia, jak często unikasz jego rozpoczęcia lub odkładasz je na później?' },
  { id: 5, part: 'A', text: 'Jak często wiercisz się lub kręcisz rękami/nogami, gdy musisz siedzieć przez dłuższy czas?' },
  { id: 6, part: 'A', text: 'Jak często czujesz się nadmiernie aktywny/a i zmuszony/a do działania, jakby napędzał/a Cię jakiś silnik?' },
  { id: 7, part: 'B', text: 'Jak często popełniasz nieostrożne błędy, gdy pracujesz nad nudnym lub trudnym projektem?' },
  { id: 8, part: 'B', text: 'Jak często masz trudności z utrzymaniem uwagi przy wykonywaniu nudnych lub powtarzalnych czynności?' },
  { id: 9, part: 'B', text: 'Jak często masz trudności z koncentracją, gdy ktoś do Ciebie mówi, nawet bezpośrednio?' },
  { id: 10, part: 'B', text: 'Jak często gubisz lub masz trudności ze znalezieniem przedmiotów w domu lub w pracy?' },
  { id: 11, part: 'B', text: 'Jak często rozpraszają Cię otaczające hałasy lub zdarzenia?' },
  { id: 12, part: 'B', text: 'Jak często wstajesz ze swojego miejsca na spotkaniach lub w innych sytuacjach, gdy powinieneś/powinnaś siedzieć?' },
  { id: 13, part: 'B', text: 'Jak często czujesz się niespokojny/a lub pobudzony/a?' },
  { id: 14, part: 'B', text: 'Jak często masz trudności z odpoczywaniem lub relaksowaniem się, gdy masz chwilę wolnego?' },
  { id: 15, part: 'B', text: 'Jak często mówisz za dużo w sytuacjach towarzyskich?' },
  { id: 16, part: 'B', text: 'Jak często kończysz zdania rozmówców lub mówisz coś przed nimi, gdy uczestniczysz w rozmowie?' },
  { id: 17, part: 'B', text: 'Jak często masz trudności z czekaniem na swoją kolej w sytuacjach, gdy kolejność ma znaczenie?' },
  { id: 18, part: 'B', text: 'Jak często przerywasz innym, gdy są zajęci?' },
];

const adhdFrequencies = ['Nigdy', 'Rzadko', 'Czasami', 'Często', 'Bardzo często'];

const ADHDTest = () => {
  const navigate = useNavigate();
  const saved = JSON.parse(localStorage.getItem('iq_results') || '{}');
  const hasAccess = saved.hasADHD === true;

  const [phase, setPhase] = useState<'intro' | 'test' | 'result'>('intro');
  const [answers, setAnswers] = useState<number[]>(Array(adhdQuestions.length).fill(-1));
  const [currentQ, setCurrentQ] = useState(0);
  const [email, setEmail] = useState(saved.email || '');

  const partAScore = answers.slice(0, 6).reduce((s, v) => s + Math.max(0, v), 0);
  const totalScore = answers.reduce((s, v) => s + Math.max(0, v), 0);
  const partAPositive = answers.slice(0, 6).filter((v, i) => {
    const thresholds = [2, 2, 2, 2, 3, 3];
    return v >= thresholds[i];
  }).length;

  const getResult = () => {
    if (partAPositive >= 4) return {
      label: 'Wysokie prawdopodobieństwo ADHD',
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200',
      desc: 'Twoje odpowiedzi w kluczowej części testu są wysoce zgodne z objawami ADHD u dorosłych. Zdecydowanie zalecamy konsultację z psychiatrą lub psychologiem specjalizującym się w ADHD.',
    };
    if (partAPositive >= 2 || totalScore >= 24) return {
      label: 'Możliwe objawy ADHD',
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200',
      desc: 'Część Twoich odpowiedzi sugeruje obecność pewnych objawów związanych z ADHD. Może warto porozmawiać z lekarzem lub psychologiem, szczególnie jeśli objawy wpływają na codzienne funkcjonowanie.',
    };
    return {
      label: 'Niskie prawdopodobieństwo ADHD',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200',
      desc: 'Twoje odpowiedzi nie wskazują na silne objawy ADHD. Jeśli jednak masz obawy dotyczące koncentracji lub impulsywności, zawsze możesz skonsultować się ze specjalistą.',
    };
  };

  const handleEmailSave = async () => {
    const s = JSON.parse(localStorage.getItem('iq_results') || '{}');
    localStorage.setItem('iq_results', JSON.stringify({ ...s, email }));
    const result = getResult();
    const maxScore = adhdQuestions.length * 4;
    const scorePct = Math.round((totalScore / maxScore) * 100);
    try {
      await sendResultEmail({
        to: email,
        subject: 'Twój wynik testu ADHD - brainmediq',
        title: 'Wynik testu ADHD',
        subtitle: 'Skala ASRS v1.1',
        summary: 'Poniżej znajdziesz podsumowanie wyniku. Test ma charakter przesiewowy i nie zastępuje diagnozy klinicznej.',
        rows: [
          { label: 'Wynik łączny', value: `${totalScore}/${maxScore}` },
          { label: 'Natężenie', value: `${scorePct}%` },
          { label: 'Część A', value: `${partAPositive}/6 kluczowych objawów` },
          { label: 'Interpretacja', value: result.label },
        ],
      });
      alert('Wyniki zostały wysłane na e-mail.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości.');
    }
  };

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto py-32 px-6 text-center">
        <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <SlidersHorizontal className="w-10 h-10 text-violet-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Test ADHD (ASRS)</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Aby uzyskać dostęp do tego testu, dokonaj zakupu.</p>
          <Link to="/platnosc?type=adhd" className="inline-flex items-center px-8 py-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg">
            Kup za 4,99 PLN
          </Link>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto py-24 px-6 relative z-10">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-3xl flex items-center justify-center mb-8">
            <SlidersHorizontal className="w-10 h-10 text-violet-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2 dark:text-white">Test ADHD</h1>
          <p className="text-sm font-bold text-violet-600 mb-4 uppercase tracking-widest">Skala ASRS v1.1 (WHO)</p>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg leading-relaxed">
            Kwestionariusz oparty na Skali Samooceny ADHD dla Dorosłych (ASRS v1.1), opracowanej przez WHO i Uniwersytet Harvarda. Składa się z {adhdQuestions.length} pytań i zajmuje ok. 5–8 minut.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-300 mb-1">Ważna informacja medyczna</p>
                <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                  Ten test ma wyłącznie charakter przesiewowy i edukacyjny. <strong>Nie jest narzędziem diagnostycznym</strong> i nie zastępuje oceny klinicznej przeprowadzonej przez wykwalifikowanego specjalistę. Wyniki nie stanowią diagnozy ADHD ani żadnej innej choroby, ani porady medycznej. Diagnoza ADHD wymaga kompleksowej oceny psychiatrycznej lub psychologicznej.
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => setPhase('test')} className="w-full bg-violet-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20">
            Rozpocznij Test
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const result = getResult();
    const maxScore = adhdQuestions.length * 4;
    const scorePct = Math.round((totalScore / maxScore) * 100);
    const partBPersistent = answers.slice(6).filter((v) => v >= 3).length;
    const nextSteps =
      partAPositive >= 4
        ? ['Zapisz konkretne przykłady trudności z pracy, nauki i życia domowego.', 'Umów konsultację ze specjalistą, który może przeprowadzić pełną ocenę kliniczną.']
        : partAPositive >= 2 || totalScore >= 24
          ? ['Obserwuj, czy objawy powtarzają się w kilku obszarach życia, a nie tylko w jednej sytuacji.', 'Pomocne może być omówienie wyniku z psychologiem lub lekarzem, jeśli trudności przeszkadzają na co dzień.']
          : ['Wynik nie wskazuje na silny wzorzec objawów, ale dbaj o sen, organizację dnia i przerwy w pracy.', 'Jeśli mimo wyniku masz duże trudności z uwagą, warto skonsultować konkretne objawy.'];
    return (
      <div className="max-w-2xl mx-auto py-24 px-6 relative z-10">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
          <div className="text-center">
            <div className="text-6xl font-black text-violet-600 mb-2">{totalScore}<span className="text-2xl text-slate-400">/{adhdQuestions.length * 4}</span></div>
            <p className={`text-2xl font-bold ${result.color}`}>{result.label}</p>
            <p className="text-sm text-slate-500 mt-1">Część A: {partAPositive}/6 kluczowych objawów</p>
          </div>

          <div className={`border rounded-2xl p-6 ${result.bg}`}>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 text-center">
              <p className="text-3xl font-black text-violet-600">{partAScore}</p>
              <p className="text-sm text-slate-500 mt-1">Wynik Część A</p>
              <p className="text-xs text-slate-400">(6 kluczowych pytań)</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 text-center">
              <p className="text-3xl font-black text-slate-700 dark:text-slate-200">{totalScore}</p>
              <p className="text-sm text-slate-500 mt-1">Wynik łączny</p>
              <p className="text-xs text-slate-400">(wszystkie 18 pytań)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-violet-50 p-5 text-center dark:bg-violet-900/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-violet-700 dark:text-violet-300">Natężenie</p>
              <p className="mt-2 text-3xl font-black text-violet-700 dark:text-violet-300">{scorePct}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Część B często</p>
              <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{partBPersistent}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5 text-center dark:bg-blue-900/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">Skala</p>
              <p className="mt-2 text-sm font-bold text-blue-700 dark:text-blue-300">ASRS v1.1</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/30">
            <h3 className="mb-4 text-lg font-bold dark:text-white">Co dalej?</h3>
            <div className="space-y-3">
              {nextSteps.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-black text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                <strong>Przypomnienie:</strong> Wyniki tego testu nie stanowią diagnozy medycznej ani porady lekarskiej. Nie zastępują oceny przeprowadzonej przez psychiatrę lub psychologa. Jeśli masz obawy, skonsultuj się ze specjalistą.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <h3 className="text-lg font-bold dark:text-white mb-4">Wyślij wyniki na e-mail</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Twój e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
              />
              <button
                onClick={handleEmailSave}
                disabled={!email.includes('@')}
                className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all disabled:opacity-50"
              >
                Wyślij
              </button>
            </div>
          </div>

          <Link to="/inne-testy" className="block w-full text-center bg-violet-600 text-white py-5 rounded-2xl font-bold hover:bg-violet-700 transition-all">
            Powrót do testów
          </Link>
        </div>
      </div>
    );
  }

  const q = adhdQuestions[currentQ];
  const progress = (currentQ / adhdQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-24 px-6 relative z-10">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Pytanie {currentQ + 1} z {adhdQuestions.length}</span>
            <span className={`font-bold px-3 py-1 rounded-full text-xs ${q.part === 'A' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              Część {q.part} {q.part === 'A' ? '(kluczowa)' : ''}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div className="bg-violet-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Oceń częstotliwość w ciągu ostatnich 6 miesięcy</p>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 leading-relaxed">{q.text}</h2>

        <div className="space-y-3">
          {adhdFrequencies.map((freq, idx) => (
            <button
              key={freq}
              onClick={() => {
                const newAnswers = [...answers];
                newAnswers[currentQ] = idx;
                setAnswers(newAnswers);
                setTimeout(() => {
                  if (currentQ + 1 < adhdQuestions.length) {
                    setCurrentQ(currentQ + 1);
                  } else {
                    setPhase('result');
                  }
                }, 180);
              }}
              className={`w-full text-left px-6 py-4 rounded-2xl border-2 font-medium transition-all flex items-center gap-4 ${answers[currentQ] === idx ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-300'}`}
            >
              <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 border-current">{idx}</span>
              {freq}
            </button>
          ))}
        </div>
      </div>
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
      icon: <Layers className="w-full h-full" />,
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
      icon: <LayoutGrid className="w-full h-full" />,
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
      icon: <Eye className="w-full h-full" />,
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
      icon: <Gauge className="w-full h-full" />,
      color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
      status: 'Dostępny',
      link: '/test-reakcji',
      hasAccess: saved.hasReakcja === true
    },
    {
      id: 'alzheimer',
      title: 'Test Funkcji Poznawczych',
      price: '4,99 PLN',
      desc: 'Zbadaj orientację, pamięć, uwagę i język. Test inspirowany metodologią MMSE/SAGE. Wyłącznie cel edukacyjny — nie jest diagnozą medyczną.',
      icon: <ClipboardCheck className="w-full h-full" />,
      color: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      status: 'Dostępny',
      link: '/test-funkcji-poznawczych',
      hasAccess: saved.hasAlzheimer === true,
      disclaimer: true,
    },
    {
      id: 'adhd',
      title: 'Test ADHD (ASRS)',
      price: '4,99 PLN',
      desc: 'Kwestionariusz przesiewowy oparty na skali WHO ASRS v1.1. Wyłącznie cel edukacyjny — nie jest diagnozą medyczną.',
      icon: <SlidersHorizontal className="w-full h-full" />,
      color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
      status: 'Dostępny',
      link: '/test-adhd',
      hasAccess: saved.hasADHD === true,
      disclaimer: true,
    },
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
            {'disclaimer' in test && test.disclaimer && (
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Nie jest diagnozą medyczną</span>
              </div>
            )}
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
        { q: "Ile trwa test i ile ma pytań?", a: "Czas trwania i liczba pytań zależą od wybranego badania. Standardowy test IQ oraz Analiza PRO składają się z 19 zadań opartych na matrycach i wzorcach logicznych (ok. 12-14 min). Inne testy specjalistyczne, jak test osobowości (15 pytań) czy testy szybkości reakcji, mają własne, krótsze ramy czasowe." },
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
    { id: "percentyl", title: "4. Interpretacja percentyli" },
    { id: "analiza-pro", title: "5. Analiza PRO" },
    { id: "nie-diagnoza", title: "6. To nie jest diagnoza" },
    { id: "slownik", title: "7. Słownik pojęć" }
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
            Test koncentruje się na <strong>inteligencji płynnej</strong>, czyli zdolności do zauważania reguł, porównywania wzorców i rozwiązywania nowych problemów bez korzystania z wyuczonej wiedzy szkolnej. Zadania są oparte głównie na matrycach, symbolach, liczbach i relacjach przestrzennych.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[900px]">
            {[
              { t: 'Wzorce i reguły', d: 'Rozpoznawanie, co zmienia się w wierszach, kolumnach i sekwencjach.' },
              { t: 'Myślenie bez słów', d: 'Większość zadań nie wymaga wiedzy językowej ani szkolnych definicji.' },
              { t: 'Szybka analiza', d: 'Limit czasu sprawdza nie tylko poprawność, ale też sprawność pracy poznawczej.' },
            ].map(item => (
              <div key={item.t} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h4 className="mb-2 font-bold text-slate-900 dark:text-white">{item.t}</h4>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="format-czas" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Format i czas</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-10 max-w-prose">Aktualna wersja testu jest krótsza i bardziej spójna wizualnie. Zawiera wyłącznie zadania przygotowane na podstawie przesłanych wzorców i dopasowane do stylu serwisu:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px]">
            <div className="p-8 bg-white dark:bg-slate-900 border rounded-3xl border-blue-200 shadow-sm">
              <h4 className="font-bold text-lg mb-3">Struktura testu</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Test składa się z 19 zadań. Luka w matrycach znajduje się konsekwentnie w prawym dolnym rogu, a pytania obejmują matryce, układy symboli, liczby, analogie, przestrzeń i logikę.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 border rounded-3xl shadow-sm">
              <h4 className="font-bold text-lg mb-3">Limit czasu (14 min)</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Limit 14 minut daje średnio około 45 sekund na zadanie. To wystarczająco dużo, żeby rozpoznać regułę, ale nadal wymaga skupienia i sprawnego tempa pracy.</p>
            </div>
          </div>
        </div>

        <div id="jak-liczymy" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Jak liczymy wynik</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-12 max-w-prose">
            Wynik nie jest prostą informacją „ile odpowiedzi było poprawnych”. Liczymy go na podstawie poprawności, trudności zadań oraz rozkładu wyników przyjętego dla skali IQ:
          </p>
          <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-12 max-w-prose space-y-4">
            <li><strong>Poprawność odpowiedzi:</strong> każde zadanie ma jedną prawidłową odpowiedź wynikającą z reguły układu.</li>
            <li><strong>Trudność zadania:</strong> trudniejsze pytania mają większy wpływ na wynik niż pytania łatwe.</li>
            <li><strong>Skala IQ:</strong> wynik surowy jest przeliczany na skalę ze średnią 100 i odchyleniem standardowym 15 punktów.</li>
            <li><strong>Przedział ufności:</strong> pokazujemy zakres, w którym najprawdopodobniej znajduje się wynik rzeczywisty, bo każdy test online ma naturalny margines błędu.</li>
          </ul>
          
          <ScoreGenerationInfographic />
          
          <p className="text-base text-slate-500 leading-relaxed italic mt-12 max-w-prose">
            Schemat pokazuje uproszczony przepływ: odpowiedzi → punkty ważone → wynik IQ → percentyl i raport. Wynik należy traktować jako orientacyjny pomiar online, nie jako diagnozę kliniczną.
          </p>
        </div>

        <div id="percentyl" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Interpretacja percentyli</h2>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1 space-y-6">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg max-w-prose">
                Percentyl pomaga zrozumieć wynik w prostszy sposób niż sama liczba IQ. Pokazuje, jaki odsetek osób w przyjętej populacji odniesienia uzyskał wynik niższy od Twojego.
              </p>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Info className="text-blue-600" size={20} />
                  Przykład interpretacji:
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Jeśli Twój wynik to <strong>95. percentyl</strong>, oznacza to, że wynik jest wyższy niż u około 95 na 100 osób w porównaniu. Nie oznacza to diagnozy ani stałej etykiety, ale pomaga ocenić poziom na tle innych.
                </p>
              </div>
            </div>
            <div className="md:w-80 w-full p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Percent size={32} />
               </div>
               <h4 className="font-bold text-xl mb-4">Skala Percentylowa</h4>
               <div className="w-full space-y-3">
                  <div className="flex justify-between text-xs px-2"><span className="text-slate-400">Wybitny</span><span className="font-bold">98+</span></div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 w-[98%]"></div>
                  </div>
                  <div className="flex justify-between text-xs px-2"><span className="text-slate-400">Wysoki</span><span className="font-bold">75-97</span></div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-400 w-[85%]"></div>
                  </div>
                  <div className="flex justify-between text-xs px-2"><span className="text-slate-400">Przeciętny</span><span className="font-bold">25-74</span></div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-slate-300 w-[50%]"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div id="analiza-pro" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Analiza PRO</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-10 max-w-prose">
            Analiza PRO rozwija sam wynik IQ o praktyczne informacje: profil domen poznawczych, paski procentowe, percentyl, certyfikat PDF i prosty plan rozwoju. Celem jest pokazanie, w jakich typach zadań radzisz sobie najlepiej i co warto ćwiczyć dalej.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { t: "Profil domen", d: "Wyniki procentowe dla matryc, logiki, analogii, przestrzeni i ciągów liczbowych." },
              { t: "Raport i certyfikat", d: "Pełny raport po płatności oraz certyfikat PDF wysyłany na adres e-mail." },
              { t: "Plan rozwoju", d: "Krótkie, proste wskazówki bez zbędnego żargonu psychologicznego." }
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
              Standardowy wynik daje liczbę i certyfikat. Analiza PRO dodaje kontekst: pokazuje mocniejsze i słabsze obszary, wyjaśnia percentyl oraz podaje konkretne ćwiczenia. Dzięki temu raport jest bardziej użyteczny niż sam wynik punktowy.
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
              Pomiar wykonany przez serwis <BrandName className="text-lg" /> ma charakter edukacyjny i rozwojowy. Nie zastępuje profesjonalnej diagnozy psychologicznej, badania klinicznego ani oficjalnych testów prowadzonych przez psychologa. Na wynik mogą wpływać m.in. zmęczenie, stres, pośpiech, jakość ekranu i warunki wykonywania testu.
            </p>
          </div>
        </div>

        <div id="slownik" className="scroll-mt-32">
          <h2 className="text-4xl font-bold mb-12 dark:text-white">Słownik pojęć</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px]">
            {[
              { t: "Wynik IQ", d: "Orientacyjny wynik na skali, gdzie średnia wynosi 100, a jedno odchylenie standardowe to 15 punktów." },
              { t: "Przedział ufności", d: "Zakres, który pokazuje możliwy margines błędu pomiaru online." },
              { t: "Inteligencja płynna", d: "Zdolność do rozwiązywania nowych problemów, zauważania reguł i pracy na abstrakcyjnych wzorcach." },
              { t: "Percentyl", d: "Informacja, jaki odsetek osób uzyskał wynik niższy od Twojego w przyjętym porównaniu." },
              { t: "Domena poznawcza", d: "Kategoria umiejętności badana w raporcie, np. logika, matryce albo wyobraźnia przestrzenna." },
              { t: "Plan rozwoju", d: "Krótka lista ćwiczeń i wskazówek dopasowanych do profilu wyników." }
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
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <Icons.X size={24} />
        </button>
        
        <div className="p-10 md:p-14 text-center">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Brain size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Gotowy na wyzwanie?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
            Test trwa około 12-14 minut i składa się z 19 zadań logicznych. Upewnij się, że masz chwilę spokoju i nikt Ci nie będzie przeszkadzał.
          </p>
          
          <div className="flex flex-col gap-4">
            <Link to="/test" onClick={onClose} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
              Rozpocznij Test IQ
            </Link>
            <button onClick={onClose} className="text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors">Wróć później</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderLegalInline = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

const LegalDocumentPage = ({
  markdown,
  title,
  description,
}: {
  markdown: string;
  title: string;
  description: string;
}) => {
  const lines = markdown.split('\n');

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:py-32">
      <article className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-12">
        <div className="mb-10 border-b border-slate-100 pb-8 dark:border-slate-800">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
            Dokument prawny
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
          {lines.map((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={index} className="h-1" />;
            if (trimmed === '---') {
              return <hr key={index} className="my-8 border-slate-100 dark:border-slate-800" />;
            }
            if (trimmed.startsWith('# ')) {
              return (
                <h2 key={index} className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {trimmed.replace(/^#\s+/, '')}
                </h2>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={index} className="pt-8 text-xl font-bold text-slate-900 dark:text-white">
                  {trimmed.replace(/^##\s+/, '')}
                </h3>
              );
            }
            if (trimmed.startsWith('- ')) {
              return (
                <p
                  key={index}
                  className="pl-5 text-slate-600 before:mr-2 before:content-['•'] dark:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: renderLegalInline(trimmed.replace(/^-\s+/, '')) }}
                />
              );
            }
            return (
              <p
                key={index}
                dangerouslySetInnerHTML={{ __html: renderLegalInline(trimmed) }}
              />
            );
          })}
        </div>
      </article>
    </div>
  );
};

const RegulaminPage = () => (
  <LegalDocumentPage
    markdown={REGULAMIN_MARKDOWN}
    title="Regulamin"
    description="Zasady korzystania z serwisu brainmediq.com."
  />
);

const PrivacyPolicyPage = () => (
  <LegalDocumentPage
    markdown={PRIVACY_POLICY_MARKDOWN}
    title="Polityka prywatności"
    description="Informacje o przetwarzaniu danych osobowych, cookies i prawach użytkownika."
  />
);

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 no-print">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex-1 text-sm text-slate-300 leading-relaxed">
            <h4 className="text-white font-bold text-base mb-1">Cenimy Twoją prywatność</h4>
            Nasza strona używa plików cookies niezbędnych do prawidłowego działania aplikacji, obsługi płatności oraz do celów analitycznych. Dalsze korzystanie ze strony oznacza wyrażenie zgody na ich użycie. Więcej informacji znajdziesz w <Link to="/prywatnosc" onClick={() => window.scrollTo(0,0)} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Polityce Prywatności</Link>.
          </div>
          <div className="flex shrink-0 gap-3 w-full md:w-auto">
            <button 
              onClick={handleAccept}
              className="flex-1 md:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Akceptuję
            </button>
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
            <Route path="/test-funkcji-poznawczych" element={<AlzheimerTest />} />
            <Route path="/test-adhd" element={<ADHDTest />} />
            <Route path="/prywatnosc" element={<PrivacyPolicyPage />} />
            <Route path="/regulamin" element={<RegulaminPage />} />
            <Route path="*" element={<div className="p-32 text-center text-2xl font-bold">404 - Strony nie znaleziono</div>} />
          </Routes>
        </main>
        <Footer openPurchaseModal={() => setIsPurchaseModalOpen(true)} />
        <PurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} />
        <CookieBanner />
      </div>
    </HashRouter>
  );
};

export default App;
