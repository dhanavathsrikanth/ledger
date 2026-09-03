import React, { useState, useRef, useEffect } from 'react';
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
  LogOut,
  Calendar,
  Sparkles,
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
}) => {
  const { currentUser, logout } = useAuth();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [yearStr, monthStr] = currentMonthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const now = new Date();
  const actualCurrentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = currentMonthKey === actualCurrentMonthKey;

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAuthMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleJumpToCurrentMonth = () => {
    onMonthChange(actualCurrentMonthKey);
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
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main top bar */}
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2 sm:gap-4">
          {/* Logo & Cloud Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0 font-['Outfit']">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                  Ledger
                </span>
                <div 
                  title="Directly connected to Firebase Firestore Cloud Vault"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="hidden xs:inline">Cloud Active</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Personal Expense &amp; Budget Intelligence
              </p>
            </div>
          </div>

          {/* Month Switcher (Center on desktop) */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              title="Previous Month"
              className="p-1 sm:p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-1.5 sm:px-3 text-xs sm:text-sm font-bold text-slate-900 tracking-tight text-center min-w-[95px] sm:min-w-[130px] font-['Outfit'] truncate">
              {monthLabel}
            </div>
            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              title="Next Month"
              className="p-1 sm:p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isCurrentMonth && (
              <button
                onClick={handleJumpToCurrentMonth}
                title="Jump to Current Month"
                className="hidden md:inline-flex items-center gap-1 ml-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition"
              >
                <Calendar className="w-3 h-3" />
                <span>Today</span>
              </button>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Budgets Modal Button */}
            <button
              onClick={onOpenBudgetModal}
              id="header-budget-btn"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 transition shadow-2xs"
              title="Adjust category and overall monthly budget ceilings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Budgets</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={onExportCSV}
              id="header-export-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 transition shadow-2xs"
              title="Export all transactions as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            {/* Primary Action: Add Transaction */}
            <button
              onClick={onOpenAddModal}
              id="header-add-tx-btn"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition shadow-xs hover:shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
              <span className="hidden sm:inline">Transaction</span>
            </button>

            {/* User Account / Sign-out dropdown */}
            <div className="relative" ref={menuRef}>
              {currentUser ? (
                <button
                  onClick={() => setShowAuthMenu(!showAuthMenu)}
                  id="user-account-menu-btn"
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 bg-slate-100/90 hover:bg-slate-200/80 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800 transition"
                  title={currentUser.displayName || currentUser.email || 'Cloud Account'}
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="avatar" 
                      className="w-6 h-6 rounded-lg object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold font-['Outfit']">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline max-w-[85px] truncate font-medium">
                    {currentUser.isAnonymous ? 'Guest' : (currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0])}
                  </span>
                </button>
              ) : null}

              {/* Account Dropdown Menu */}
              {showAuthMenu && currentUser && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 text-xs animate-slideUp">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">
                      {currentUser.displayName || 'Private Vault User'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {currentUser.email || (currentUser.isAnonymous ? 'Guest session' : 'Authenticated')}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 w-fit">
                      <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Firestore Cloud Encrypted</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowAuthMenu(false);
                        onOpenBudgetModal();
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                      <span>Configure Budgets</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthMenu(false);
                        onExportCSV();
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                      <span>Export Data (.CSV)</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthMenu(false);
                        onResetData();
                      }}
                      className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-500" />
                      <span>Clear Cloud Data</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      disabled={isAuthLoading}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-semibold transition"
                    >
                      {isAuthLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      ) : (
                        <LogOut className="w-4 h-4 text-slate-500" />
                      )}
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Tab Navigation Bar */}
        <div className="hidden sm:flex items-center gap-1 pt-1 pb-2 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
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
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Transactions Ledger</span>
          </button>

          <button
            onClick={() => onTabChange('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
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
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
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
