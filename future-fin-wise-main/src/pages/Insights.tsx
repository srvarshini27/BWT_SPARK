import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency } from '@/lib/financial';

export default function Insights() {
  const { profile, expenses, emis, investments } = useFinancialStore();
  const income = profile?.monthlyIncome || 0;
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const totalEmi = emis.reduce((s, e) => s + e.amount, 0);

  const insights = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + e.amount; });
    const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    const highestCat = sorted[0];
    const savingsRate = income > 0 ? ((income - totalSpent - totalEmi) / income) * 100 : 0;
    const emiPct = income > 0 ? (totalEmi / income) * 100 : 0;
    const debtToIncome = emiPct;
    const needsTotal = expenses.filter(e => e.type === 'need').reduce((s, e) => s + e.amount, 0);
    const wantsTotal = expenses.filter(e => e.type === 'want').reduce((s, e) => s + e.amount, 0);

    return [
      { title: 'Highest Spending Category', value: highestCat ? `${highestCat[0]} — ${formatCurrency(highestCat[1])}` : 'No data', type: highestCat && highestCat[1] > income * 0.3 ? 'warning' : 'neutral' },
      { title: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, type: savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'warning' : 'bad' },
      { title: 'Debt-to-Income Ratio', value: `${debtToIncome.toFixed(1)}%`, type: debtToIncome <= 20 ? 'good' : debtToIncome <= 40 ? 'warning' : 'bad' },
      { title: 'EMI Burden', value: `${formatCurrency(totalEmi)}/mo (${emiPct.toFixed(0)}%)`, type: emiPct <= 20 ? 'good' : emiPct <= 40 ? 'warning' : 'bad' },
      { title: 'Needs vs Wants', value: `${formatCurrency(needsTotal)} vs ${formatCurrency(wantsTotal)}`, type: wantsTotal > needsTotal ? 'warning' : 'good' },
      { title: 'Monthly Investment', value: `${formatCurrency(investments.monthly)} (${income > 0 ? ((investments.monthly/income)*100).toFixed(0) : 0}%)`, type: investments.monthly > 0 ? 'good' : 'bad' },
    ];
  }, [expenses, income, totalSpent, totalEmi, emis, investments]);

  const typeStyles = {
    good: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    bad: 'border-destructive/30 bg-destructive/5',
    neutral: 'border-border bg-card',
  };
  const typeText = { good: 'text-success', warning: 'text-warning', bad: 'text-destructive', neutral: 'text-foreground' };

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Financial Insights</h1>
      <p className="text-muted-foreground text-sm mb-6">Intelligent analysis of your financial patterns</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((ins, i) => (
          <motion.div key={ins.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`p-5 rounded-xl border ${typeStyles[ins.type as keyof typeof typeStyles]}`}>
            <p className="text-xs text-muted-foreground mb-2">{ins.title}</p>
            <p className={`font-display text-lg font-bold ${typeText[ins.type as keyof typeof typeText]}`}>{ins.value}</p>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}
