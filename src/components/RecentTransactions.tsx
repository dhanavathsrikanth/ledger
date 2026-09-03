import React, { useState } from 'react';
import { Plus, ArrowRight, Repeat, ArrowUpRight, ArrowDownRight, Tag, Trash2, Edit3 } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, formatMonthYear } from '../utils/calculations';
import { getCategoryById } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';

interface RecentTransactionsProps {
  transactions: Transaction[];
  selectedMonthKey?: string;
  currentMonthKey?: string;
  monthName?: string;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
  onViewAll: () => void;
  onOpenAddModal: (defaultCategory?: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  selectedMonthKey,
  currentMonthKey,
  monthName,
  onEditTransaction,
  onDeleteTransaction,
  onViewAll,
  onOpenAddModal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');

  const monthKey = selectedMonthKey || currentMonthKey || new Date().toISOString().slice(0, 7);
  const displayMonthName = monthName || formatMonthYear(monthKey);

  // Filter transactions for the selected month
  const monthTransactions = transactions
    .filter((tx) => tx.date.startsWith(monthKey))
    .filter((tx) => (filterType === 'all' ? true : tx.type === filterType))
    .sort((a, b) => b.date.localeCompare(a.date));

  const displayList = monthTransactions.slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Recent Transactions
            </h3>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
              {monthTransactions.length} recorded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest cash flow activity for {displayMonthName}
          </p>
        </div>

        {/* Filter Pills & View All */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center bg-slate-100/90 p-1 rounded-lg text-xs font-semibold border border-slate-200/60">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterType === 'expense'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterType === 'income'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-lg hover:bg-blue-50"
          >
            <span>Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transaction Items */}
      <div className="divide-y divide-slate-100">
        {displayList.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-100">
              <Tag className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">No transactions in {displayMonthName}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Start recording your income and expenses to visualize your cash flow and analytics.
            </p>
            <button
              onClick={() => onOpenAddModal()}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs hover:shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add First Transaction</span>
            </button>
          </div>
        ) : (
          displayList.map((tx) => {
            const category = getCategoryById(tx.categoryId);
            const isIncome = tx.type === 'income';

            // Format date for mobile vs desktop
            const dateObj = new Date(tx.date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={tx.id}
                className="group p-3 sm:px-5 sm:py-3.5 flex items-center justify-between hover:bg-slate-50/90 transition"
              >
                {/* Left: Icon & Details */}
                <div 
                  onClick={() => onEditTransaction(tx)}
                  className="flex items-center gap-3 min-w-0 pr-2 cursor-pointer flex-1"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border border-slate-100"
                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                  >
                    <CategoryIcon name={category.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate max-w-[170px] sm:max-w-xs group-hover:text-blue-600 transition">
                        {tx.title}
                      </span>
                      {tx.isRecurring && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          <Repeat className="w-2.5 h-2.5" />
                          <span className="hidden xs:inline">Recurring</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                      <span className="font-medium text-slate-600 truncate">{category.name}</span>
                      <span>•</span>
                      <span className="shrink-0">{formattedDate}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline capitalize shrink-0 text-slate-400">
                        {tx.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Quick Actions */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <div 
                    onClick={() => onEditTransaction(tx)}
                    className="text-right cursor-pointer"
                  >
                    <div
                      className={`text-sm sm:text-base font-extrabold font-['Outfit'] tracking-tight ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400 mt-0.5">
                      {isIncome ? (
                        <span className="inline-flex items-center text-emerald-600 font-semibold text-[10px]">
                          <ArrowUpRight className="w-3 h-3" /> Income
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-600 font-semibold text-[10px]">
                          <ArrowDownRight className="w-3 h-3" /> Expense
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                      title="Edit transaction"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteTransaction && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${tx.title}"?`)) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer bar */}
      {displayList.length > 0 && (
        <div className="p-3 sm:px-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {displayList.length} of {monthTransactions.length} items</span>
          <button
            onClick={onViewAll}
            className="font-bold text-blue-600 hover:text-blue-800 transition"
          >
            View all in ledger &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
