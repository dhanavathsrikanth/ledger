import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { MonthlyStats, MonthTrend, DailySpend } from '../types';
import { formatCurrency } from '../utils/calculations';
import { CategoryIcon } from './CategoryIcon';

interface ChartsSectionProps {
  stats: MonthlyStats;
  trends: MonthTrend[];
  dailySpend: DailySpend[];
  onSelectCategory?: (categoryId: string) => void;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  stats,
  trends,
  dailySpend,
  onSelectCategory,
}) => {
  const [chartView, setChartView] = useState<'donut' | 'budget_bars'>('donut');

  // Filter categories that have spending > 0 for the pie chart
  const activeSpendCategories = stats.categorySpendings.filter((c) => c.totalSpent > 0);

  const pieData = activeSpendCategories.map((c) => ({
    name: c.categoryName,
    value: c.totalSpent,
    color: c.color,
    id: c.categoryId,
    percentage: c.percentageOfTotal,
  }));

  // Linear budget benchmark line for daily chart: (overallBudget / daysInMonth) * day
  const daysCount = dailySpend.length;
  const dailyTargetPace = daysCount > 0 ? stats.overallBudget / daysCount : 0;
  const dailyChartData = dailySpend.map((d) => ({
    day: `Day ${d.dayOfMonth}`,
    expense: d.expense,
    cumulativeExpense: d.cumulativeExpense,
    budgetBaseline: Math.round(dailyTargetPace * d.dayOfMonth),
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: Category Spending Distribution */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-['Outfit']">
                Category Spending Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Expenditure breakdown for {stats.monthName}
              </p>
            </div>
            {/* View toggle */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl text-xs font-semibold border border-slate-200/60">
              <button
                onClick={() => setChartView('donut')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  chartView === 'donut' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Donut
              </button>
              <button
                onClick={() => setChartView('budget_bars')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  chartView === 'budget_bars' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Limits
              </button>
            </div>
          </div>

          {activeSpendCategories.length === 0 ? (
            <div className="h-56 sm:h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-600">No expenses recorded for this month.</p>
              <p className="text-slate-400 mt-1">Add transactions to visualize your category breakdown.</p>
            </div>
          ) : chartView === 'donut' ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-full sm:w-1/2 h-52 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={84}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number | string | undefined) => {
                        const num = typeof val === 'number' ? val : Number(val || 0);
                        return [formatCurrency(num), 'Spent'];
                      }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        fontWeight: '600',
                        boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Mini Legend List */}
              <div className="w-full sm:w-1/2 space-y-1.5 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
                {activeSpendCategories.slice(0, 6).map((cat) => (
                  <div
                    key={cat.categoryId}
                    onClick={() => onSelectCategory && onSelectCategory(cat.categoryId)}
                    className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-200/60"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold text-slate-700 truncate">
                        {cat.categoryName}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-slate-900 font-['Outfit']">
                        {formatCurrency(cat.totalSpent)}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1 font-medium">
                        ({cat.percentageOfTotal.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
                {activeSpendCategories.length > 6 && (
                  <p className="text-[11px] text-slate-400 text-center pt-1 font-medium">
                    + {activeSpendCategories.length - 6} more in reports
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Budget Utilization Bars */
            <div className="space-y-3 py-1">
              {stats.categorySpendings.slice(0, 5).map((cat) => {
                const isOver = cat.budgetLimit > 0 && cat.totalSpent > cat.budgetLimit;
                const isWarn = cat.budgetLimit > 0 && !isOver && cat.budgetUsedPercent >= 80;
                return (
                  <div key={cat.categoryId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{cat.categoryName}</span>
                      </div>
                      <div className="space-x-1 shrink-0 font-medium">
                        <span className="font-bold text-slate-900">{formatCurrency(cat.totalSpent)}</span>
                        <span className="text-slate-400 hidden xs:inline">/ {formatCurrency(cat.budgetLimit)}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isOver
                              ? 'bg-rose-100 text-rose-700'
                              : isWarn
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {cat.budgetUsedPercent.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, cat.budgetUsedPercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
            <span>Total Outflows: <strong className="text-slate-800">{formatCurrency(stats.totalExpense)}</strong></span>
            <span>Active Categories: <strong className="text-slate-800">{activeSpendCategories.length}</strong></span>
          </div>
        </div>

        {/* Right Column: 6-Month Income vs Expenditure Trend */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-['Outfit']">
                Income vs. Outflow Trend
              </h3>
              <p className="text-xs text-slate-500">
                Monthly historical progression (last 6 months)
              </p>
            </div>
            <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
              6-Month
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  width={42}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(value: number | string | undefined) => {
                    const num = typeof value === 'number' ? value : Number(value || 0);
                    return [formatCurrency(num)];
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  iconType="circle"
                />
                <Bar dataKey="income" name="Inflow" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="expense" name="Outflow" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs text-slate-500">
            <span>
              6-Month Net Balance:{' '}
              <strong className="text-indigo-600 font-extrabold">
                {formatCurrency(trends.reduce((acc, t) => acc + t.net, 0))}
              </strong>
            </span>
            <span>
              Avg Monthly Spend:{' '}
              <strong className="text-slate-800 font-bold">
                {formatCurrency(
                  trends.reduce((acc, t) => acc + t.expense, 0) / Math.max(1, trends.length)
                )}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Full Width: Daily Cumulative Spending vs Budget Benchmark */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-['Outfit']">
              Daily Cumulative Outflow vs. Budget Benchmark
            </h3>
            <p className="text-xs text-slate-500">
              Tracking spending progression against ideal linear pace throughout {stats.monthName}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" />
              <span className="text-slate-600 font-semibold">Actual Spent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-slate-400 border-b border-dashed border-slate-400" />
              <span className="text-slate-600 font-semibold">Target Linear Pace</span>
            </div>
          </div>
        </div>

        <div className="h-48 sm:h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dailyChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                interval={Math.max(1, Math.floor(dailyChartData.length / 6))}
                tickFormatter={(val) => val.replace('Day ', 'D')}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                width={42}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                formatter={(val: number | string | undefined, name: string | undefined) => {
                  const num = typeof val === 'number' ? val : Number(val || 0);
                  const label = name === 'cumulativeExpense' ? 'Cumulative Spent' : 'Budget Benchmark';
                  return [formatCurrency(num), label];
                }}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulativeExpense"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#spendGradient)"
                name="cumulativeExpense"
              />
              <Area
                type="monotone"
                dataKey="budgetBaseline"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                name="budgetBaseline"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
