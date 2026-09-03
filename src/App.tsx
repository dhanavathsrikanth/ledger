import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Transaction, 
  BudgetConfig, 
  ActiveTab 
} from './types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGET_CONFIG } from './data/initialData';
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
import { 
  CheckCircle, 
  Info, 
  Plus, 
  Cloud, 
  Database,
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { 
  subscribeToTransactions, 
  subscribeToBudgetConfig, 
  saveTransactionToFirestore, 
  deleteTransactionFromFirestore, 
  saveBudgetConfigToFirestore,
  seedInitialFirestoreData,
  cleanLegacyDummyData,
  resetFirestoreData
} from './services/firestoreService';

const now = new Date();
const CURRENT_YEAR_MONTH = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const STORAGE_KEY_TRANSACTIONS = 'expense_tracker_txs_clean_v1';
const STORAGE_KEY_BUDGET = 'expense_tracker_budget_clean_v1';

const isLegacyDummyTx = (t: Transaction): boolean => {
  if (!t || typeof t.id !== 'string') return false;
  return (
    t.id.startsWith('tx-202604-') ||
    t.id.startsWith('tx-202605-') ||
    t.id.startsWith('tx-202606-') ||
    t.id.startsWith('tx-202607-') ||
    t.id.startsWith('tx-202608-') ||
    t.id.startsWith('tx-202609-')
  );
};

export default function App() {
  const { currentUser, loading: authLoading } = useAuth();
  
  // Local state initialized from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      // Clear legacy storage keys if present
      localStorage.removeItem('expense_tracker_txs_inr_v1');
      localStorage.removeItem('expense_tracker_txs_inr_v2');
      localStorage.removeItem('expense_tracker_budget_inr_v1');
      localStorage.removeItem('expense_tracker_budget_inr_v2');

      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t) => !isLegacyDummyTx(t));
        }
      }
    } catch (e) {
      console.error('Error reading saved transactions', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUDGET);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.overallBudget === 'number') {
          if (parsed.overallBudget === 75000 && parsed.categoryLimits?.housing === 25000) {
            return INITIAL_BUDGET_CONFIG;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading saved budget config', e);
    }
    return INITIAL_BUDGET_CONFIG;
  });

  const [isSyncing, setIsSyncing] = useState(false);
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

  // Synchronize with Firestore when user is logged in
  useEffect(() => {
    if (!currentUser) return;

    let unsubTxs: (() => void) | undefined;
    let unsubBudget: (() => void) | undefined;

    const setupFirestoreSync = async () => {
      setIsSyncing(true);
      try {
        // Automatically purge any dummy legacy transactions from user's Firestore
        await cleanLegacyDummyData(currentUser.uid);

        // Subscribe to real-time transactions
        unsubTxs = subscribeToTransactions(
          currentUser.uid,
          (cloudTxs) => {
            const cleanTxs = cloudTxs.filter((t) => !isLegacyDummyTx(t));
            setTransactions(cleanTxs);
            setIsSyncing(false);
          },
          (err) => {
            console.error('Failed to sync transactions from Firestore:', err);
            setIsSyncing(false);
          }
        );

        // Subscribe to real-time budget
        unsubBudget = subscribeToBudgetConfig(
          currentUser.uid,
          (cloudBudget) => {
            if (cloudBudget) {
              if (cloudBudget.overallBudget === 75000 && cloudBudget.categoryLimits?.housing === 25000) {
                setBudgetConfig(INITIAL_BUDGET_CONFIG);
              } else {
                setBudgetConfig(cloudBudget);
              }
            }
          },
          (err) => {
            console.error('Failed to sync budget from Firestore:', err);
          }
        );
      } catch (err) {
        console.error('Error establishing Firestore listeners:', err);
        setIsSyncing(false);
      }
    };

    setupFirestoreSync();

    return () => {
      if (unsubTxs) unsubTxs();
      if (unsubBudget) unsubBudget();
    };
  }, [currentUser]);

  // Local storage backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(budgetConfig));
    } catch (e) {
      console.error('Error saving budget config to localStorage', e);
    }
  }, [budgetConfig]);

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

  // Transaction handlers
  const handleSaveTransaction = async (
    txData: Omit<Transaction, 'id'>,
    existingId?: string
  ) => {
    let savedTx: Transaction;
    if (existingId) {
      savedTx = { ...txData, id: existingId };
      setTransactions((prev) =>
        prev.map((t) => (t.id === existingId ? savedTx : t))
      );
      showToast('Transaction updated successfully');
    } else {
      savedTx = {
        ...txData,
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      };
      setTransactions((prev) => [savedTx, ...prev]);
      showToast(`Recorded ${txData.type === 'income' ? 'income' : 'expense'}: ${txData.title}`);
    }

    // Persist to Firestore if authenticated
    if (currentUser) {
      try {
        setIsSyncing(true);
        await saveTransactionToFirestore(currentUser.uid, savedTx);
        setIsSyncing(false);
      } catch (e) {
        console.error('Error saving transaction to Firestore:', e);
        setIsSyncing(false);
      }
    }

    setEditingTransaction(null);
    setDefaultCategoryForModal(undefined);
  };

  const handleDeleteTransaction = async (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted ${tx?.title || 'transaction'}`);

    if (currentUser) {
      try {
        setIsSyncing(true);
        await deleteTransactionFromFirestore(currentUser.uid, id);
        setIsSyncing(false);
      } catch (e) {
        console.error('Error deleting transaction in Firestore:', e);
        setIsSyncing(false);
      }
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

  const handleSaveBudget = async (newConfig: BudgetConfig) => {
    setBudgetConfig(newConfig);
    showToast('Monthly budget configuration saved');

    if (currentUser) {
      try {
        setIsSyncing(true);
        await saveBudgetConfigToFirestore(currentUser.uid, newConfig);
        setIsSyncing(false);
      } catch (e) {
        console.error('Error saving budget to Firestore:', e);
        setIsSyncing(false);
      }
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to clear all transactions and reset data?')) {
      setTransactions([]);
      setBudgetConfig(INITIAL_BUDGET_CONFIG);
      setCurrentMonthKey(CURRENT_YEAR_MONTH);
      localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEY_BUDGET);

      if (currentUser) {
        try {
          setIsSyncing(true);
          await resetFirestoreData(currentUser.uid, [], INITIAL_BUDGET_CONFIG);
          setIsSyncing(false);
        } catch (e) {
          console.error('Error resetting Firestore data:', e);
          setIsSyncing(false);
        }
      }
      showToast('All transactions and data cleared successfully', 'info');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(transactions);
    showToast('Exported transactions to CSV file');
  };

  // Jump from chart or report to Transactions tab with filter
  const handleFilterByCategory = (categoryId: string) => {
    setCategoryFilterForList(categoryId);
    setActiveTab('transactions');
  };

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
        isCloudSynced={!!currentUser}
        isSyncing={isSyncing}
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

            {/* Recent Monthly Activity (Clean Mobile-Friendly Component) */}
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
