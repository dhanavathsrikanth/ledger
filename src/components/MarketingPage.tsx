import React, { useState } from 'react';
import { 
  Lock, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  Database,
  Sparkles,
  ReceiptText,
  SlidersHorizontal,
  PieChart as PieChartIcon,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  ArrowDownRight
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
  const [previewTab, setPreviewTab] = useState<'overview' | 'ledger' | 'insights'>('overview');

  const handleGoogleClick = async () => {
    try {
      setErrorMessage(null);
      setLoadingType('google');
      await onSignInGoogle();
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Sign-in popup was blocked by your browser. Please allow popups or use Guest Demo Mode.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in was cancelled before completion.');
      } else {
        setErrorMessage(err.message || 'Unable to sign in. Please try again or use Guest Demo Mode.');
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
      setErrorMessage(err.message || 'Unable to start guest session.');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Inter',sans-serif]">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs font-['Outfit']">
              ₹
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-['Outfit']">
                Ledger
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Cloud Vault
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleGuestClick}
              disabled={loadingType !== null || isAuthLoading}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition inline-flex items-center gap-1.5"
            >
              {loadingType === 'guest' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Explore Demo</span>
            </button>
            <button
              onClick={handleGoogleClick}
              disabled={loadingType !== null || isAuthLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs"
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
      <main className="flex-1">
        {/* Error Notification if popup is blocked */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mt-4 px-4">
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
                <button 
                  onClick={handleGuestClick}
                  className="mt-1 font-bold text-blue-700 hover:underline"
                >
                  Click here to proceed instantly with Demo Mode &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="pt-12 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-6 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Cloud Database &bull; Strictly Private to Your Account</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] leading-[1.18] mb-5">
              Personal expense management with absolute clarity and privacy.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
              Track daily expenses, set category spending limits, calculate safe daily burn rates, and store everything in your own private cloud vault with instant real-time sync.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                onClick={handleGoogleClick}
                disabled={loadingType !== null || isAuthLoading}
                id="hero-google-login-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs hover:shadow-md"
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
                <span>Sign in with Google</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleGuestClick}
                disabled={loadingType !== null || isAuthLoading}
                id="hero-guest-login-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition shadow-2xs"
              >
                {loadingType === 'guest' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Try Instant Demo</span>
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Zero Data Sharing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Encrypted Firestore
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Instant CSV Export
              </span>
            </div>
          </div>

          {/* Interactive UI Mockup Preview */}
          <div className="mt-12 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] max-w-4xl mx-auto">
            {/* Window header with tab switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 mb-5 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs font-bold text-slate-800 font-['Outfit']">Dashboard Demo</span>
              </div>

              {/* Preview Mode Switcher */}
              <div className="flex items-center bg-slate-100/90 p-1 rounded-xl text-xs font-bold border border-slate-200/60 self-start sm:self-auto">
                <button
                  onClick={() => setPreviewTab('overview')}
                  className={`px-3 py-1 rounded-lg transition ${
                    previewTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  KPI Overview
                </button>
                <button
                  onClick={() => setPreviewTab('ledger')}
                  className={`px-3 py-1 rounded-lg transition ${
                    previewTab === 'ledger' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Ledger View
                </button>
                <button
                  onClick={() => setPreviewTab('insights')}
                  className={`px-3 py-1 rounded-lg transition ${
                    previewTab === 'insights' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Pacing &amp; Limits
                </button>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {previewTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Inflow</span>
                    <div className="text-base sm:text-xl font-extrabold text-slate-900 mt-1 font-['Outfit']">₹1,20,000</div>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Salary &amp; returns</span>
                  </div>
                  <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Outflow</span>
                    <div className="text-base sm:text-xl font-extrabold text-slate-900 mt-1 font-['Outfit']">₹42,500</div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">18 expenses logged</span>
                  </div>
                  <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net Balance</span>
                    <div className="text-base sm:text-xl font-extrabold text-indigo-600 mt-1 font-['Outfit']">+₹77,500</div>
                    <span className="text-[10px] text-indigo-600 font-semibold mt-0.5 block">64.6% savings rate</span>
                  </div>
                  <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Safe Daily Burn</span>
                    <div className="text-base sm:text-xl font-extrabold text-blue-600 mt-1 font-['Outfit']">₹1,850/d</div>
                    <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">14 days left in month</span>
                  </div>
                </div>

                {/* Mini chart visual bar */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-800">Monthly Spending Ceiling Utilization</span>
                    <span className="font-extrabold text-slate-700">₹42,500 / ₹60,000 (71%)</span>
                  </div>
                  <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[71%]" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LEDGER */}
            {previewTab === 'ledger' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                      🛒
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Weekly Groceries &amp; Provisions</p>
                      <p className="text-[11px] text-slate-500 font-medium">Food &bull; Today &bull; UPI</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 font-['Outfit'] text-sm">-₹3,250</span>
                    <span className="text-[10px] text-rose-600 font-bold block">Expense</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      💼
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Consulting Milestone Invoice</p>
                      <p className="text-[11px] text-slate-500 font-medium">Income &bull; Yesterday &bull; Net Banking</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-600 font-['Outfit'] text-sm">+₹35,000</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">Inflow</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      ⛽
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Vehicle Fuel Refill</p>
                      <p className="text-[11px] text-slate-500 font-medium">Transportation &bull; 2 days ago &bull; Credit Card</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 font-['Outfit'] text-sm">-₹2,100</span>
                    <span className="text-[10px] text-rose-600 font-bold block">Expense</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: INSIGHTS */}
            {previewTab === 'insights' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1 font-['Outfit']">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>Top Outflow Driver</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    <strong>Food &amp; Dining</strong> accounted for 38% of your outflows this month. You have ₹4,200 remaining in this category's limit.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1 font-['Outfit']">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Savings Health Score</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Your savings rate is <strong>64.6%</strong>, comfortably surpassing the recommended 20% benchmark.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Built strictly for privacy and ease of use
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Gain full visibility into your monthly cash flows without complex spreadsheets or manual formulas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                    Direct Cloud Storage
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No manual sync buttons or data conflicts. Every transaction directly updates your isolated Firestore cloud database in real time.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-[11px] font-bold text-blue-700 flex items-center gap-1">
                  <span>Instant cloud durability</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                    Strict User Isolation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Only authenticated users can add or see their data. Security rules at the database engine enforce strict privacy for all your transactions.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Zero data leakage</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                    Budget Caps &amp; Pacing
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Set overall monthly spending limits or category-specific limits. Get safe daily burn alerts before you exceed your target.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-[11px] font-bold text-purple-700 flex items-center gap-1">
                  <span>Intelligent burn rate metrics</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Steps */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Three steps to complete financial awareness
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center mx-auto sm:mx-0 font-['Outfit']">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 font-['Outfit']">Sign in with Google</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect securely using Firebase Authentication. Your unique user ID instantly maps to your private collection.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center mx-auto sm:mx-0 font-['Outfit']">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 font-['Outfit']">Log Transactions &amp; Budgets</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add incomes and expenses with categories (Food, Housing, Travel, Bills), payment methods, and notes. Set your budget caps.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center mx-auto sm:mx-0 font-['Outfit']">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 font-['Outfit']">Monitor Health &amp; Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Analyze interactive charts, monthly balance trends, and export all records to standard CSV files at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight">
                Ready to master your monthly cash flow?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sign in with your Google account to unlock your private cloud expense vault.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleGoogleClick}
                  disabled={loadingType !== null || isAuthLoading}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-sm text-xs sm:text-sm"
                >
                  {loadingType === 'google' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.5 1.9 7.1l3.7 2.8C6.5 6.7 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.5l3.7 2.9c2.2-2 3.7-5 3.7-8.6z" />
                      <path fill="#FBBC05" d="M5.6 14.9c-.2-.7-.4-1.4-.4-2.2 0-.8.2-1.5.4-2.2L1.9 7.7C.7 10.1 0 11.5 0 12.7c0 1.2.7 2.6 1.9 5l3.7-2.8z" />
                      <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-1.7-6.4-4.2L1.9 17.4C3.7 21 7.5 23.5 12 23.5z" />
                    </svg>
                  )}
                  <span>Sign In with Google</span>
                </button>
                <button
                  onClick={handleGuestClick}
                  disabled={loadingType !== null || isAuthLoading}
                  className="px-5 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition text-xs sm:text-sm"
                >
                  Try Demo First
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-['Outfit']">Ledger</span>
            <span>&bull;</span>
            <span>Firebase Cloud Storage</span>
          </div>
          <p>
            Strict per-user data isolation.
          </p>
        </div>
      </footer>
    </div>
  );
};
