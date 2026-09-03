import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  SlidersHorizontal, 
  Download, 
  RotateCcw,
  LayoutDashboard,
  ReceiptText,
  PieChart as PieChartIcon,
  Target,
  Cloud,
  CloudOff,
  LogIn,
  LogOut,
  User as UserIcon,
  Loader2
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentMonthKey: string;
  onMonthChange: (monthKey: string) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  availableMonths: string[];
  isCloudSynced: boolean;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonthKey,
  onMonthChange,
  activeTab,
  onTabChange,
  onOpenAddModal,
  onOpenBudgetModal,
  onExportCSV,
  onResetData,
  isCloudSynced,
  isSyncing,
}) => {
  const { currentUser, loading: authLoading, signInWithGoogle, signInGuest, logout } = useAuth();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  const [yearStr, monthStr] = currentMonthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 2, 1);
    const key = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(key);
  };

  const handleNextMonth = () => {
    const next = new Date(year, month, 1);
    const key = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(key);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithGoogle();
      setShowAuthMenu(false);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsAuthLoading(true);
      await signInGuest();
      setShowAuthMenu(false);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      await logout();
      setShowAuthMenu(false);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 sm:py-3.5 gap-2.5 sm:gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0">
                ₹
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-['Outfit'] truncate">
                    Ledger
                  </h1>
                  {/* Database Cloud Status Badge */}
                  <div 
                    title="Directly connected to Firebase Firestore Cloud Database"
                    className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wide border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    <Cloud className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                    <span className="hidden xs:inline">Cloud Vault</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate hidden xs:block">
                  Personal expenses &amp; budget intelligence
                </p>
              </div>
            </div>

            {/* Mobile Month Switcher & Auth */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
                <button
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                  className="p-1 rounded hover:bg-white text-slate-600 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-slate-800 px-1 font-['Outfit']">
                  {monthLabel.split(' ')[0]} '{String(year).slice(2)}
                </span>
                <button
                  onClick={handleNextMonth}
                  aria-label="Next Month"
                  className="p-1 rounded hover:bg-white text-slate-600 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Controls & CTAs */}
          <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2.5">
            {/* Desktop Month Selector */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200/70">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-1.5 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 py-1 text-sm font-semibold text-slate-800 tracking-tight min-w-[140px] text-center">
                {monthLabel}
              </div>
              <button
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-1.5 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end">
              {/* Budget Configuration Button */}
              <button
                onClick={onOpenBudgetModal}
                id="header-budget-btn"
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-xs"
                title="Set and adjust category budgets"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Budgets</span>
              </button>

              {/* Export CSV */}
              <button
                onClick={onExportCSV}
                id="header-export-btn"
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-xs"
                title="Export all transactions as CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xs:inline">CSV</span>
              </button>

              {/* Clear Data */}
              <button
                onClick={onResetData}
                id="header-reset-btn"
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-rose-600 transition"
                title="Clear all transactions and reset data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Clear Data</span>
              </button>

              {/* Primary Action: Add Transaction */}
              <button
                onClick={onOpenAddModal}
                id="header-add-tx-btn"
                className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs hover:shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Add</span>
                <span className="hidden sm:inline">Transaction</span>
              </button>

              {/* User Account / Firebase Cloud Auth */}
              <div className="relative shrink-0">
                {currentUser ? (
                  <button
                    onClick={() => setShowAuthMenu(!showAuthMenu)}
                    id="user-account-menu-btn"
                    className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 transition"
                    title={currentUser.displayName || currentUser.email || 'Cloud Account'}
                  >
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="avatar" 
                        className="w-5 h-5 rounded-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline max-w-[90px] truncate">
                      {currentUser.isAnonymous ? 'Guest' : (currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0])}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuthMenu(!showAuthMenu)}
                    id="cloud-sign-in-btn"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition shadow-xs"
                    title="Connect Firebase Firestore Database"
                  >
                    <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden xs:inline">Sync</span>
                  </button>
                )}

              {/* Dropdown Menu */}
              {showAuthMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-fadeIn"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">
                      {currentUser?.isAnonymous 
                        ? 'Guest Cloud Account' 
                        : (currentUser?.displayName || currentUser?.email || 'Cloud Account')}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {currentUser?.email || `User ID: ${currentUser?.uid.slice(0, 10)}...`}
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] text-emerald-700 bg-emerald-50 rounded-lg flex items-center gap-1.5">
                      <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct Firestore Ledger</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isAuthLoading || authLoading}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-100 overflow-x-auto scrollbar-none py-1 gap-1">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => onTabChange('transactions')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Transactions Log</span>
          </button>

          <button
            onClick={() => onTabChange('reports')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>Category Spending Reports</span>
          </button>

          <button
            onClick={() => onTabChange('budgets')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'budgets'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Budget Insights &amp; Health</span>
          </button>
        </div>
      </div>
    </header>
  );
};
