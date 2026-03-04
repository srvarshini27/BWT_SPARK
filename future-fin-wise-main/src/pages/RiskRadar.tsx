import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, TrendingDown, PiggyBank, CreditCard } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useFinancialStore } from '@/store/financialStore';

interface RiskItem {
  label: string;
  status: 'green' | 'yellow' | 'red';
  message: string;
  icon: React.ReactNode;
}

export default function RiskRadar() {
  const { profile, expenses, emergencyFund, emis, investments } = useFinancialStore();
  const income = profile?.monthlyIncome || 0;

  const risks = useMemo<RiskItem[]>(() => {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const totalEmi = emis.reduce((s, e) => s + e.amount, 0);
    const savingsRate = income > 0 ? ((income - totalSpent - totalEmi) / income) * 100 : 0;
    const emiRatio = income > 0 ? (totalEmi / income) * 100 : 0;
    const efPct = emergencyFund.target > 0 ? (emergencyFund.current / emergencyFund.target) * 100 : 0;
    const investRate = income > 0 ? (investments.monthly / income) * 100 : 0;

    return [
      {
        label: 'Emergency Fund',
        status: efPct >= 100 ? 'green' : efPct >= 50 ? 'yellow' : 'red',
        message: efPct >= 100 ? 'Fully funded' : efPct >= 50 ? `${efPct.toFixed(0)}% funded — keep going` : 'Critically low — prioritize building this',
        icon: <Shield className="w-5 h-5" />,
      },
      {
        label: 'EMI Burden',
        status: emiRatio <= 20 ? 'green' : emiRatio <= 40 ? 'yellow' : 'red',
        message: emiRatio <= 20 ? 'Healthy EMI ratio' : emiRatio <= 40 ? 'EMIs are getting high' : 'Dangerous EMI burden — avoid new loans',
        icon: <CreditCard className="w-5 h-5" />,
      },
      {
        label: 'Savings Rate',
        status: savingsRate >= 20 ? 'green' : savingsRate >= 10 ? 'yellow' : 'red',
        message: savingsRate >= 20 ? `Saving ${savingsRate.toFixed(0)}% — excellent` : savingsRate >= 10 ? 'Could save more' : 'Savings too low — cut discretionary spending',
        icon: <PiggyBank className="w-5 h-5" />,
      },
      {
        label: 'Investment Rate',
        status: investRate >= 15 ? 'green' : investRate >= 5 ? 'yellow' : 'red',
        message: investRate >= 15 ? 'Great investment discipline' : investRate >= 5 ? 'Try to increase investments' : 'Start investing — even small amounts help',
        icon: <TrendingDown className="w-5 h-5" />,
      },
    ];
  }, [profile, expenses, emergencyFund, emis, investments, income]);

  const colorMap = { green: 'border-success bg-success/10', yellow: 'border-warning bg-warning/10', red: 'border-destructive bg-destructive/10' };
  const textMap = { green: 'text-success', yellow: 'text-warning', red: 'text-destructive' };
  const dotMap = { green: 'bg-success', yellow: 'bg-warning', red: 'bg-destructive' };

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Financial Risk Radar</h1>
      <p className="text-muted-foreground text-sm mb-6">Real-time health check of your finances</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((r, i) => (
          <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-xl border ${colorMap[r.status]}`}>
            <div className="flex items-start gap-3">
              <div className={textMap[r.status]}>{r.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-foreground">{r.label}</h3>
                  <span className={`w-2.5 h-2.5 rounded-full ${dotMap[r.status]} animate-pulse-glow`} />
                </div>
                <p className={`text-sm ${textMap[r.status]}`}>{r.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-6 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-display font-semibold">Risk Summary</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {risks.filter(r => r.status === 'red').length === 0
            ? risks.filter(r => r.status === 'yellow').length === 0
              ? '✅ All indicators are green! Your finances are in great shape.'
              : `⚠️ ${risks.filter(r => r.status === 'yellow').length} area(s) need attention. Review the yellow indicators above.`
            : `🚨 ${risks.filter(r => r.status === 'red').length} critical risk(s) detected. Take immediate action on the red indicators.`
          }
        </p>
      </motion.div>
    </AppLayout>
  );
}
