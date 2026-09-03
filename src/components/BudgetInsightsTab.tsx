import React from 'react';
import { 
  Target, 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  SlidersHorizontal,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { MonthlyStats, BudgetConfig } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { CategoryIcon } from './CategoryIcon';

interface BudgetInsightsTabProps {
  stats: MonthlyStats;
  budgetConfig: BudgetConfig;
  onOpenBudgetModal: () => void;
  onFilterByCategory: (categoryId: string) => void;
}

export const BudgetInsightsTab: React.FC<BudgetInsightsTabProps> = ({
  stats,
  budgetConfig,
  onOpenBudgetModal,
  onFilterByCategory,
}) => {
  const isOverBudget = stats.budgetUsedPercentage > 100;
  const isBudgetWarning = stats.budgetUsedPercentage >= 80;

  // Projection calculation: If today is day D of N days, projected = (spent / (N - daysRemaining)) * N
  const totalDaysInMonth = stats.daysRemaining > 0 
    ? stats.daysRemaining + parseInt(new Date().toISOString().slice(8, 10), 10) - 1
    : 30;
  const daysPassed = Math.max(1, totalDaysInMonth - stats.daysRemaining);
  const projectedSpend = daysPassed > 0 ? (stats.totalExpense / daysPassed) * totalDaysInMonth : stats.totalExpense;
  const projectedVariance = budgetConfig.overallBudget - projectedSpend;

  return (
    <div className="space-y-6">
      {/* Top Banner: Master Budget Pace & Safe Daily Allowance */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Monthly Budget Health &amp; Forecast
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating spending trajectory, daily burn rate, and category compliance for {stats.monthName}
            </p>
          </div>

          <button
            onClick={onOpenBudgetModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-xs self-start md:self-auto"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Configure Targets</span>
          </button>
        </div>

        {/* Forecast & Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Budget Limit
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
              {formatCurrency(stats.overallBudget)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Utilized: <strong className="text-slate-800">{stats.budgetUsedPercentage.toFixed(1)}%</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Remaining Budget
            </span>
            <div className={`text-2xl font-extrabold mt-1 font-['Outfit'] ${stats.remainingBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stats.remainingBudget >= 0 ? '' : '-'}{formatCurrency(Math.abs(stats.remainingBudget))}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {stats.remainingBudget >= 0 ? 'Surplus buffer remaining' : 'Deficit overspend'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Safe Daily Spend
            </span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1 font-['Outfit']">
              {stats.daysRemaining > 0 && stats.remainingBudget > 0
                ? formatCurrency(stats.safeDailySpend)
                : '$0.00'}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              For {stats.daysRemaining} days remaining in month
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Projected End-of-Month
            </span>
            <div className={`text-2xl font-extrabold mt-1 font-['Outfit'] ${projectedVariance >= 0 ? 'text-slate-900' : 'text-amber-600'}`}>
              {formatCurrency(projectedSpend)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {projectedVariance >= 0 ? (
                <span className="text-emerald-700 font-medium">On track for {formatCurrency(projectedVariance)} buffer</span>
              ) : (
                <span className="text-amber-700 font-medium">Trending {formatCurrency(Math.abs(projectedVariance))} over</span>
              )}
            </div>
          </div>
        </div>

        {/* Big Overall Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Total Budget Utilization: {stats.budgetUsedPercentage.toFixed(1)}%
            </span>
            <span className="text-slate-500">
              {formatCurrency(stats.totalExpense)} spent / {formatCurrency(stats.overallBudget)} cap
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget ? 'bg-rose-500' : isBudgetWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, stats.budgetUsedPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budget Detail Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
            Category Budget Breakdown &amp; Warnings
          </h4>
          <span className="text-xs text-slate-500">
            {stats.categorySpendings.length} Categories Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.categorySpendings.map((cat) => {
            const isOver = cat.budgetLimit > 0 && cat.totalSpent > cat.budgetLimit;
            const isNear = cat.budgetLimit > 0 && !isOver && cat.budgetUsedPercent >= 80;

            return (
              <div
                key={cat.categoryId}
                className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                      >
                        <CategoryIcon name={cat.icon} className="w-4 h-4" />
                      </span>
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs truncate max-w-[130px]">
                          {cat.categoryName}
                        </h5>
                        <span className="text-[11px] text-slate-400">
                          {cat.transactionCount} transaction{cat.transactionCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isOver
                          ? 'bg-rose-50 text-rose-700'
                          : isNear
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isOver ? 'Over' : isNear ? 'Caution' : 'On Track'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-lg font-bold text-slate-900 font-['Outfit']">
                      {formatCurrency(cat.totalSpent)}
                    </span>
                    <span className="text-xs text-slate-500">
                      of {formatCurrency(cat.budgetLimit)} limit
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, cat.budgetUsedPercent)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                  <span className="text-slate-500">
                    {cat.remainingBudget >= 0
                      ? `${formatCurrency(cat.remainingBudget)} left`
                      : `${formatCurrency(Math.abs(cat.remainingBudget))} over`}
                  </span>
                  <button
                    onClick={() => onFilterByCategory(cat.categoryId)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View Ledger &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Recommendations Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider font-['Outfit']">
            Actionable Financial Insights
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Savings Cushion:</strong> Your savings rate for this period is{' '}
              <strong className="text-emerald-400">{stats.savingsRate.toFixed(1)}%</strong>. Financial experts
              recommend saving at least 20% of net earnings for emergency reserve and investments.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Safe Daily Allowance:</strong> Limiting discretionary daily expenses to{' '}
              <strong className="text-white">{formatCurrency(stats.safeDailySpend, true)}/day</strong> guarantees you will finish {stats.monthName} within your designated spending cap.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
