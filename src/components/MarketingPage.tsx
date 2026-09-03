import React, { useState } from 'react';
import { 
  Lock, 
  TrendingUp, 
  PieChart, 
  SlidersHorizontal, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  Database,
  Sparkles,
  Wallet,
  Receipt,
  Zap,
  Activity,
  ArrowUpRight,
  BarChart3,
  HelpCircle,
  EyeOff,
  Globe,
  Layers,
  Check,
  X,
  ChevronDown
} from 'lucide-react';

interface MarketingPageProps {
  onSignInGoogle: () => Promise<void>;
  onSignInGuest: () => Promise<void>;
  isAuthLoading?: boolean;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({
  onSignInGoogle,
  onSignInGuest,
  isAuthLoading = false
}) => {
  const [loadingType, setLoadingType] = useState<'google' | 'guest' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive Demo Widget State
  const [activeDemoTab, setActiveDemoTab] = useState<'overview' | 'simulator' | 'categories'>('overview');
  const [simulatorMonthlyBudget, setSimulatorMonthlyBudget] = useState<number>(60000);
  const [simulatorDaysRemaining, setSimulatorDaysRemaining] = useState<number>(18);
  const [simulatorSpentSoFar, setSimulatorSpentSoFar] = useState<number>(24500);

  // FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleGoogleClick = async () => {
    try {
      setErrorMessage(null);
      setLoadingType('google');
      await onSignInGoogle();
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Sign-in popup was blocked by your browser. Please allow popups or use Guest Mode.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in was cancelled before completion.');
      } else {
        setErrorMessage(err.message || 'Unable to sign in. Please try again or use Guest Mode.');
      }
    } finally {
      setLoadingType(null);
    }
  };

  const handleGuestClick = async () => {
    try {
      setErrorMessage(null);
      setLoadingType('guest');
      await onSignInGuest();
    } catch (err: any) {
      console.error('Guest sign-in error:', err);
      setErrorMessage(err.message || 'Unable to start demo session.');
    } finally {
      setLoadingType(null);
    }
  };

  // Simulator calculations
  const remainingBudget = Math.max(0, simulatorMonthlyBudget - simulatorSpentSoFar);
  const calculatedDailyBurn = simulatorDaysRemaining > 0 ? Math.round(remainingBudget / simulatorDaysRemaining) : 0;
  const burnPercentage = Math.min(100, Math.round((simulatorSpentSoFar / simulatorMonthlyBudget) * 100));

  const faqs = [
    {
      q: 'How does Ledger protect my financial data privacy?',
      a: 'Ledger operates with zero telemetry selling and strict database isolation. Every account has its own isolated Firestore partition guarded by Firebase security rules. Only your authenticated user account can read, write, or query your transactions.'
    },
    {
      q: 'Do I need to link my bank account credentials?',
      a: 'No. Ledger avoids the security risks and scraping vulnerabilities of third-party bank screen-scrapers. You log and tag your transactions manually or import them, giving you 100% control over what data is entered without exposing net banking passwords or OTPs.'
    },
    {
      q: 'How does the Safe Daily Burn Rate calculation work?',
      a: 'Ledger computes your remaining budget for the month and divides it by the exact number of days left in your billing cycle. It dynamically recalibrates every time you log an expense, giving you a crystal-clear daily allowance to prevent end-of-month budget deficits.'
    },
    {
      q: 'Can I export my transactions if I ever decide to leave?',
      a: 'Yes, with one click. Ledger believes in complete data portability. You can download your complete transaction ledger as a standard CSV format anytime to use in Excel, Google Sheets, or any accounting platform.'
    },
    {
      q: 'Is Ledger free to use?',
      a: 'Yes! Ledger is provided with no subscription paywalls, no pop-up advertisements, and no tiered locks on your personal financial data.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-['Inter',sans-serif] selection:bg-blue-600 selection:text-white">
      {/* Ambient background glow accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-500/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Global Commercial Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20 border border-blue-400/30">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white font-['Outfit']">
                  Ledger
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/60">
                  Cloud Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#simulator" className="hover:text-white transition">Live Simulator</a>
            <a href="#comparison" className="hover:text-white transition">Why Ledger</a>
            <a href="#security" className="hover:text-white transition">Data Privacy</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleGuestClick}
              disabled={loadingType !== null || isAuthLoading}
              id="nav-guest-btn"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-800/80 border border-slate-800 transition hidden sm:inline-flex items-center gap-1.5"
            >
              {loadingType === 'guest' ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
              <span>Live Demo</span>
            </button>
            <button
              onClick={handleGoogleClick}
              disabled={loadingType !== null || isAuthLoading}
              id="nav-signin-btn"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-md shadow-blue-600/20 border border-blue-500/40 active:scale-98"
            >
              {loadingType === 'google' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.5 1.9 7.1l3.7 2.8C6.5 6.7 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.5l3.7 2.9c2.2-2 3.7-5 3.7-8.6z" />
                  <path fill="#FBBC05" d="M5.6 14.9c-.2-.7-.4-1.4-.4-2.2 0-.8.2-1.5.4-2.2L1.9 7.7C.7 10.1 0 11.5 0 12.7c0 1.2.7 2.6 1.9 5l3.7-2.8z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-1.7-6.4-4.2L1.9 17.4C3.7 21 7.5 23.5 12 23.5z" />
                </svg>
              )}
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto mt-4 px-4">
            <div className="p-3.5 bg-amber-950/80 border border-amber-600/50 text-amber-200 rounded-xl text-xs flex items-start gap-2.5 shadow-lg backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
                <button 
                  onClick={handleGuestClick}
                  className="mt-1 font-bold text-blue-400 hover:underline"
                >
                  Click here to proceed immediately in Live Demo Mode &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 text-slate-200 border border-slate-700/80 mb-8 shadow-inner backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Next-Gen Personal Expense &amp; Cash Flow Cloud</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-blue-400">Zero Ads</span>
            </div>

            {/* Main Catchphrase */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.1] mb-6">
              Master your wealth with <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                uncompromising privacy.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
              A high-precision personal finance engine. Track daily expenses, configure intelligent category budgets, analyze cash velocity, and store every rupee securely in your private cloud vault.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-10">
              <button
                onClick={handleGoogleClick}
                disabled={loadingType !== null || isAuthLoading}
                id="hero-google-login-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/25 border border-blue-500/50 active:scale-98"
              >
                {loadingType === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.5 1.9 7.1l3.7 2.8C6.5 6.7 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.5l3.7 2.9c2.2-2 3.7-5 3.7-8.6z" />
                    <path fill="#FBBC05" d="M5.6 14.9c-.2-.7-.4-1.4-.4-2.2 0-.8.2-1.5.4-2.2L1.9 7.7C.7 10.1 0 11.5 0 12.7c0 1.2.7 2.6 1.9 5l3.7-2.8z" />
                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-1.7-6.4-4.2L1.9 17.4C3.7 21 7.5 23.5 12 23.5z" />
                  </svg>
                )}
                <span>Get Started with Google</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <button
                onClick={handleGuestClick}
                disabled={loadingType !== null || isAuthLoading}
                id="hero-guest-login-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800/90 hover:text-white border border-slate-700/80 rounded-xl transition shadow-sm active:scale-98"
              >
                {loadingType === 'guest' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
                <span>Explore Live Demo</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Row-Level User Isolation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Direct Firebase Firestore
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Instant CSV Export
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No Bank Scrapers Required
              </span>
            </div>
          </div>

          {/* Interactive Commercial Showcase Canvas */}
          <div className="mt-16 sm:mt-20 max-w-5xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-slate-900/80 shadow-2xl shadow-blue-900/20">
            <div className="bg-[#0D131F] rounded-[15px] border border-slate-800 p-4 sm:p-7 text-left">
              {/* Showcase Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/90 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <span className="text-xs font-bold text-slate-300 font-['Outfit'] tracking-wide">
                    Ledger Platform Engine &bull; Live Interactive Showcase
                  </span>
                </div>

                {/* Showcase Switcher Tabs */}
                <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveDemoTab('overview')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      activeDemoTab === 'overview'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Financial Overview
                  </button>
                  <button
                    onClick={() => setActiveDemoTab('simulator')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      activeDemoTab === 'simulator'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Burn Rate Simulator
                  </button>
                  <button
                    onClick={() => setActiveDemoTab('categories')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      activeDemoTab === 'categories'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Category Breakdown
                  </button>
                </div>
              </div>

              {/* View 1: Financial Overview Showcase */}
              {activeDemoTab === 'overview' && (
                <div className="pt-6 space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Total Income</span>
                        <span className="text-emerald-400 text-[10px] font-bold">+12% vs last mo</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white font-['Outfit']">₹1,25,000</div>
                      <div className="text-[11px] text-slate-500 mt-1">Direct salary &amp; dividend flow</div>
                    </div>

                    <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Total Expenses</span>
                        <span className="text-blue-400 text-[10px] font-bold">24 logged</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-slate-200 font-['Outfit']">₹48,200</div>
                      <div className="text-[11px] text-slate-500 mt-1">Within monthly cap target</div>
                    </div>

                    <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Net Surplus</span>
                        <span className="text-emerald-400 text-[10px] font-bold">61.4% saved</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-400 font-['Outfit']">+₹76,800</div>
                      <div className="text-[11px] text-slate-500 mt-1">Available for investments</div>
                    </div>

                    <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Safe Daily Burn</span>
                        <span className="text-amber-400 text-[10px] font-bold">14 days left</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-blue-400 font-['Outfit']">₹1,914/day</div>
                      <div className="text-[11px] text-slate-500 mt-1">Safe velocity threshold</div>
                    </div>
                  </div>

                  {/* Sample Transaction Stream */}
                  <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-3">
                      <span>Real-Time Cloud Ledger Stream</span>
                      <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                        <Database className="w-3 h-3" /> Firestore Encrypted
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
                            🛒
                          </div>
                          <div>
                            <p className="font-semibold text-white">Hypermarket &amp; Pantry Supplies</p>
                            <p className="text-[10px] text-slate-400">UPI Payment &bull; Food &amp; Dining</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-200">-₹2,840</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                            ⚡
                          </div>
                          <div>
                            <p className="font-semibold text-white">Fiber Internet &amp; Utility Power</p>
                            <p className="text-[10px] text-slate-400">Auto Debit &bull; Bills &amp; Utilities</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-200">-₹1,499</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                            💼
                          </div>
                          <div>
                            <p className="font-semibold text-white">Client Product Design Retainer</p>
                            <p className="text-[10px] text-slate-400">Bank Transfer &bull; Income</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-400">+₹45,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Safe Daily Burn Rate Simulator */}
              {activeDemoTab === 'simulator' && (
                <div className="pt-6 space-y-6 animate-fadeIn">
                  <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">Interactive Safe Burn Rate Calculator</h4>
                        <p className="text-xs text-slate-400">Adjust the sliders below to test how Ledger guides your daily pace.</p>
                      </div>
                      <div className="px-3 py-1 bg-blue-950/80 border border-blue-800 rounded-lg text-xs font-bold text-blue-400">
                        {burnPercentage}% of budget used
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1.5">
                            <span>Monthly Target Budget</span>
                            <span className="text-blue-400">₹{simulatorMonthlyBudget.toLocaleString('en-IN')}</span>
                          </div>
                          <input
                            type="range"
                            min="20000"
                            max="200000"
                            step="5000"
                            value={simulatorMonthlyBudget}
                            onChange={(e) => setSimulatorMonthlyBudget(Number(e.target.value))}
                            className="w-full accent-blue-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1.5">
                            <span>Expenses Incurred So Far</span>
                            <span className="text-slate-200">₹{simulatorSpentSoFar.toLocaleString('en-IN')}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={simulatorMonthlyBudget}
                            step="2000"
                            value={simulatorSpentSoFar}
                            onChange={(e) => setSimulatorSpentSoFar(Number(e.target.value))}
                            className="w-full accent-blue-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1.5">
                            <span>Days Remaining in Month</span>
                            <span className="text-amber-400">{simulatorDaysRemaining} days</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="31"
                            step="1"
                            value={simulatorDaysRemaining}
                            onChange={(e) => setSimulatorDaysRemaining(Number(e.target.value))}
                            className="w-full accent-blue-500 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Resulting burn calculation */}
                      <div className="bg-[#080D15] rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Calculated Safe Velocity</span>
                          <div className="text-3xl font-extrabold text-blue-400 font-['Outfit'] mt-1">
                            ₹{calculatedDailyBurn.toLocaleString('en-IN')}
                            <span className="text-sm font-normal text-slate-400"> / day</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Spending under this allowance ensures you reach the end of the month with ₹{remainingBudget.toLocaleString('en-IN')} unspent surplus.
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Current Health Status:</span>
                          <span className={`font-bold px-2 py-0.5 rounded-full ${
                            burnPercentage < 75 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {burnPercentage < 75 ? 'Optimal Pace' : 'Accelerated Pace'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Category Breakdown Showcase */}
              {activeDemoTab === 'categories' && (
                <div className="pt-6 space-y-4 animate-fadeIn">
                  <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
                    <h4 className="text-sm font-bold text-white mb-1">Categorical Allocation Matrix</h4>
                    <p className="text-xs text-slate-400 mb-4">Detailed spending distribution across primary budget sectors.</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">Housing &amp; Rent (₹22,000 / ₹25,000)</span>
                          <span className="text-slate-400">88%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">Food &amp; Dining (₹9,450 / ₹12,000)</span>
                          <span className="text-slate-400">78%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">Transportation &amp; Fuel (₹4,100 / ₹6,000)</span>
                          <span className="text-slate-400">68%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '68%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">Shopping &amp; Lifestyle (₹3,850 / ₹8,000)</span>
                          <span className="text-slate-400">48%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '48%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Commercial Features Bento Grid */}
        <section id="features" className="py-20 border-y border-slate-800/80 bg-[#080D15]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/60">
                Architectural Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] mt-4 mb-3">
                Engineered for clarity, speed, and discretion
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Everything you need to orchestrate your monthly budget without algorithmic tracking or privacy violations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-7 bg-[#0D131F] rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20 group-hover:scale-105 transition">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                    Direct Cloud Firestore Persistence
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No fragile local-cache dependencies or browser cache clear panics. Every transaction is written directly to your dedicated cloud collection with instantaneous atomic consistency.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                  <span>99.99% Cloud availability</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-7 bg-[#0D131F] rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20 group-hover:scale-105 transition">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                    Strict Row-Level Partitioning
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Security is not an afterthought. Cloud Firestore security rules enforce that <code className="text-emerald-400">request.auth.uid == userId</code> on all reads and writes. No other user can ever touch your data.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span>Zero cross-tenant leaks</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-7 bg-[#0D131F] rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/20 group-hover:scale-105 transition">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                    Safe Daily Burn Calculation
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Eliminate month-end surprises. Ledger continuously analyzes your spending pace, remaining calendar days, and budget limits to recommend an exact daily spend ceiling.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
                  <span>Dynamic pacing algorithms</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-7 bg-[#0D131F] rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20 group-hover:scale-105 transition">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                    Interactive Monthly Trend Visuals
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Explore high-resolution charts of month-over-month cash flow, category breakdowns, and daily transaction heatmaps to identify leakages and habits easily.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                  <span>Full historical analytics</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 5 */}
              <div className="p-7 bg-[#0D131F] rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/20 group-hover:scale-105 transition">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                    Universal CSV Portability
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your data is always yours. With one click, export all historical records into standard comma-separated format for tax accountants, Excel, or Google Sheets.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-semibold text-purple-400 flex items-center gap-1">
                  <span>Zero platform lock-in</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 6 */}
              <div className="p-7 bg-[#0D131F] rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 border border-rose-500/20 group-hover:scale-105 transition">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                    Zero Ad Retargeting or Brokers
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Commercial tracker apps monetize your transaction history by pitching high-interest credit cards and loans. Ledger has no advertisers, no trackers, and no sponsorships.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                  <span>100% telemetry privacy</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial Comparison Section */}
        <section id="comparison" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
              Commercial Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] mt-4 mb-3">
              Why modern leaders switch to Ledger
            </h2>
            <p className="text-sm text-slate-400">
              Compare Ledger against outdated spreadsheets and ad-riddled mobile trackers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-2xl overflow-hidden bg-[#0D131F]">
              <thead className="bg-slate-900/90 text-slate-300 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-4 px-5">Platform Feature</th>
                  <th className="py-4 px-5 text-slate-400">Manual Spreadsheets</th>
                  <th className="py-4 px-5 text-slate-400">Ad-Supported Trackers</th>
                  <th className="py-4 px-5 text-blue-400 bg-blue-950/30">Ledger Cloud</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Direct Real-Time Cloud Sync</td>
                  <td className="py-3.5 px-5 text-slate-400">Requires manual file saves</td>
                  <td className="py-3.5 px-5 text-slate-400">Delayed or proprietary</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold bg-blue-950/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Firebase Firestore
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Strict Row-Level Partitioning</td>
                  <td className="py-3.5 px-5 text-slate-400">Shared link risk</td>
                  <td className="py-3.5 px-5 text-slate-400">Aggregated for ad targeting</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold bg-blue-950/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Auth UID Verified
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Safe Daily Burn Rate Logic</td>
                  <td className="py-3.5 px-5 text-slate-400">Manual formula writing</td>
                  <td className="py-3.5 px-5 text-slate-400">Rare or locked behind paywalls</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold bg-blue-950/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Automatic &amp; Real-time
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Zero Third-Party Advertising</td>
                  <td className="py-3.5 px-5 text-emerald-400">Yes</td>
                  <td className="py-3.5 px-5 text-rose-400 flex items-center gap-1">
                    <X className="w-4 h-4" /> Heavy loan &amp; credit card ads
                  </td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold bg-blue-950/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> 100% Ad-Free
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Bank Credential Safety</td>
                  <td className="py-3.5 px-5 text-emerald-400">Safe (Manual)</td>
                  <td className="py-3.5 px-5 text-rose-400 flex items-center gap-1">
                    <X className="w-4 h-4" /> Demands bank login scrape
                  </td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold bg-blue-950/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Zero Bank Risk
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Security & Infrastructure Highlights */}
        <section id="security" className="py-16 bg-[#080D15]/90 border-y border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0D131F] to-[#0B0F17] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Security &amp; Cloud Architecture</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                  Your finances belong to you. <br />Never to third-party brokers.
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Ledger utilizes Google Firebase Cloud infrastructure with audited security rules. No server administrators, background workers, or analytics scripts have permissions to inspect your user transaction records.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="text-xs font-medium text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    AES-256 Cloud Encryption
                  </span>
                  <span className="text-xs font-medium text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    Google Identity OAuth 2.0
                  </span>
                  <span className="text-xs font-medium text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    Strict Owner-Only Rules
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0">
                <button
                  onClick={handleGoogleClick}
                  disabled={loadingType !== null || isAuthLoading}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Create Encrypted Vault</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial FAQ Section */}
        <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/60">
              Clear Answers
            </span>
            <h2 className="text-3xl font-extrabold text-white font-['Outfit'] mt-4 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything you need to know about Ledger's architecture and privacy policy.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-800 rounded-xl overflow-hidden bg-[#0D131F] transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Final Conversion Action Banner */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20 border border-blue-400/30">
            {/* Background geometric accents */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-black/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                100% Free &bull; Zero Commercial Ads
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] tracking-tight">
                Take command of your financial future today.
              </h3>
              <p className="text-xs sm:text-base text-blue-100 leading-relaxed font-normal">
                Join users tracking expenses with direct cloud durability and complete peace of mind.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleGoogleClick}
                  disabled={loadingType !== null || isAuthLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-lg text-sm"
                >
                  {loadingType === 'google' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.5 1.9 7.1l3.7 2.8C6.5 6.7 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.5l3.7 2.9c2.2-2 3.7-5 3.7-8.6z" />
                      <path fill="#FBBC05" d="M5.6 14.9c-.2-.7-.4-1.4-.4-2.2 0-.8.2-1.5.4-2.2L1.9 7.7C.7 10.1 0 11.5 0 12.7c0 1.2.7 2.6 1.9 5l3.7-2.8z" />
                      <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-1.7-6.4-4.2L1.9 17.4C3.7 21 7.5 23.5 12 23.5z" />
                    </svg>
                  )}
                  <span>Sign In with Google</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </button>

                <button
                  onClick={handleGuestClick}
                  disabled={loadingType !== null || isAuthLoading}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-800/60 hover:bg-blue-800/80 border border-blue-400/40 transition text-sm flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Explore Demo First</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Commercial Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080D15] py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  ₹
                </div>
                <span className="font-extrabold text-base text-white font-['Outfit']">Ledger</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Systems Operational
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm">
                Direct Firebase Firestore persistence with client-isolated security rules and real-time pacing calculations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <a href="#features" className="hover:text-white transition">Platform Features</a>
              <a href="#simulator" className="hover:text-white transition">Burn Simulator</a>
              <a href="#security" className="hover:text-white transition">Security Architecture</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <p>&copy; {new Date().getFullYear()} Ledger Platform. Built for privacy and financial sovereignty.</p>
            <div className="flex items-center gap-4">
              <span>Google Firebase Auth &bull; Cloud Firestore</span>
              <span>CSV Portability</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
