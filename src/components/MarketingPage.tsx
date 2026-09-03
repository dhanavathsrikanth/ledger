import React, { useState } from 'react';
import { 
  ShieldCheck, 
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
  Calendar,
  Wallet,
  Receipt
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
      setErrorMessage(err.message || 'Unable to start guest session.');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Inter',sans-serif]">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              ₹
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-['Outfit']">
                Ledger
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                Personal Finance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleGuestClick}
              disabled={loadingType !== null || isAuthLoading}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition hidden xs:inline-flex"
            >
              {loadingType === 'guest' ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
              Instant Demo
            </button>
            <button
              onClick={handleGoogleClick}
              disabled={loadingType !== null || isAuthLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition shadow-xs"
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
                  Click here to proceed instantly with Guest Mode &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-6">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Direct Cloud Database &bull; Private Per-User Access</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] leading-[1.15] mb-5">
              Personal expense management with absolute privacy.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
              Ledger is a dedicated personal finance application. Log daily expenses, define monthly spending caps, analyze cash flow trends, and safeguard your data directly in your private cloud vault.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                onClick={handleGoogleClick}
                disabled={loadingType !== null || isAuthLoading}
                id="hero-google-login-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm hover:shadow-md"
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
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleGuestClick}
                disabled={loadingType !== null || isAuthLoading}
                id="hero-guest-login-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition shadow-xs"
              >
                {loadingType === 'guest' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Try Demo Session</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Individual User Isolation
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Direct Cloud Storage
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                CSV Data Portability
              </span>
            </div>
          </div>

          {/* Interactive UI Mockup Preview */}
          <div className="mt-12 sm:mt-16 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs font-bold text-slate-700 font-['Outfit']">Ledger Dashboard Preview</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Live Data Snapshot
              </div>
            </div>

            {/* Metrics cards mockup */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500">Total Income</span>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 font-['Outfit']">₹1,20,000</div>
                <span className="text-[10px] text-emerald-600 font-medium">Monthly salary &amp; returns</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500">Total Expenses</span>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 font-['Outfit']">₹42,500</div>
                <span className="text-[10px] text-slate-500 font-medium">18 transactions</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500">Net Surplus</span>
                <div className="text-base sm:text-lg font-bold text-emerald-600 mt-1 font-['Outfit']">+₹77,500</div>
                <span className="text-[10px] text-emerald-600 font-medium">64.6% savings rate</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500">Safe Daily Burn</span>
                <div className="text-base sm:text-lg font-bold text-blue-600 mt-1 font-['Outfit']">₹1,850/day</div>
                <span className="text-[10px] text-slate-500 font-medium">Based on budget cap</span>
              </div>
            </div>

            {/* Sample transaction preview */}
            <div className="border border-slate-100 rounded-xl p-3 sm:p-4 bg-[#FAFBFD]">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-3">
                <span>Recent Sample Activity</span>
                <span className="text-[11px] text-blue-600">Encrypted in your account</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[11px]">
                      🛒
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Weekly Groceries &amp; Market</p>
                      <p className="text-[10px] text-slate-400">UPI &bull; Food &amp; Dining</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">-₹3,250</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px]">
                      💼
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Consulting Milestone</p>
                      <p className="text-[10px] text-slate-400">Bank Transfer &bull; Income</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600">+₹35,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Built strictly for privacy and control
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Every component is crafted to give you complete visibility over your personal wealth without complex setup.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Direct Cloud Storage
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No confusing manual sync buttons or data conflicts. When you record or edit an expense, it immediately writes directly to your cloud collection in Firebase Firestore.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-blue-700">
                  Real-time cloud durability &rarr;
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Strict User Isolation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Only authenticated users can add or see their data. Security rules at the database engine guarantee that no other user can read or alter your financial transactions.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700">
                  Zero data leakage &rarr;
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Budget Caps &amp; Pace Control
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Set total monthly limits or category-specific targets. Ledger continuously calculates your safe daily burn rate and alerts you before you exceed your target.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-purple-700">
                  Intelligent pacing metrics &rarr;
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Three steps to complete financial awareness
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mx-auto sm:mx-0">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900">Sign in with Google</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect securely using Firebase Authentication. Your unique user ID instantly creates your private ledger collection.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mx-auto sm:mx-0">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900">Log Transactions &amp; Budgets</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add incomes and expenses with categories (Food, Housing, Travel, Bills, etc.), payment modes, and notes. Adjust monthly limits as needed.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mx-auto sm:mx-0">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900">Monitor Health &amp; Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review interactive charts, monthly balance trends, and export all records to standard CSV files whenever you wish.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-md">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight">
                Ready to take control of your financial flow?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sign in with your Google account to unlock your private cloud expense ledger now.
              </p>
              <div className="pt-3">
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
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-['Outfit']">Ledger</span>
            <span>&bull;</span>
            <span>Direct Firebase Cloud Persistence</span>
          </div>
          <p>
            Private, per-user authenticated data isolation.
          </p>
        </div>
      </footer>
    </div>
  );
};
