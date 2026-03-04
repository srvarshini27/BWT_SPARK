import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/components/AppLayout';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency } from '@/lib/financial';

export default function EmergencyFund() {
  const { profile, emergencyFund, setEmergencyFund, expenses } = useFinancialStore();
  const income = profile?.monthlyIncome || 0;
  const [months, setMonths] = useState(6);

  const monthlyExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const essentialExpenses = expenses.filter(e => e.type === 'need').reduce((s, e) => s + e.amount, 0) || income * 0.5;
  const target = essentialExpenses * months;
  const current = emergencyFund.current;
  const pct = target > 0 ? (current / target) * 100 : 0;
  const monthlyContribution = target > 0 ? Math.max(0, (target - current) / 12) : 0;

  const [addAmount, setAddAmount] = useState('');

  const handleSave = () => {
    const val = Number(addAmount);
    if (val > 0) {
      setEmergencyFund({ target, current: current + val });
      setAddAmount('');
    }
  };

  // Update target when months change
  const handleMonthsChange = (m: number) => {
    setMonths(m);
    setEmergencyFund({ target: essentialExpenses * m, current });
  };

  const riskLevel = pct >= 100 ? 'Low' : pct >= 50 ? 'Medium' : 'High';
  const riskColor = pct >= 100 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-destructive';

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Emergency Fund Planner</h1>
      <p className="text-muted-foreground text-sm mb-6">Build your financial safety net</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Fund Progress</h3>
              <p className={`text-xs font-medium ${riskColor}`}>Risk Level: {riskLevel}</p>
            </div>
          </div>
          <div className="text-center mb-6">
            <p className="text-3xl font-display font-bold text-foreground">{formatCurrency(current)}</p>
            <p className="text-sm text-muted-foreground">of {formatCurrency(target)} target</p>
          </div>
          <Progress value={Math.min(pct, 100)} className="h-3 mb-4" />
          <p className="text-center text-sm text-muted-foreground">{pct.toFixed(0)}% complete</p>

          <div className="mt-6 flex gap-2">
            <input value={addAmount} onChange={e => setAddAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Add funds (₹)" className="flex-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground" />
            <button onClick={handleSave} disabled={!addAmount}
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40">
              Save
            </button>
          </div>
        </motion.div>

        {/* Configuration & Simulation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4">Configure Fund</h3>
            <p className="text-xs text-muted-foreground mb-3">How many months of expenses should your fund cover?</p>
            <div className="flex gap-2">
              {[3, 4, 5, 6].map(m => (
                <button key={m} onClick={() => handleMonthsChange(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    months === m ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}>{m} mo</button>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-secondary/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Essential expenses</span>
                <span className="text-foreground font-medium">{formatCurrency(essentialExpenses)}/mo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target fund</span>
                <span className="text-primary font-medium">{formatCurrency(target)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly contribution needed</span>
                <span className="text-foreground font-medium">{formatCurrency(monthlyContribution)}</span>
              </div>
            </div>
          </div>

          {/* Job Loss Simulation */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h3 className="font-display font-semibold text-sm">Job Loss Simulation</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">If you lost your income today:</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fund would last</span>
                <span className="text-foreground font-bold">
                  {essentialExpenses > 0 ? `${(current / essentialExpenses).toFixed(1)} months` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shortfall</span>
                <span className="text-destructive font-bold">
                  {formatCurrency(Math.max(0, target - current))}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
