import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Repeat, 
  ArrowUpRight, 
  ArrowDownRight, 
  X,
  CreditCard,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { ALL_CATEGORIES, getCategoryById } from '../data/categories';
import { formatCurrency, formatMonthYear } from '../utils/calculations';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  selectedMonthKey: string;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: (defaultCategory?: string) => void;
  initialCategoryFilter?: string;
  onClearCategoryFilter?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  selectedMonthKey,
  onEditTransaction,
  onDeleteTransaction,
  onOpenAddModal,
  initialCategoryFilter,
  onClearCategoryFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter || 'all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Synchronize category filter if passed from parent
  React.useEffect(() => {
    if (initialCategoryFilter) {
      setCategoryFilter(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Month match
      if (!tx.date.startsWith(selectedMonthKey)) {
        return false;
      }
      // Type match
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }
      // Category match
      if (categoryFilter !== 'all' && tx.categoryId !== categoryFilter) {
        return false;
      }
      // Payment method match
      if (paymentFilter !== 'all' && tx.paymentMethod !== paymentFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const cat = getCategoryById(tx.categoryId);
        const matchTitle = tx.title.toLowerCase().includes(query);
        const matchCategory = cat.name.toLowerCase().includes(query);
        const matchNote = (tx.note || '').toLowerCase().includes(query);
        if (!matchTitle && !matchCategory && !matchNote) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
      if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, selectedMonthKey, typeFilter, categoryFilter, paymentFilter, searchTerm, sortBy]);

  const totalFilteredSum = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const t of filteredTransactions) {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    }
    return { inc, exp, net: inc - exp };
  }, [filteredTransactions]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setPaymentFilter('all');
    setSortBy('date_desc');
    if (onClearCategoryFilter) {
      onClearCategoryFilter();
    }
  };

  const hasActiveFilters = searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || paymentFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Search & Filter Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit']">
              Monthly Transactions Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredTransactions.length} recorded entry for {formatMonthYear(selectedMonthKey)}
            </p>
          </div>

          <button
            onClick={() => onOpenAddModal(categoryFilter !== 'all' ? categoryFilter : undefined)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filters Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
          {/* Search bar */}
          <div className="relative lg:col-span-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description, note, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Incomes Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.type === 'income' ? '+ ' : '- '}
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: Highest First</option>
              <option value="amount_asc">Amount: Lowest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Filtered by:</span>
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold text-[11px]">
                {getCategoryById(categoryFilter).name}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-blue-950 ml-0.5" 
                  onClick={() => {
                    setCategoryFilter('all');
                    if (onClearCategoryFilter) onClearCategoryFilter();
                  }}
                />
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-bold text-[11px] capitalize">
                {typeFilter}
                <X className="w-3 h-3 cursor-pointer hover:text-slate-900 ml-0.5" onClick={() => setTypeFilter('all')} />
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-bold text-[11px]">
                "{searchTerm}"
                <X className="w-3 h-3 cursor-pointer hover:text-slate-900 ml-0.5" onClick={() => setSearchTerm('')} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 font-bold text-[11px] ml-1"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Filtered Summary Bar */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap font-medium">
          <span>Inflow: <strong className="text-emerald-700 font-extrabold">{formatCurrency(totalFilteredSum.inc)}</strong></span>
          <span>Outflow: <strong className="text-rose-700 font-extrabold">{formatCurrency(totalFilteredSum.exp)}</strong></span>
          <span>Net: <strong className={totalFilteredSum.net >= 0 ? 'text-indigo-700 font-extrabold' : 'text-amber-700 font-extrabold'}>{formatCurrency(totalFilteredSum.net)}</strong></span>
        </div>
        <span className="text-slate-400 text-[11px] hidden sm:inline">Click any row to edit details</span>
      </div>

      {/* Table / List */}
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-100">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">No transactions match the selected filters</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting or clearing your filters, or record a new transaction for {formatMonthYear(selectedMonthKey)}.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => onOpenAddModal()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const category = getCategoryById(tx.categoryId);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="p-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between hover:bg-slate-50/90 transition group cursor-pointer"
                onClick={() => onEditTransaction(tx)}
              >
                {/* Left: Icon and Details */}
                <div className="flex items-center gap-3.5 min-w-0 pr-2 flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs"
                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                  >
                    <CategoryIcon name={category.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate max-w-[200px] sm:max-w-md group-hover:text-blue-600 transition">
                        {tx.title}
                      </span>
                      {tx.isRecurring && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          <Repeat className="w-2.5 h-2.5" /> Recurring
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 text-xs text-slate-500 flex-wrap">
                      <span className="font-semibold text-slate-600">{category.name}</span>
                      <span>&bull;</span>
                      <span className="font-medium text-slate-500">{new Date(tx.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>&bull;</span>
                      <span className="capitalize font-medium text-slate-400">{tx.paymentMethod.replace('_', ' ')}</span>
                      {tx.note && (
                        <>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="hidden sm:inline italic text-slate-400 truncate max-w-[180px]">"{tx.note}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount and Actions */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-3">
                  <div className="text-right">
                    <div
                      className={`text-sm sm:text-base font-extrabold font-['Outfit'] tracking-tight ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                      {isIncome ? 'Inflow' : 'Expense'}
                    </span>
                  </div>

                  {/* Actions (visible on hover or focus) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTransaction(tx);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Transaction"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${tx.title}"?`)) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Transaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
