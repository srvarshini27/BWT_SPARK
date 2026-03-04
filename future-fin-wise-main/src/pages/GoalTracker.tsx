import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Target, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/components/AppLayout';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency, calculateSIP } from '@/lib/financial';

export default function GoalTracker() {
  const { goals, addGoal, updateGoal, removeGoal, profile } = useFinancialStore();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleAdd = () => {
    if (!name || !target || !deadline) return;
    addGoal({
      id: Date.now().toString(),
      name, targetAmount: Number(target), currentAmount: 0,
      deadline, priority: 'medium',
    });
    setName(''); setTarget(''); setDeadline('');
  };

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Goal Tracker</h1>
      <p className="text-muted-foreground text-sm mb-6">Set, track, and achieve your financial goals</p>

      {/* Add Goal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
        <h3 className="font-display font-semibold mb-4">Add New Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Goal name"
            className="px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground" />
          <input value={target} onChange={e => setTarget(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Target amount (₹)"
            className="px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground" />
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm" />
          <button onClick={handleAdd} disabled={!name || !target || !deadline}
            className="py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </div>
      </motion.div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No goals yet. Add your first financial goal above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g, i) => {
            const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
            const monthsLeft = Math.max(1, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
            const remaining = g.targetAmount - g.currentAmount;
            const monthlyNeeded = remaining / monthsLeft;
            const sipCorpus = calculateSIP(monthlyNeeded, 12, monthsLeft / 12);
            const successProb = Math.min(100, (sipCorpus / g.targetAmount) * 100);

            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-display font-semibold text-foreground">{g.name}</h4>
                    <p className="text-xs text-muted-foreground">{monthsLeft} months remaining</p>
                  </div>
                  <button onClick={() => removeGoal(g.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{formatCurrency(g.currentAmount)}</span>
                    <span className="text-foreground font-medium">{formatCurrency(g.targetAmount)}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Monthly</p>
                    <p className="text-xs font-semibold text-foreground">{formatCurrency(monthlyNeeded)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">SIP @12%</p>
                    <p className="text-xs font-semibold text-primary">{formatCurrency(monthlyNeeded * 0.8)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Success</p>
                    <p className={`text-xs font-semibold ${successProb >= 70 ? 'text-success' : 'text-warning'}`}>{successProb.toFixed(0)}%</p>
                  </div>
                </div>
                {/* Update progress */}
                <div className="mt-3 flex gap-2">
                  <input placeholder="Add savings (₹)" id={`goal-${g.id}`}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs placeholder:text-muted-foreground" />
                  <button onClick={() => {
                    const inp = document.getElementById(`goal-${g.id}`) as HTMLInputElement;
                    const val = Number(inp.value);
                    if (val > 0) { updateGoal(g.id, { currentAmount: g.currentAmount + val }); inp.value = ''; }
                  }} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
