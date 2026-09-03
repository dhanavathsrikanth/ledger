import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { MonthlyStats } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface MetricsCardsProps {
  stats: MonthlyStats;
  onOpenBudgetModal: () => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ stats, onOpenBudgetModal }) => {
  const isBudgetWarning = stats.budgetUsedPercentage > 85;
  const isOverBudget = stats.budgetUsedPercentage > 100;
  const isSurplus = stats.netSavings >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Total Income */}
      <div 
        id="kpi-total-income"
        className="bg-white rounded-xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Total Income
            </span>
            <span className="p-1 sm:p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] truncate">
            {formatCurrency(stats.totalIncome)}
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs pt-1 border-t border-slate-50">
          <span className="text-slate-400 hidden xs:inline">Inflows</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
            +Active Month
          </span>
        </div>
      </div>

      {/* 2. Total Expenditure */}
      <div 
        id="kpi-total-expense"
        className="bg-white rounded-xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Total Spent
            </span>
            <span className="p-1 sm:p-2 rounded-lg bg-rose-50 text-rose-600 shrink-0">
              <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] truncate">
            {formatCurrency(stats.totalExpense)}
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs pt-1 border-t border-slate-50">
          <span className="text-slate-400 hidden xs:inline">
            {stats.totalIncome > 0 
              ? `${((stats.totalExpense / stats.totalIncome) * 100).toFixed(0)}% income`
              : 'Outflows'}
          </span>
          <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
            {stats.categorySpendings.reduce((sum, c) => sum + c.transactionCount, 0)} items
          </span>
        </div>
      </div>

      {/* 3. Net Savings / Cash Flow */}
      <div 
        id="kpi-net-savings"
        className="bg-white rounded-xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Net Savings
            </span>
            <span className={`p-1 sm:p-2 rounded-lg shrink-0 ${isSurplus ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className={`text-lg sm:text-2xl font-extrabold tracking-tight font-['Outfit'] truncate ${isSurplus ? 'text-indigo-600' : 'text-amber-600'}`}>
            {isSurplus ? '+' : ''}{formatCurrency(stats.netSavings)}
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs pt-1 border-t border-slate-50">
          <span className="text-slate-400 hidden xs:inline">Savings Rate</span>
          <span className={`font-semibold px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
            stats.savingsRate >= 20 
              ? 'bg-emerald-50 text-emerald-700' 
              : stats.savingsRate > 0 
                ? 'bg-blue-50 text-blue-700' 
                : 'bg-rose-50 text-rose-700'
          }`}>
            {formatPercent(stats.savingsRate)}
          </span>
        </div>
      </div>

      {/* 4. Monthly Budget Status */}
      <div 
        id="kpi-budget-status"
        className="bg-white rounded-xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition cursor-pointer flex flex-col justify-between active:bg-slate-50"
        onClick={onOpenBudgetModal}
        title="Tap to adjust monthly budget settings"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Budget Cap
            </span>
            <span className={`p-1 sm:p-2 rounded-lg shrink-0 ${
              isOverBudget 
                ? 'bg-rose-50 text-rose-600' 
                : isBudgetWarning 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'bg-emerald-50 text-emerald-600'
            }`}>
              {isOverBudget ? <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] truncate flex items-baseline justify-between gap-1">
            <span>{formatCurrency(stats.overallBudget)}</span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-400">
              {stats.budgetUsedPercentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-rose-500' : isBudgetWarning ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, stats.budgetUsedPercentage)}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 pt-1 border-t border-slate-50">
          <span className="truncate">
            {stats.remainingBudget >= 0 
              ? `${formatCurrency(stats.remainingBudget)} left`
              : `${formatCurrency(Math.abs(stats.remainingBudget))} over`}
          </span>
          <span className="text-blue-600 font-semibold hidden xs:inline hover:underline">
            Adjust
          </span>
        </div>
      </div>
    </div>
  );
};
