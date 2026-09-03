export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'cash'
  | 'digital_wallet';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  defaultMonthlyBudget?: number;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  paymentMethod: PaymentMethod;
  note?: string;
  isRecurring?: boolean;
}

export interface BudgetConfig {
  overallBudget: number;
  categoryLimits: Record<string, number>;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  color: string;
  icon: string;
  totalSpent: number;
  transactionCount: number;
  percentageOfTotal: number;
  budgetLimit: number;
  budgetUsedPercent: number;
  remainingBudget: number;
  averageTransaction: number;
}

export interface MonthlyStats {
  monthKey: string; // YYYY-MM
  monthName: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number; // percentage (e.g. 24.5)
  overallBudget: number;
  budgetUsedPercentage: number;
  remainingBudget: number;
  daysRemaining: number;
  safeDailySpend: number;
  categorySpendings: CategorySpending[];
}

export interface DailySpend {
  date: string;
  dayOfMonth: number;
  expense: number;
  income: number;
  cumulativeExpense: number;
}

export interface MonthTrend {
  monthKey: string;
  label: string;
  income: number;
  expense: number;
  net: number;
  savingsRate: number;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'reports' | 'budgets';
