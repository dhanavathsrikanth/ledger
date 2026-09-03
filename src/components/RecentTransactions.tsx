import React, { useState } from 'react';
import { Plus, ArrowRight, Repeat, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/calculations';
import { getCategoryById } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currentMonthKey: string;
  monthName: string;
  onEditTransaction: (tx: Transaction) => void;
  onViewAll: () => void;
  onOpenAddModal: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currentMonthKey,
  monthName,
  onEditTransaction,
  onViewAll,
  onOpenAddModal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');

  // Filter for the current month
  const monthTransactions = transactions
    .filter((tx) => tx.date.startsWith(currentMonthKey))
    .filter((tx) => (filterType === 'all' ? true : tx.type === filterType))
    .sort((a, b) => b.date.localeCompare(a.date));

  const displayList = monthTransactions.slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Recent Transactions
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {monthTransactions.length} recorded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest cash flow activity for {monthName}
          </p>
        </div>

        {/* Filter Pills & View All */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
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
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 shrink-0"
          >
            <span>Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transaction Items */}
      <div className="divide-y divide-slate-100">
        {displayList.length === 0 ? (
          <div className="py-10 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
              <Tag className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No transactions in {monthName}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Start recording your income and expenses to visualize your cash flow and analytics.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
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
                onClick={() => onEditTransaction(tx)}
                className="p-3 sm:px-5 sm:py-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer active:bg-slate-100"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                  >
                    <CategoryIcon name={category.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate max-w-[170px] sm:max-w-xs">
                        {tx.title}
                      </span>
                      {tx.isRecurring && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          <Repeat className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                      <span className="font-medium text-slate-600 truncate">{category.name}</span>
                      <span>•</span>
                      <span className="shrink-0">{formattedDate}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline capitalize shrink-0">
                        {tx.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Indicator */}
                <div className="text-right shrink-0">
                  <div
                    className={`text-sm sm:text-base font-extrabold font-['Outfit'] ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400 mt-0.5">
                    {isIncome ? (
                      <span className="inline-flex items-center text-emerald-600 font-semibold">
                        <ArrowUpRight className="w-3 h-3" /> Income
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-rose-600 font-semibold">
                        <ArrowDownRight className="w-3 h-3" /> Spent
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {monthTransactions.length > 6 && (
        <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1"
          >
            <span>View all {monthTransactions.length} transactions for {monthName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
