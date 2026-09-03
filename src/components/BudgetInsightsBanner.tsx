import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Flame, DollarSign } from 'lucide-react';
import { MonthlyStats } from '../types';
import { formatCurrency } from '../utils/calculations';

interface BudgetInsightsBannerProps {
  stats: MonthlyStats;
  onSelectCategory?: (categoryId: string) => void;
}

export const BudgetInsightsBanner: React.FC<BudgetInsightsBannerProps> = ({
  stats,
  onSelectCategory,
}) => {
  // Find top spending category
  const topCategory = stats.categorySpendings.length > 0 && stats.categorySpendings[0].totalSpent > 0 
    ? stats.categorySpendings[0] 
    : null;

  // Find categories exceeding or nearing limit
  const overBudgetCategories = stats.categorySpendings.filter(
    (c) => c.budgetLimit > 0 && c.totalSpent > c.budgetLimit
  );
  const nearBudgetCategories = stats.categorySpendings.filter(
    (c) => c.budgetLimit > 0 && c.totalSpent <= c.budgetLimit && c.budgetUsedPercent >= 80
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
            Financial Health &amp; Insights
          </h3>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            stats.overallBudget === 0
              ? 'bg-slate-100 text-slate-600 border border-slate-200'
              : stats.budgetUsedPercentage > 100
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : stats.budgetUsedPercentage >= 80
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {stats.overallBudget === 0 ? (
              <><CheckCircle2 className="w-3 h-3 text-slate-400" /> Ready</>
            ) : stats.budgetUsedPercentage > 100 ? (
              <><AlertTriangle className="w-3 h-3" /> Over Budget</>
            ) : stats.budgetUsedPercentage >= 80 ? (
              <><AlertTriangle className="w-3 h-3" /> Caution Pace</>
            ) : (
              <><CheckCircle2 className="w-3 h-3" /> Healthy</>
            )}
          </span>
        </div>

        {stats.overallBudget > 0 && stats.daysRemaining > 0 && stats.remainingBudget > 0 && (
          <div className="self-start sm:self-auto text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <span className="text-slate-500">Safe Daily Burn:</span>
            <span className="text-slate-900 font-bold">{formatCurrency(stats.safeDailySpend, true)}/day</span>
            <span className="text-slate-400">({stats.daysRemaining}d left)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
        {/* Insight 1: Overall Pace */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5">
              <span>Budget Pace</span>
              <span className="text-[11px] font-semibold text-slate-500">
                {stats.overallBudget > 0 ? `${stats.budgetUsedPercentage.toFixed(0)}% consumed` : 'No budget set'}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
              {stats.overallBudget === 0 ? (
                <>
                  No monthly spending cap defined yet. Tap <strong className="text-blue-600">Budgets</strong> above to configure your target spending limits.
                </>
              ) : stats.budgetUsedPercentage > 100 ? (
                <>
                  Surpassed monthly ceiling by{' '}
                  <strong className="text-rose-600">
                    {formatCurrency(Math.abs(stats.remainingBudget))}
                  </strong>
                  . Rebalance non-essential expenses.
                </>
              ) : (
                <>
                  <strong className="text-slate-900">
                    {formatCurrency(stats.remainingBudget)}
                  </strong>{' '}
                  available cushion out of {formatCurrency(stats.overallBudget)} total allocation.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Insight 2: Category Spotlight */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5">
              <span>Top Expenditure</span>
              <Flame className="w-3.5 h-3.5 text-orange-500" />
            </div>
            {topCategory ? (
              <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                <strong className="text-slate-900">{topCategory.categoryName}</strong> leads spending with{' '}
                <strong className="text-slate-900">{topCategory.percentageOfTotal.toFixed(0)}%</strong>{' '}
                ({formatCurrency(topCategory.totalSpent)} across{' '}
                {topCategory.transactionCount} items).
              </p>
            ) : (
              <p className="text-slate-500 text-[11px] sm:text-xs">No expense recorded for this period yet.</p>
            )}
          </div>
          {topCategory && onSelectCategory && (
            <button
              onClick={() => onSelectCategory(topCategory.categoryId)}
              className="mt-2 text-left font-bold text-blue-600 hover:text-blue-800 text-[11px] transition inline-flex items-center gap-1"
            >
              <span>Filter {topCategory.categoryName}</span> &rarr;
            </button>
          )}
        </div>

        {/* Insight 3: Category Limit Alerts */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5">
              <span>Category Status</span>
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            {overBudgetCategories.length > 0 ? (
              <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                <strong className="text-rose-600">
                  {overBudgetCategories.map((c) => c.categoryName).join(', ')}
                </strong>{' '}
                exceeded by{' '}
                {formatCurrency(
                  overBudgetCategories.reduce((sum, c) => sum + (c.totalSpent - c.budgetLimit), 0)
                )}.
              </p>
            ) : nearBudgetCategories.length > 0 ? (
              <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                <strong className="text-amber-600">
                  {nearBudgetCategories.map((c) => c.categoryName).join(', ')}
                </strong>{' '}
                at {nearBudgetCategories[0].budgetUsedPercent.toFixed(0)}% of limit. Monitor closely.
              </p>
            ) : stats.totalExpense === 0 ? (
              <p className="text-slate-500 leading-relaxed text-[11px] sm:text-xs">
                No expense activity recorded yet for this month.
              </p>
            ) : (
              <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                All categories are within budgeted ceilings. Savings rate is at{' '}
                <strong className="text-emerald-600">
                  {stats.savingsRate.toFixed(1)}%
                </strong>
                .
              </p>
            )}
          </div>
          <div className="mt-2 text-slate-400 text-[10px] sm:text-[11px]">
            {overBudgetCategories.length > 0
              ? 'Trim discretionary transactions or bump category limit'
              : 'Target: Maintain savings rate above 20%'}
          </div>
        </div>
      </div>
    </div>
  );
};
