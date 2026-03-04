import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, PiggyBank, CreditCard, Shield, Target, BarChart3, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import AppLayout from '@/components/AppLayout';
import MetricCard from '@/components/MetricCard';
import ProgressRing from '@/components/ProgressRing';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency, getHealthScore, getScoreColor } from '@/lib/financial';

export default function Dashboard() {
  const { profile, expenses, goals, emergencyFund, investments, emis } = useFinancialStore();
  const income = profile?.monthlyIncome || 0;

  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalEmi = useMemo(() => emis.reduce((s, e) => s + e.amount, 0), [emis]);
  const totalSaved = income - totalSpent - totalEmi;
  const savingsRate = income > 0 ? (totalSaved / income) * 100 : 0;
  const emiRatio = income > 0 ? (totalEmi / income) * 100 : 0;
  const investmentRate = income > 0 ? (investments.monthly / income) * 100 : 0;
  const emergencyPct = emergencyFund.target > 0 ? (emergencyFund.current / emergencyFund.target) * 100 : 0;
  const netWorth = investments.total + emergencyFund.current + totalSaved;

  const healthScore = getHealthScore(savingsRate, emergencyPct, emiRatio, goals.length > 0, investmentRate);

  const spendingData = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + e.amount; });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  // Mock trend data
  const trendData = [
    { month: 'Jan', income: income * 0.9, spent: totalSpent * 0.8 },
    { month: 'Feb', income: income * 0.95, spent: totalSpent * 0.9 },
    { month: 'Mar', income, spent: totalSpent },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Welcome back, {profile?.name || 'User'} 👋</h1>
        <p className="text-muted-foreground text-sm">Here's your financial overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Monthly Income" value={formatCurrency(income)} icon={<Wallet className="w-4 h-4 text-primary" />} />
        <MetricCard title="Total Spent" value={formatCurrency(totalSpent)} icon={<CreditCard className="w-4 h-4 text-warning" />} />
        <MetricCard title="Total Saved" value={formatCurrency(Math.max(totalSaved, 0))} icon={<PiggyBank className="w-4 h-4 text-success" />}
          trend={`${savingsRate.toFixed(0)}%`} trendUp={savingsRate > 20} />
        <MetricCard title="Invested" value={formatCurrency(investments.total)} icon={<TrendingUp className="w-4 h-4 text-info" />}
          subtitle={`${formatCurrency(investments.monthly)}/mo`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Health Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex flex-col items-center">
          <h3 className="font-display font-semibold text-sm mb-4">Financial Health Score</h3>
          <ProgressRing progress={healthScore} size={140} strokeWidth={10} label="/100" />
          <p className={`mt-3 text-sm font-medium ${getScoreColor(healthScore)}`}>
            {healthScore >= 70 ? 'Excellent' : healthScore >= 40 ? 'Needs Improvement' : 'At Risk'}
          </p>
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6">
          <h3 className="font-display font-semibold text-sm mb-4">Spending Breakdown</h3>
          {spendingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={spendingData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {spendingData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">Add expenses to see breakdown</div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {spendingData.map((d, i) => (
              <span key={d.name} className="text-[10px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 space-y-4">
          <h3 className="font-display font-semibold text-sm mb-2">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Net Worth</span>
              <span className="text-sm font-semibold text-foreground">{formatCurrency(netWorth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active EMIs</span>
              <span className="text-sm font-semibold text-foreground">{formatCurrency(totalEmi)}/mo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Emergency Fund</span>
              <span className="text-sm font-semibold text-foreground">{emergencyPct.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active Goals</span>
              <span className="text-sm font-semibold text-foreground">{goals.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">EMI Burden</span>
              <span className={`text-sm font-semibold ${emiRatio > 40 ? 'text-destructive' : emiRatio > 20 ? 'text-warning' : 'text-success'}`}>{emiRatio.toFixed(0)}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Income vs Spending Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-6">
        <h3 className="font-display font-semibold text-sm mb-4">Income vs Spending Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" fill="url(#incomeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="spent" stroke="hsl(var(--warning))" fill="url(#spentGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </AppLayout>
  );
}
