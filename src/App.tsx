import React, { useState, useEffect, useMemo } from 'react';
import { 
  Transaction, 
  BudgetConfig, 
  ActiveTab 
} from './types';
import { INITIAL_BUDGET_CONFIG } from './data/initialData';
import { 
  calculateMonthlyStats, 
  getMonthTrends, 
  getDailySpending, 
  exportToCSV
} from './utils/calculations';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { BudgetInsightsBanner } from './components/BudgetInsightsBanner';
import { ChartsSection } from './components/ChartsSection';
import { CategoryReport } from './components/CategoryReport';
import { TransactionList } from './components/TransactionList';
import { RecentTransactions } from './components/RecentTransactions';
import { BudgetInsightsTab } from './components/BudgetInsightsTab';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { MarketingPage } from './components/MarketingPage';
import { 
  CheckCircle, 
  Info, 
  Plus, 
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  Loader2
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { 
  subscribeToTransactions, 
  subscribeToBudgetConfig, 
  saveTransactionToFirestore, 
  deleteTransactionFromFirestore, 
  saveBudgetConfigToFirestore,
  clearAllUserDataInFirestore,
  testFirestoreConnection
} from './services/firestoreService';

const now = new Date();
const CURRENT_YEAR_MONTH = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

export default function App() {
  const { currentUser, loading: authLoading, signInWithGoogle, signInGuest } = useAuth();
  
  // Transactions and Budget are stored directly in Firebase Firestore
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(INITIAL_BUDGET_CONFIG);
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(CURRENT_YEAR_MONTH);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [categoryFilterForList, setCategoryFilterForList] = useState<string>('all');
  const [defaultCategoryForModal, setDefaultCategoryForModal] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Direct Firestore synchronization for authenticated user
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setBudgetConfig(INITIAL_BUDGET_CONFIG);
      return;
    }

    // Clean any prior local storage caches to enforce pure cloud storage
    try {
      localStorage.removeItem('expense_tracker_txs_clean_v1');
      localStorage.removeItem('expense_tracker_budget_clean_v1');
      localStorage.removeItem('expense_tracker_txs_inr_v1');
      localStorage.removeItem('expense_tracker_txs_inr_v2');
      localStorage.removeItem('expense_tracker_budget_inr_v1');
      localStorage.removeItem('expense_tracker_budget_inr_v2');
    } catch (e) {
      // Ignore storage cleanup issues
    }

    // Test connectivity per skill requirements
    testFirestoreConnection(currentUser.uid);

    // Subscribe to the authenticated user's real-time transactions in Firestore
    const unsubTxs = subscribeToTransactions(
      currentUser.uid,
      (cloudTxs) => {
        setTransactions(cloudTxs);
      },
      (err) => {
        console.error('Firestore transactions subscription error:', err);
      }
    );

    // Subscribe to the authenticated user's budget config in Firestore
    const unsubBudget = subscribeToBudgetConfig(
      currentUser.uid,
      (cloudBudget) => {
        if (cloudBudget) {
          setBudgetConfig(cloudBudget);
        } else {
          setBudgetConfig(INITIAL_BUDGET_CONFIG);
        }
      },
      (err) => {
        console.error('Firestore budget subscription error:', err);
      }
    );

    return () => {
      unsubTxs();
      unsubBudget();
    };
  }, [currentUser]);

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    return calculateMonthlyStats(transactions, currentMonthKey, budgetConfig);
  }, [transactions, currentMonthKey, budgetConfig]);

  // Calculate trends for the last 6 months relative to currentMonthKey
  const monthTrends = useMemo(() => {
    return getMonthTrends(transactions, currentMonthKey, 6);
  }, [transactions, currentMonthKey]);

  // Calculate daily spending
  const dailySpend = useMemo(() => {
    return getDailySpending(transactions, currentMonthKey);
  }, [transactions, currentMonthKey]);

  // Available unique months
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(CURRENT_YEAR_MONTH);
    for (const t of transactions) {
      if (t.date) {
        set.add(t.date.slice(0, 7));
      }
    }
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Save Transaction directly to Firebase Firestore
  const handleSaveTransaction = async (
    txData: Omit<Transaction, 'id'>,
    existingId?: string
  ) => {
    if (!currentUser) return;

    let savedTx: Transaction;
    if (existingId) {
      savedTx = { ...txData, id: existingId };
      // Optimistic update
      setTransactions((prev) =>
        prev.map((t) => (t.id === existingId ? savedTx : t))
      );
      showToast('Transaction updated');
    } else {
      savedTx = {
        ...txData,
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };
      // Optimistic update
      setTransactions((prev) => [savedTx, ...prev]);
      showToast(`Recorded ${txData.type === 'income' ? 'income' : 'expense'}: ${txData.title}`);
    }

    try {
      await saveTransactionToFirestore(currentUser.uid, savedTx);
    } catch (e) {
      console.error('Error saving transaction to Firestore:', e);
      showToast('Error saving to cloud database', 'info');
    }

    setEditingTransaction(null);
    setDefaultCategoryForModal(undefined);
  };

  // Delete Transaction directly from Firebase Firestore
  const handleDeleteTransaction = async (id: string) => {
    if (!currentUser) return;

    const tx = transactions.find((t) => t.id === id);
    // Optimistic removal
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted ${tx?.title || 'transaction'}`);

    try {
      await deleteTransactionFromFirestore(currentUser.uid, id);
    } catch (e) {
      console.error('Error deleting transaction in Firestore:', e);
      showToast('Error deleting from cloud', 'info');
    }
  };

  const handleOpenAddModal = (defaultCategory?: string) => {
    setEditingTransaction(null);
    setDefaultCategoryForModal(defaultCategory);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  // Save Budget directly to Firebase Firestore
  const handleSaveBudget = async (newConfig: BudgetConfig) => {
    if (!currentUser) return;

    setBudgetConfig(newConfig);
    showToast('Monthly budget configuration saved');

    try {
      await saveBudgetConfigToFirestore(currentUser.uid, newConfig);
    } catch (e) {
      console.error('Error saving budget to Firestore:', e);
      showToast('Error saving budget to cloud', 'info');
    }
  };

  // Clear all data directly in Firebase Firestore
  const handleResetData = async () => {
    if (!currentUser) return;

    if (window.confirm('Are you sure you want to clear all your transactions and reset budgets in the cloud database?')) {
      setTransactions([]);
      setBudgetConfig(INITIAL_BUDGET_CONFIG);
      setCurrentMonthKey(CURRENT_YEAR_MONTH);

      try {
        await clearAllUserDataInFirestore(currentUser.uid, INITIAL_BUDGET_CONFIG);
        showToast('All your transactions and budgets have been cleared from the cloud', 'info');
      } catch (e) {
        console.error('Error clearing data in Firestore:', e);
        showToast('Error resetting cloud records', 'info');
      }
    }
  };

  const handleExportCSV = () => {
    exportToCSV(transactions);
    showToast('Exported transactions to CSV file');
  };

  const handleFilterByCategory = (categoryId: string) => {
    setCategoryFilterForList(categoryId);
    setActiveTab('transactions');
  };

  // 1. Initial Authentication Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            ₹
          </div>
          <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Connecting to your personal ledger...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state: Render Marketing & Landing Page
  if (!currentUser) {
    return (
      <MarketingPage
        onSignInGoogle={signInWithGoogle}
        onSignInGuest={signInGuest}
        isAuthLoading={authLoading}
      />
    );
  }

  // 3. Authenticated state: Render complete Personal Finance Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans'] flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation & App Header */}
      <Header
        currentMonthKey={currentMonthKey}
        onMonthChange={setCurrentMonthKey}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => handleOpenAddModal()}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        availableMonths={availableMonths}
        isCloudSynced={true}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 sm:pb-12">
        {/* Core Monthly KPIs */}
        <MetricsCards
          stats={monthlyStats}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            {/* Budget Insights Summary Banner */}
            <BudgetInsightsBanner
              stats={monthlyStats}
              onSelectCategory={handleFilterByCategory}
            />

            {/* Visual Charts Section */}
            <ChartsSection
              stats={monthlyStats}
              trends={monthTrends}
              dailySpend={dailySpend}
              onSelectCategory={handleFilterByCategory}
            />

            {/* Recent Monthly Activity */}
            <RecentTransactions
              transactions={transactions}
              selectedMonthKey={currentMonthKey}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={handleOpenAddModal}
              onViewAll={() => setActiveTab('transactions')}
            />
          </div>
        )}

        {/* Tab 2: Full Transactions Ledger */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fadeIn">
            <TransactionList
              transactions={transactions}
              selectedMonthKey={currentMonthKey}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={handleOpenAddModal}
              initialCategoryFilter={categoryFilterForList}
              onClearCategoryFilter={() => setCategoryFilterForList('all')}
            />
          </div>
        )}

        {/* Tab 3: Category Spending Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            <CategoryReport
              stats={monthlyStats}
              transactions={transactions}
              onFilterByCategory={handleFilterByCategory}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 4: Budget Insights & Health */}
        {activeTab === 'budgets' && (
          <div className="space-y-6 animate-fadeIn">
            <BudgetInsightsTab
              stats={monthlyStats}
              budgetConfig={budgetConfig}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onFilterByCategory={handleFilterByCategory}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Mobile Navigation" className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] sm:hidden px-3 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
            activeTab === 'dashboard'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
            activeTab === 'transactions'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <ReceiptText className="w-5 h-5" />
          <span className="text-[10px]">Ledger</span>
        </button>

        {/* Elevated Quick-Add Action Button */}
        <button
          onClick={() => handleOpenAddModal()}
          className="w-12 h-12 -mt-5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg flex items-center justify-center transition border-4 border-slate-50"
          title="Add Transaction"
          aria-label="Add Transaction"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
            activeTab === 'reports'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px]">Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('budgets')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
            activeTab === 'budgets'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px]">Budgets</span>
        </button>
      </nav>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
          setDefaultCategoryForModal(undefined);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        defaultDate={
          currentMonthKey === CURRENT_YEAR_MONTH
            ? new Date().toISOString().slice(0, 10)
            : `${currentMonthKey}-01`
        }
        defaultCategory={defaultCategoryForModal}
      />

      {/* Set Budgets Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        config={budgetConfig}
        onSave={handleSaveBudget}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-slate-800 transition transform animate-slideUp">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
