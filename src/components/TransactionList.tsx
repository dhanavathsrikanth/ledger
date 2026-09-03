import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Repeat, 
  ArrowUpRight, 
  ArrowDownRight, 
  X,
  CreditCard
} from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { ALL_CATEGORIES, getCategoryById } from '../data/categories';
import { formatCurrency } from '../utils/calculations';
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

  // Synchronize category filter if passed from parent (e.g. clicking category in report/chart)
  React.useEffect(() => {
    if (initialCategoryFilter) {
      setCategoryFilter(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  // Filter transactions
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

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Search & Filter Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Monthly Transactions Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} for selected filters
            </p>
          </div>

          <button
            onClick={() => onOpenAddModal(categoryFilter !== 'all' ? categoryFilter : undefined)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filters Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description, note, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-700 font-medium"
            >
              <option value="all">All Types (In &amp; Out)</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-700 font-medium"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.type === 'income' ? '[Income] ' : '[Expense] '}
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-700 font-medium"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || paymentFilter !== 'all') && (
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Active filters:</span>
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                Category: {getCategoryById(categoryFilter).name}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                  onClick={() => {
                    setCategoryFilter('all');
                    if (onClearCategoryFilter) onClearCategoryFilter();
                  }}
                />
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                Type: {typeFilter}
                <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setTypeFilter('all')} />
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                "{searchTerm}"
                <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSearchTerm('')} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold underline text-xs ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Filtered Summary Bar */}
      <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span>Income: <strong className="text-emerald-700 font-bold">{formatCurrency(totalFilteredSum.inc)}</strong></span>
          <span>Expenditure: <strong className="text-rose-700 font-bold">{formatCurrency(totalFilteredSum.exp)}</strong></span>
          <span>Net: <strong className={totalFilteredSum.net >= 0 ? 'text-indigo-700 font-bold' : 'text-amber-700 font-bold'}>{formatCurrency(totalFilteredSum.net)}</strong></span>
        </div>
        <span className="text-slate-400">Click any row to edit</span>
      </div>

      {/* Table / List */}
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-sm font-semibold text-slate-700">No transactions found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or add a new transaction for this month.
            </p>
            <button
              onClick={() => onOpenAddModal()}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Transaction
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const category = getCategoryById(tx.categoryId);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="p-4 sm:px-5 sm:py-3.5 flex items-center justify-between hover:bg-slate-50 transition group cursor-pointer"
                onClick={() => onEditTransaction(tx)}
              >
                {/* Left: Icon and Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${category.color}18`, color: category.color }}
                  >
                    <CategoryIcon name={category.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {tx.title}
                      </span>
                      {tx.isRecurring && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          <Repeat className="w-2.5 h-2.5" /> Recurring
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 text-xs text-slate-500 flex-wrap">
                      <span className="font-medium text-slate-600">{category.name}</span>
                      <span>&bull;</span>
                      <span>{new Date(tx.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{tx.paymentMethod.replace('_', ' ')}</span>
                      {tx.note && (
                        <>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="hidden sm:inline italic text-slate-400 truncate max-w-[150px]">{tx.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount and Actions */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="text-right">
                    <div
                      className={`text-base font-extrabold font-['Outfit'] ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {isIncome ? 'Inflow' : 'Expense'}
                    </span>
                  </div>

                  {/* Actions (visible on hover or focus) */}
                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
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
                        onDeleteTransaction(tx.id);
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
