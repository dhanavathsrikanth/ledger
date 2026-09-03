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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Total Income */}
      <div 
        id="kpi-total-income"
        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Total Inflow
            </span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] truncate">
            {formatCurrency(stats.totalIncome)}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[11px] sm:text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-400 font-medium hidden xs:inline">Monthly Inflow</span>
          <span className="font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full text-[10px] sm:text-xs border border-emerald-100/80">
            Recorded Inflow
          </span>
        </div>
      </div>

      {/* 2. Total Outflow / Spent */}
      <div 
        id="kpi-total-expense"
        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Total Outflow
            </span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0 border border-rose-100">
              <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] truncate">
            {formatCurrency(stats.totalExpense)}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[11px] sm:text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-400 font-medium hidden xs:inline">
            {stats.totalIncome > 0 
              ? `${((stats.totalExpense / stats.totalIncome) * 100).toFixed(0)}% of income`
              : 'Outflow burn'}
          </span>
          <span className="font-bold text-rose-700 bg-rose-50/80 px-2 py-0.5 rounded-full text-[10px] sm:text-xs border border-rose-100/80">
            {stats.categorySpendings.reduce((sum, c) => sum + c.transactionCount, 0)} expenses
          </span>
        </div>
      </div>

      {/* 3. Net Savings / Cash Flow */}
      <div 
        id="kpi-net-savings"
        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Net Balance
            </span>
            <span className={`p-1.5 sm:p-2 rounded-xl shrink-0 border ${
              isSurplus 
                ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className={`text-xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] truncate ${
            isSurplus ? 'text-indigo-600' : 'text-amber-600'
          }`}>
            {isSurplus ? '+' : ''}{formatCurrency(stats.netSavings)}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[11px] sm:text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-400 font-medium hidden xs:inline">Savings Rate</span>
          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-xs border ${
            stats.savingsRate >= 20 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : stats.savingsRate > 0 
                ? 'bg-blue-50 text-blue-700 border-blue-100' 
                : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {formatPercent(stats.savingsRate)} rate
          </span>
        </div>
      </div>

      {/* 4. Monthly Budget Status */}
      <div 
        id="kpi-budget-status"
        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-blue-400 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
        onClick={onOpenBudgetModal}
        title="Tap to adjust monthly budget targets"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate group-hover:text-blue-600 transition">
              Budget Target
            </span>
            <span className={`p-1.5 sm:p-2 rounded-xl shrink-0 border ${
              stats.overallBudget === 0
                ? 'bg-slate-100 text-slate-500 border-slate-200'
                : isOverBudget 
                ? 'bg-rose-50 text-rose-600 border-rose-100' 
                : isBudgetWarning 
                  ? 'bg-amber-50 text-amber-600 border-amber-100' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {stats.overallBudget === 0 ? (
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 stroke-[2.5]" />
              ) : isOverBudget ? (
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              )}
            </span>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] truncate flex items-baseline justify-between gap-1">
            <span>{stats.overallBudget > 0 ? formatCurrency(stats.overallBudget) : 'Not Set'}</span>
            {stats.overallBudget > 0 && (
              <span className="text-xs font-bold text-slate-500">
                {stats.budgetUsedPercentage.toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {stats.overallBudget > 0 && (
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden border border-slate-100">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget ? 'bg-rose-500' : isBudgetWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, stats.budgetUsedPercentage)}%` }}
            />
          </div>
        )}

        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="truncate font-medium">
            {stats.overallBudget > 0
              ? (stats.remainingBudget >= 0 
                  ? `${formatCurrency(stats.remainingBudget)} cushion`
                  : `${formatCurrency(Math.abs(stats.remainingBudget))} over`)
              : 'Tap to configure cap'}
          </span>
          {stats.overallBudget > 0 && stats.daysRemaining > 0 && stats.remainingBudget > 0 ? (
            <span className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5 shrink-0">
              <Flame className="w-3 h-3 text-amber-500" />
              {formatCurrency(stats.safeDailySpend, true)}/d
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-400 group-hover:text-blue-600 transition">
              Adjust &rarr;
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
