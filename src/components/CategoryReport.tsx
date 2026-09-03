import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  ArrowUpDown, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { MonthlyStats, PaymentMethod, Transaction } from '../types';
import { formatCurrency, formatPercent, getPaymentMethodBreakdown } from '../utils/calculations';
import { CategoryIcon } from './CategoryIcon';

interface CategoryReportProps {
  stats: MonthlyStats;
  transactions: Transaction[];
  onFilterByCategory: (categoryId: string) => void;
  onOpenBudgetModal: () => void;
}

type SortField = 'spent' | 'percentage' | 'budgetUsed' | 'remaining' | 'count';

export const CategoryReport: React.FC<CategoryReportProps> = ({
  stats,
  transactions,
  onFilterByCategory,
  onOpenBudgetModal,
}) => {
  const [sortField, setSortField] = useState<SortField>('spent');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'over_budget' | 'near_budget' | 'on_track'>('all');

  const paymentBreakdown = getPaymentMethodBreakdown(transactions, stats.monthKey);

  // Sorting
  const sortedCategories = [...stats.categorySpendings].sort((a, b) => {
    let diff = 0;
    if (sortField === 'spent') diff = a.totalSpent - b.totalSpent;
    else if (sortField === 'percentage') diff = a.percentageOfTotal - b.percentageOfTotal;
    else if (sortField === 'budgetUsed') diff = a.budgetUsedPercent - b.budgetUsedPercent;
    else if (sortField === 'remaining') diff = a.remainingBudget - b.remainingBudget;
    else if (sortField === 'count') diff = a.transactionCount - b.transactionCount;
    return sortAsc ? diff : -diff;
  });

  // Filter
  const filteredCategories = sortedCategories.filter((cat) => {
    if (filterType === 'all') return true;
    if (filterType === 'over_budget') return cat.budgetLimit > 0 && cat.totalSpent > cat.budgetLimit;
    if (filterType === 'near_budget') return cat.budgetLimit > 0 && cat.budgetUsedPercent >= 80 && cat.totalSpent <= cat.budgetLimit;
    if (filterType === 'on_track') return cat.budgetLimit > 0 && cat.budgetUsedPercent < 80;
    return true;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards for Category Report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Tracked Expense
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
            {formatCurrency(stats.totalExpense)}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Distributed across {stats.categorySpendings.filter((c) => c.totalSpent > 0).length} active categories
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Category Budget Health
          </span>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
              <CheckCircle className="w-3.5 h-3.5" />
              {stats.categorySpendings.filter((c) => c.budgetLimit > 0 && c.budgetUsedPercent < 80).length} OK
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-amber-50 text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              {stats.categorySpendings.filter((c) => c.budgetLimit > 0 && c.budgetUsedPercent >= 80 && c.totalSpent <= c.budgetLimit).length} Alert
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-rose-50 text-rose-700">
              <AlertCircle className="w-3.5 h-3.5" />
              {stats.categorySpendings.filter((c) => c.budgetLimit > 0 && c.totalSpent > c.budgetLimit).length} Over
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            <button
              onClick={onOpenBudgetModal}
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              Adjust Category Limits &rarr;
            </button>
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Ticket Size
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
            {formatCurrency(
              stats.categorySpendings.reduce((sum, c) => sum + c.transactionCount, 0) > 0
                ? stats.totalExpense / stats.categorySpendings.reduce((sum, c) => sum + c.transactionCount, 0)
                : 0
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Per expense transaction in {stats.monthName}
          </p>
        </div>
      </div>

      {/* Main Category Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Category Spending &amp; Budget Variance Report
            </h3>
            <p className="text-xs text-slate-500">
              Granular breakdown of expenses, budget utilization, and average tickets
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setFilterType('over_budget')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterType === 'over_budget' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Over Budget
            </button>
            <button
              onClick={() => setFilterType('near_budget')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterType === 'near_budget' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              &gt;80% Limit
            </button>
          </div>
        </div>

        {/* Mobile View: Clean Responsive Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredCategories.length === 0 ? (
            <div className="py-8 px-4 text-center text-slate-400 text-xs">
              No categories found matching filter criteria.
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isOver = cat.budgetLimit > 0 && cat.totalSpent > cat.budgetLimit;
              const isNear = cat.budgetLimit > 0 && !isOver && cat.budgetUsedPercent >= 80;

              return (
                <div key={cat.categoryId} className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                      >
                        <CategoryIcon name={cat.icon} className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">
                          {cat.categoryName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {cat.transactionCount} item{cat.transactionCount !== 1 ? 's' : ''} &bull; {cat.percentageOfTotal.toFixed(0)}% of expenses
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-slate-900 font-['Outfit']">
                        {formatCurrency(cat.totalSpent)}
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isOver
                          ? 'bg-rose-50 text-rose-700'
                          : isNear
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {isOver ? 'Over' : isNear ? 'Caution' : 'On Track'}
                      </span>
                    </div>
                  </div>

                  {/* Budget bar */}
                  {cat.budgetLimit > 0 ? (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Budget: {formatCurrency(cat.budgetLimit)}</span>
                        <span>
                          {cat.remainingBudget >= 0 ? (
                            <strong className="text-slate-700 font-semibold">{formatCurrency(cat.remainingBudget)} left</strong>
                          ) : (
                            <strong className="text-rose-600 font-semibold">{formatCurrency(Math.abs(cat.remainingBudget))} over</strong>
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, cat.budgetUsedPercent)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 pt-1">
                      No budget cap configured
                    </div>
                  )}

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => onFilterByCategory(cat.categoryId)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1"
                    >
                      <span>Filter in Ledger</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Multi-column Sortable Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Category</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('spent')}
                >
                  <div className="flex items-center gap-1">
                    <span>Total Spent</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('percentage')}
                >
                  <div className="flex items-center gap-1">
                    <span>Share of Total</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Monthly Budget</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('budgetUsed')}
                >
                  <div className="flex items-center gap-1">
                    <span>Utilization</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('remaining')}
                >
                  <div className="flex items-center gap-1">
                    <span>Remaining</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('count')}
                >
                  <div className="flex items-center gap-1">
                    <span>Txs (Avg)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No categories found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const isOver = cat.budgetLimit > 0 && cat.totalSpent > cat.budgetLimit;
                  const isNear = cat.budgetLimit > 0 && !isOver && cat.budgetUsedPercent >= 80;

                  return (
                    <tr key={cat.categoryId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                          >
                            <CategoryIcon name={cat.icon} className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {cat.categoryName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatCurrency(cat.totalSpent)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(100, cat.percentageOfTotal)}%`,
                                backgroundColor: cat.color,
                              }}
                            />
                          </div>
                          <span className="font-medium text-slate-700">
                            {cat.percentageOfTotal.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {cat.budgetLimit > 0 ? formatCurrency(cat.budgetLimit) : <span className="text-slate-400 font-normal">None</span>}
                      </td>
                      <td className="py-3 px-4">
                        {cat.budgetLimit > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className={`font-bold ${isOver ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-slate-700'}`}>
                                {cat.budgetUsedPercent.toFixed(0)}%
                              </span>
                              {isOver && (
                                <span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-1 py-0.5 rounded">
                                  Over
                                </span>
                              )}
                            </div>
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, cat.budgetUsedPercent)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Uncapped</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {cat.budgetLimit > 0 ? (
                          <span
                            className={`font-semibold ${
                              cat.remainingBudget < 0 ? 'text-rose-600' : 'text-slate-700'
                            }`}
                          >
                            {cat.remainingBudget < 0 ? '-' : ''}
                            {formatCurrency(Math.abs(cat.remainingBudget))}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-semibold text-slate-900">{cat.transactionCount}</span>
                        {cat.transactionCount > 0 && (
                          <span className="text-slate-400 text-[11px] block">
                            avg {formatCurrency(cat.averageTransaction, true)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onFilterByCategory(cat.categoryId)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                        >
                          <span>View Txs</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Spending by Payment Method
            </h3>
            <p className="text-xs text-slate-500">
              Payment channel distribution for {stats.monthName}
            </p>
          </div>
          <CreditCard className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {paymentBreakdown.map((pm) => (
            <div key={pm.method} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold text-slate-600 mb-1">{pm.label}</div>
              <div className="text-lg font-bold text-slate-900 font-['Outfit']">
                {formatCurrency(pm.total)}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{pm.count} transactions</span>
                <span className="font-semibold text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded">
                  {pm.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
          {paymentBreakdown.length === 0 && (
            <div className="col-span-full py-4 text-center text-xs text-slate-400">
              No transactions to display payment method analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
