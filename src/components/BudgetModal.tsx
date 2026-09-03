import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, Info, AlertTriangle } from 'lucide-react';
import { BudgetConfig } from '../types';
import { EXPENSE_CATEGORIES } from '../data/categories';
import { formatCurrency } from '../utils/calculations';
import { CategoryIcon } from './CategoryIcon';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  onSave: (newConfig: BudgetConfig) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [overallBudget, setOverallBudget] = useState<number>(config.overallBudget);
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>({
    ...config.categoryLimits,
  });

  if (!isOpen) return null;

  const handleCategoryLimitChange = (catId: string, val: string) => {
    const num = parseFloat(val);
    setCategoryLimits((prev) => ({
      ...prev,
      [catId]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const totalCategoryBudgets = (Object.values(categoryLimits) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
  const isExceedingOverall = totalCategoryBudgets > overallBudget;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      overallBudget: overallBudget > 0 ? overallBudget : 0,
      categoryLimits,
    });
    onClose();
  };

  const handleApplyRecommended = () => {
    const recommended: Record<string, number> = {};
    for (const cat of EXPENSE_CATEGORIES) {
      recommended[cat.id] = cat.defaultMonthlyBudget || 200;
    }
    const sum = (Object.values(recommended) as number[]).reduce((a: number, b: number) => a + b, 0);
    setOverallBudget(sum);
    setCategoryLimits(recommended);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Budget Planning &amp; Category Limits
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Overall Monthly Target */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Total Monthly Spending Ceiling (₹) *
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Maximum allowable expenses for the entire month
            </p>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="500"
                min="0"
                value={overallBudget}
                onChange={(e) => setOverallBudget(parseFloat(e.target.value) || 0)}
                required
                className="w-full pl-8 pr-4 py-2 text-lg font-bold font-['Outfit'] text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Sum of category limits: <strong>{formatCurrency(totalCategoryBudgets)}</strong>
              </span>
              {isExceedingOverall ? (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Allocated exceeds ceiling
                </span>
              ) : (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {formatCurrency(overallBudget - totalCategoryBudgets)} unallocated buffer
                </span>
              )}
            </div>
          </div>

          {/* Category Budgets Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Category Monthly Limits (₹)
              </label>
              <button
                type="button"
                onClick={handleApplyRecommended}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Reset to Standard Targets
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {EXPENSE_CATEGORIES.map((cat) => {
                const limit = categoryLimits[cat.id] ?? (cat.defaultMonthlyBudget || 0);
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        <CategoryIcon name={cat.icon} className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {cat.name}
                      </span>
                    </div>

                    <div className="relative w-32 shrink-0">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        step="100"
                        min="0"
                        value={limit}
                        onChange={(e) => handleCategoryLimitChange(cat.id, e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 text-xs font-bold text-right text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
            >
              Save Budget Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
