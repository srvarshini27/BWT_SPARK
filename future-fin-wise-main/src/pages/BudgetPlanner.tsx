import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AppLayout from '@/components/AppLayout';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency } from '@/lib/financial';

const categories = [
  { name: 'Rent', type: 'need' as const },
  { name: 'Food', type: 'need' as const },
  { name: 'Transport', type: 'need' as const },
  { name: 'Utilities', type: 'need' as const },
  { name: 'Shopping', type: 'want' as const },
  { name: 'Entertainment', type: 'want' as const },
  { name: 'Dining Out', type: 'want' as const },
  { name: 'Subscriptions', type: 'want' as const },
  { name: 'Savings', type: 'savings' as const },
  { name: 'SIP', type: 'investment' as const },
  { name: 'Stocks', type: 'investment' as const },
  { name: 'Other', type: 'want' as const },
];

export default function BudgetPlanner() {
  const { profile, expenses, addExpense, removeExpense } = useFinancialStore();
  const [category, setCategory] = useState(categories[0].name);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const income = profile?.monthlyIncome || 0;

  const handleAdd = () => {
    if (!amount) return;
    const cat = categories.find(c => c.name === category)!;
    addExpense({
      id: Date.now().toString(),
      category,
      type: cat.type,
      amount: Number(amount),
      date: new Date().toISOString(),
      description: desc || category,
    });
    setAmount('');
    setDesc('');
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const needs = expenses.filter(e => e.type === 'need').reduce((s, e) => s + e.amount, 0);
  const wants = expenses.filter(e => e.type === 'want').reduce((s, e) => s + e.amount, 0);
  const savings = expenses.filter(e => e.type === 'savings').reduce((s, e) => s + e.amount, 0);
  const invested = expenses.filter(e => e.type === 'investment').reduce((s, e) => s + e.amount, 0);

  const barData = [
    { name: 'Needs', value: needs, color: 'hsl(var(--chart-1))' },
    { name: 'Wants', value: wants, color: 'hsl(var(--chart-3))' },
    { name: 'Savings', value: savings, color: 'hsl(var(--chart-5))' },
    { name: 'Investments', value: invested, color: 'hsl(var(--chart-2))' },
  ];

  const spendPct = income > 0 ? (totalSpent / income) * 100 : 0;
  const disciplineScore = Math.max(0, Math.min(100, 100 - (spendPct > 70 ? (spendPct - 70) * 3 : 0)));

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Smart Budget Planner</h1>
      <p className="text-muted-foreground text-sm mb-6">Track and categorize your spending</p>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Income', val: formatCurrency(income), cls: 'text-primary' },
          { label: 'Needs', val: formatCurrency(needs), cls: 'text-chart-1' },
          { label: 'Wants', val: formatCurrency(wants), cls: 'text-warning' },
          { label: 'Savings', val: formatCurrency(savings), cls: 'text-success' },
          { label: 'Discipline', val: `${disciplineScore.toFixed(0)}/100`, cls: disciplineScore >= 70 ? 'text-success' : 'text-warning' },
        ].map(m => (
          <div key={m.label} className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
            <p className={`font-display text-lg font-bold ${m.cls}`}>{m.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Expense */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Add Expense</h3>
          <div className="space-y-3">
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm">
              {categories.map(c => <option key={c.name} value={c.name}>{c.name} ({c.type})</option>)}
            </select>
            <input value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Amount (₹)" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground" />
            <input value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Description (optional)" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground" />
            <button onClick={handleAdd} disabled={!amount}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {spendPct > 80 && (
            <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-xs text-destructive">You've spent {spendPct.toFixed(0)}% of your income!</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Expense List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mt-6">
        <h3 className="font-display font-semibold mb-4">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No expenses added yet</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...expenses].reverse().map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    e.type === 'need' ? 'bg-primary/15 text-primary' :
                    e.type === 'want' ? 'bg-warning/15 text-warning' :
                    e.type === 'savings' ? 'bg-success/15 text-success' :
                    'bg-info/15 text-info'
                  }`}>{e.type}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{e.description}</p>
                    <p className="text-[10px] text-muted-foreground">{e.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(e.amount)}</span>
                  <button onClick={() => removeExpense(e.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
