import React from 'react';
import { ArrowDownRight, ArrowUpRight, TrendingUp, AlertCircle, ShieldCheck, Flame } from 'lucide-react';
import { MonthlyStats } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface MetricsCardsProps {
  stats: MonthlyStats;
  onOpenBudgetModal: () => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ stats, onOpenBudgetModal }) => {
  const isBudgetWarning = stats.budgetUsedPercentage >= 80;
  const isOverBudget = stats.budgetUsedPercentage > 100;
  const isSurplus = stats.netSavings >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200/80 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* 1. Total Income */}
      <div
        id="kpi-total-income"
        className="bg-white p-4 sm:p-5 flex flex-col justify-between min-w-0"
      >
        <div>
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-medium text-slate-500 truncate">
              Total Inflow
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-2" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight font-mono tabular-nums truncate">
            {formatCurrency(stats.totalIncome)}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 gap-2">
          <span className="text-slate-400 font-medium hidden xs:inline">Monthly Inflow</span>
          <span className="font-medium text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-100/80">
            Recorded Inflow
          </span>
        </div>
      </div>

      {/* 2. Total Outflow / Spent */}
      <div
        id="kpi-total-expense"
        className="bg-white p-4 sm:p-5 flex flex-col justify-between min-w-0"
      >
        <div>
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-medium text-slate-500 truncate">
              Total Outflow
            </span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 shrink-0 border border-rose-100">
              <ArrowDownRight className="w-3.5 h-3.5 stroke-2" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight font-mono tabular-nums truncate">
            {formatCurrency(stats.totalExpense)}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 gap-2">
          <span className="text-slate-400 font-medium hidden xs:inline">
            {stats.totalIncome > 0
              ? `${((stats.totalExpense / stats.totalIncome) * 100).toFixed(0)}% of income`
              : 'Outflow burn'}
          </span>
          <span className="font-medium text-rose-700 bg-rose-50/80 px-2 py-0.5 rounded-full border border-rose-100/80">
            {stats.categorySpendings.reduce((sum, c) => sum + c.transactionCount, 0)} expenses
          </span>
        </div>
      </div>

      {/* 3. Net Savings / Cash Flow */}
      <div
        id="kpi-net-savings"
        className="bg-white p-4 sm:p-5 flex flex-col justify-between min-w-0"
      >
        <div>
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-medium text-slate-500 truncate">
              Net Balance
            </span>
            <span className={`p-1.5 rounded-lg shrink-0 border ${
              isSurplus
                ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              <TrendingUp className="w-3.5 h-3.5 stroke-2" />
            </span>
          </div>
          <div className={`text-xl sm:text-2xl font-semibold tracking-tight font-mono tabular-nums truncate ${
            isSurplus ? 'text-indigo-600' : 'text-amber-600'
          }`}>
            {isSurplus ? '+' : ''}{formatCurrency(stats.netSavings)}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 gap-2">
          <span className="text-slate-400 font-medium hidden xs:inline">Savings Rate</span>
          <span className={`font-medium px-2 py-0.5 rounded-full border ${
            stats.savingsRate >= 20
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : stats.savingsRate > 0
                ? 'bg-blue-50 text-blue-700 border-blue-100'
                : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            <span className="font-mono tabular-nums">{formatPercent(stats.savingsRate)}</span> rate
          </span>
        </div>
      </div>

      {/* 4. Monthly Budget Status */}
      <div
        id="kpi-budget-status"
        className="bg-white p-4 sm:p-5 flex flex-col justify-between min-w-0 cursor-pointer group hover:bg-slate-50/60 transition-colors"
        onClick={onOpenBudgetModal}
        title="Tap to adjust monthly budget targets"
      >
        <div>
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-medium text-slate-500 truncate group-hover:text-blue-600 transition">
              Budget Target
            </span>
            <span className={`p-1.5 rounded-lg shrink-0 border ${
              stats.overallBudget === 0
                ? 'bg-slate-100 text-slate-500 border-slate-200'
                : isOverBudget
                ? 'bg-rose-50 text-rose-600 border-rose-100'
                : isBudgetWarning
                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {stats.overallBudget === 0 ? (
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 stroke-2" />
              ) : isOverBudget ? (
                <AlertCircle className="w-3.5 h-3.5 stroke-2" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 stroke-2" />
              )}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight font-mono tabular-nums truncate flex items-baseline justify-between gap-1">
            <span>{stats.overallBudget > 0 ? formatCurrency(stats.overallBudget) : 'Not Set'}</span>
            {stats.overallBudget > 0 && (
              <span className="text-xs font-medium text-slate-500">
                {stats.budgetUsedPercentage.toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {stats.overallBudget > 0 && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget ? 'bg-rose-500' : isBudgetWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, stats.budgetUsedPercentage)}%` }}
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-100 gap-2">
          <span className="truncate font-medium">
            {stats.overallBudget > 0
              ? (stats.remainingBudget >= 0
                  ? `${formatCurrency(stats.remainingBudget)} cushion`
                  : `${formatCurrency(Math.abs(stats.remainingBudget))} over`)
              : 'Tap to configure cap'}
          </span>
          {stats.overallBudget > 0 && stats.daysRemaining > 0 && stats.remainingBudget > 0 ? (
            <span className="font-medium text-blue-600 flex items-center gap-1 shrink-0">
              <Flame className="w-3 h-3 text-amber-500" />
              <span className="font-mono tabular-nums">{formatCurrency(stats.safeDailySpend, true)}/d</span>
            </span>
          ) : (
            <span className="font-medium text-slate-400 group-hover:text-blue-600 transition">
              Adjust &rarr;
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
