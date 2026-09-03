import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Flame, ShieldAlert, ArrowRight } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
              Budget Intelligence &amp; Velocity
            </h3>
          </div>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
            stats.overallBudget === 0
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : stats.budgetUsedPercentage > 100
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : stats.budgetUsedPercentage >= 80
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {stats.overallBudget === 0 ? (
              <><CheckCircle2 className="w-3 h-3 text-slate-400" /> Ready</>
            ) : stats.budgetUsedPercentage > 100 ? (
              <><AlertTriangle className="w-3 h-3" /> Over Budget</>
            ) : stats.budgetUsedPercentage >= 80 ? (
              <><AlertTriangle className="w-3 h-3" /> Caution Pace</>
            ) : (
              <><CheckCircle2 className="w-3 h-3" /> Healthy Pace</>
            )}
          </span>
        </div>

        {stats.overallBudget > 0 && stats.daysRemaining > 0 && stats.remainingBudget > 0 && (
          <div className="self-start sm:self-auto text-[11px] font-bold text-slate-800 bg-slate-100/90 px-3 py-1 rounded-xl flex items-center gap-1.5 border border-slate-200/60">
            <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-slate-500 font-medium">Safe Burn:</span>
            <span className="text-slate-900 font-extrabold">{formatCurrency(stats.safeDailySpend, true)}/day</span>
            <span className="text-slate-400 font-normal">({stats.daysRemaining}d left)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Insight 1: Overall Pace */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5 font-['Outfit']">
              <span>Budget Trajectory</span>
              <span className="text-[11px] font-semibold text-slate-500">
                {stats.overallBudget > 0 ? `${stats.budgetUsedPercentage.toFixed(0)}% consumed` : 'Uncapped'}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
              {stats.overallBudget === 0 ? (
                <>
                  No monthly spending cap defined yet. Tap <strong className="text-blue-600">Budgets</strong> above to configure your target spending limits.
                </>
              ) : stats.budgetUsedPercentage > 100 ? (
                <>
                  Exceeded monthly target by{' '}
                  <strong className="text-rose-600 font-bold">
                    {formatCurrency(Math.abs(stats.remainingBudget))}
                  </strong>
                  . Minimize non-essential expenditures for the rest of this month.
                </>
              ) : (
                <>
                  <strong className="text-slate-900 font-bold">
                    {formatCurrency(stats.remainingBudget)}
                  </strong>{' '}
                  available cushion out of {formatCurrency(stats.overallBudget)} total allocation.
                </>
              )}
            </p>
          </div>
          {stats.overallBudget > 0 && (
            <div className="mt-2.5 w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  stats.budgetUsedPercentage > 100 
                    ? 'bg-rose-500' 
                    : stats.budgetUsedPercentage >= 80 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'
                }`} 
                style={{ width: `${Math.min(100, stats.budgetUsedPercentage)}%` }} 
              />
            </div>
          )}
        </div>

        {/* Insight 2: Category Spotlight */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5 font-['Outfit']">
              <span>Top Outflow Category</span>
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
              <span>Filter {topCategory.categoryName} items</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Insight 3: Category Limit Alerts */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5 font-['Outfit']">
              <span>Category Limits Compliance</span>
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            {overBudgetCategories.length > 0 ? (
              <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                <strong className="text-rose-600 font-bold">
                  {overBudgetCategories.map((c) => c.categoryName).join(', ')}
                </strong>{' '}
                exceeded by{' '}
                {formatCurrency(
                  overBudgetCategories.reduce((sum, c) => sum + (c.totalSpent - c.budgetLimit), 0)
                )}.
              </p>
            ) : nearBudgetCategories.length > 0 ? (
              <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                <strong className="text-amber-600 font-bold">
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
                All categories are within budgeted limits. Monthly savings rate is at{' '}
                <strong className="text-emerald-600 font-bold">
                  {stats.savingsRate.toFixed(1)}%
                </strong>
                .
              </p>
            )}
          </div>
          <div className="mt-2 text-slate-400 text-[10px] sm:text-[11px]">
            {overBudgetCategories.length > 0
              ? 'Trim discretionary transactions or adjust limits'
              : 'Target: Keep savings rate above 20%'}
          </div>
        </div>
      </div>
    </div>
  );
};
