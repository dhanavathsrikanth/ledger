import { Transaction, BudgetConfig, MonthlyStats, CategorySpending, MonthTrend, DailySpend, PaymentMethod } from '../types';
import { EXPENSE_CATEGORIES, getCategoryById } from '../data/categories';

export function formatCurrency(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 100000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 1,
      notation: 'compact',
    }).format(amount);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(val: number): string {
  return `${val >= 0 ? '' : '-'}${Math.abs(val).toFixed(1)}%`;
}

export function getMonthName(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const date = new Date(year, monthIndex, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getShortMonth(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const date = new Date(year, monthIndex, 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function calculateMonthlyStats(
  transactions: Transaction[],
  monthKey: string,
  budgetConfig: BudgetConfig
): MonthlyStats {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-12
  const totalDays = getDaysInMonth(year, month - 1);

  // Filter transactions for this month
  const monthTransactions = transactions.filter((tx) => tx.date.startsWith(monthKey));

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals: Record<string, { total: number; count: number }> = {};

  for (const tx of monthTransactions) {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
      if (!categoryTotals[tx.categoryId]) {
        categoryTotals[tx.categoryId] = { total: 0, count: 0 };
      }
      categoryTotals[tx.categoryId].total += tx.amount;
      categoryTotals[tx.categoryId].count += 1;
    }
  }

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Build category spendings
  const categorySpendings: CategorySpending[] = EXPENSE_CATEGORIES.map((cat) => {
    const catData = categoryTotals[cat.id] || { total: 0, count: 0 };
    const spent = catData.total;
    const limit = budgetConfig.categoryLimits[cat.id] ?? 0;
    const percentOfTotal = totalExpense > 0 ? (spent / totalExpense) * 100 : 0;
    const budgetUsedPercent = limit > 0 ? (spent / limit) * 100 : 0;
    const remaining = limit > 0 ? limit - spent : 0;
    const avg = catData.count > 0 ? spent / catData.count : 0;

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      color: cat.color,
      icon: cat.icon,
      totalSpent: spent,
      transactionCount: catData.count,
      percentageOfTotal: percentOfTotal,
      budgetLimit: limit,
      budgetUsedPercent,
      remainingBudget: remaining,
      averageTransaction: avg,
    };
  });

  // Sort categories by highest spent first
  categorySpendings.sort((a, b) => b.totalSpent - a.totalSpent);

  // Calculate days remaining in this month relative to current day or end of month
  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  
  let daysRemaining = 0;
  if (monthKey === currentMonthKey) {
    const currentDay = today.getDate();
    daysRemaining = Math.max(1, totalDays - currentDay + 1);
  } else if (monthKey < currentMonthKey) {
    daysRemaining = 0;
  } else {
    daysRemaining = totalDays;
  }

  const remainingBudget = budgetConfig.overallBudget - totalExpense;
  const budgetUsedPercentage = budgetConfig.overallBudget > 0 
    ? (totalExpense / budgetConfig.overallBudget) * 100 
    : 0;

  const safeDailySpend = daysRemaining > 0 && remainingBudget > 0
    ? remainingBudget / daysRemaining
    : 0;

  return {
    monthKey,
    monthName: getMonthName(monthKey),
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    overallBudget: budgetConfig.overallBudget,
    budgetUsedPercentage,
    remainingBudget,
    daysRemaining,
    safeDailySpend,
    categorySpendings,
  };
}

export function getMonthTrends(
  transactions: Transaction[],
  targetMonthKey: string,
  count = 6
): MonthTrend[] {
  const [targetYear, targetMonth] = targetMonthKey.split('-').map(Number);
  const trends: MonthTrend[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(targetYear, targetMonth - 1 - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short' });

    const monthTxs = transactions.filter((t) => t.date.startsWith(key));
    let inc = 0;
    let exp = 0;

    for (const t of monthTxs) {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    }

    const net = inc - exp;
    const rate = inc > 0 ? (net / inc) * 100 : 0;

    trends.push({
      monthKey: key,
      label,
      income: inc,
      expense: exp,
      net,
      savingsRate: rate,
    });
  }

  return trends;
}

export function getDailySpending(
  transactions: Transaction[],
  monthKey: string
): DailySpend[] {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const totalDays = getDaysInMonth(year, month - 1);

  const monthTxs = transactions.filter((t) => t.date.startsWith(monthKey));
  const dailyMap: Record<number, { expense: number; income: number }> = {};

  for (let d = 1; d <= totalDays; d++) {
    dailyMap[d] = { expense: 0, income: 0 };
  }

  for (const tx of monthTxs) {
    const day = parseInt(tx.date.split('-')[2], 10);
    if (dailyMap[day]) {
      if (tx.type === 'expense') {
        dailyMap[day].expense += tx.amount;
      } else {
        dailyMap[day].income += tx.amount;
      }
    }
  }

  let runningTotal = 0;
  const result: DailySpend[] = [];

  for (let d = 1; d <= totalDays; d++) {
    const exp = dailyMap[d].expense;
    const inc = dailyMap[d].income;
    runningTotal += exp;
    result.push({
      date: `${monthKey}-${String(d).padStart(2, '0')}`,
      dayOfMonth: d,
      expense: exp,
      income: inc,
      cumulativeExpense: runningTotal,
    });
  }

  return result;
}

export function getPaymentMethodBreakdown(
  transactions: Transaction[],
  monthKey: string
): { method: PaymentMethod; label: string; total: number; count: number; percentage: number }[] {
  const monthExpenses = transactions.filter(
    (t) => t.date.startsWith(monthKey) && t.type === 'expense'
  );

  const labels: Record<PaymentMethod, string> = {
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    bank_transfer: 'Bank Transfer',
    digital_wallet: 'Digital Wallet',
    cash: 'Cash',
  };

  const totals: Record<PaymentMethod, { total: number; count: number }> = {
    credit_card: { total: 0, count: 0 },
    debit_card: { total: 0, count: 0 },
    bank_transfer: { total: 0, count: 0 },
    digital_wallet: { total: 0, count: 0 },
    cash: { total: 0, count: 0 },
  };

  let grandTotal = 0;
  for (const tx of monthExpenses) {
    if (totals[tx.paymentMethod]) {
      totals[tx.paymentMethod].total += tx.amount;
      totals[tx.paymentMethod].count += 1;
      grandTotal += tx.amount;
    }
  }

  return (Object.keys(totals) as PaymentMethod[])
    .map((method) => ({
      method,
      label: labels[method],
      total: totals[method].total,
      count: totals[method].count,
      percentage: grandTotal > 0 ? (totals[method].total / grandTotal) * 100 : 0,
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
}

export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount', 'Payment Method', 'Recurring', 'Note'];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type,
    getCategoryById(t.categoryId).name,
    `"${t.title.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    t.paymentMethod,
    t.isRecurring ? 'Yes' : 'No',
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `expense_tracker_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
