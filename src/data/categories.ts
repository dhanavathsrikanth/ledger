import { Category } from '../types';

export const EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'housing',
    name: 'Housing & Rent',
    type: 'expense',
    color: '#3B82F6', // Blue
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: 'Home',
  },
  {
    id: 'groceries',
    name: 'Groceries & Market',
    type: 'expense',
    color: '#10B981', // Emerald
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    icon: 'ShoppingCart',
  },
  {
    id: 'dining',
    name: 'Dining & Cafes',
    type: 'expense',
    color: '#F59E0B', // Amber
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: 'Utensils',
  },
  {
    id: 'utilities',
    name: 'Utilities & Internet',
    type: 'expense',
    color: '#06B6D4', // Cyan
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    icon: 'Zap',
  },
  {
    id: 'transport',
    name: 'Transportation & Fuel',
    type: 'expense',
    color: '#8B5CF6', // Purple
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: 'Car',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Wellness',
    type: 'expense',
    color: '#EC4899', // Pink
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    icon: 'HeartPulse',
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Subs',
    type: 'expense',
    color: '#6366F1', // Indigo
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    icon: 'Film',
  },
  {
    id: 'shopping',
    name: 'Shopping & Gear',
    type: 'expense',
    color: '#F97316', // Orange
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    icon: 'ShoppingBag',
  },
  {
    id: 'education',
    name: 'Education & Books',
    type: 'expense',
    color: '#14B8A6', // Teal
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    icon: 'BookOpen',
  },
  {
    id: 'other_expense',
    name: 'Miscellaneous',
    type: 'expense',
    color: '#64748B', // Slate
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    icon: 'Tag',
  },
];

export const INCOME_CATEGORIES: Category[] = [
  {
    id: 'salary',
    name: 'Salary & Wages',
    type: 'income',
    color: '#059669', // Emerald
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    icon: 'Briefcase',
  },
  {
    id: 'freelance',
    name: 'Freelance & Consulting',
    type: 'income',
    color: '#2563EB', // Blue
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: 'Laptop',
  },
  {
    id: 'investments',
    name: 'Investments & Dividends',
    type: 'income',
    color: '#7C3AED', // Violet
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    icon: 'TrendingUp',
  },
  {
    id: 'rental',
    name: 'Rental Income',
    type: 'income',
    color: '#D97706', // Amber
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: 'Building',
  },
  {
    id: 'gifts',
    name: 'Refunds & Gifts',
    type: 'income',
    color: '#DB2777', // Pink
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    icon: 'Gift',
  },
  {
    id: 'other_income',
    name: 'Other Income',
    type: 'income',
    color: '#475569', // Slate
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    icon: 'Coins',
  },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryById(id: string): Category {
  const cat = ALL_CATEGORIES.find((c) => c.id === id);
  if (cat) return cat;
  return {
    id,
    name: id,
    type: 'expense',
    color: '#64748B',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    icon: 'Tag',
  };
}
