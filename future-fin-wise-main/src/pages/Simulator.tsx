import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Briefcase, Heart, Home } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/AppLayout';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency, calculateSIP, calculateEMI } from '@/lib/financial';

type Scenario = 'sip' | 'loan' | 'salary-hike' | 'job-loss' | 'medical';

export default function Simulator() {
  const { profile, investments, emergencyFund } = useFinancialStore();
  const income = profile?.monthlyIncome || 0;
  const [scenario, setScenario] = useState<Scenario>('sip');
  const [sipAmt, setSipAmt] = useState(5000);
  const [loanAmt, setLoanAmt] = useState(1000000);
  const [loanRate, setLoanRate] = useState(9);
  const [loanYears, setLoanYears] = useState(5);
  const [hikePercent, setHikePercent] = useState(20);
  const [jobLossMonths, setJobLossMonths] = useState(3);
  const [medicalCost, setMedicalCost] = useState(200000);

  const scenarios: { id: Scenario; label: string; icon: React.ReactNode }[] = [
    { id: 'sip', label: 'SIP Growth', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'loan', label: 'Loan Impact', icon: <Home className="w-4 h-4" /> },
    { id: 'salary-hike', label: 'Salary Hike', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'job-loss', label: 'Job Loss', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'medical', label: 'Medical Emergency', icon: <Heart className="w-4 h-4" /> },
  ];

  const renderSimulation = () => {
    switch (scenario) {
      case 'sip': {
        const data = Array.from({ length: 11 }, (_, i) => ({
          year: `Y${i}`, netWorth: investments.total + calculateSIP(sipAmt, 12, i),
        }));
        return (
          <div>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Monthly SIP: {formatCurrency(sipAmt)}</label>
              <input type="range" min={500} max={50000} step={500} value={sipAmt} onChange={e => setSipAmt(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">10-year projection at 12% returns</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="netWorth" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-center text-primary font-semibold mt-2">
              10-year corpus: {formatCurrency(investments.total + calculateSIP(sipAmt, 12, 10))}
            </p>
          </div>
        );
      }
      case 'loan': {
        const emi = calculateEMI(loanAmt, loanRate, loanYears);
        const totalPaid = emi * loanYears * 12;
        const interest = totalPaid - loanAmt;
        const emiPct = income > 0 ? (emi / income) * 100 : 0;
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Loan Amount: {formatCurrency(loanAmt)}</label>
              <input type="range" min={100000} max={10000000} step={100000} value={loanAmt} onChange={e => setLoanAmt(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Rate: {loanRate}%</label>
              <input type="range" min={5} max={20} step={0.5} value={loanRate} onChange={e => setLoanRate(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tenure: {loanYears} years</label>
              <input type="range" min={1} max={30} value={loanYears} onChange={e => setLoanYears(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-secondary/50 text-center">
                <p className="text-[10px] text-muted-foreground">EMI</p>
                <p className="font-display text-sm font-bold text-foreground">{formatCurrency(emi)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 text-center">
                <p className="text-[10px] text-muted-foreground">Total Interest</p>
                <p className="font-display text-sm font-bold text-destructive">{formatCurrency(interest)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 text-center">
                <p className="text-[10px] text-muted-foreground">EMI/Income</p>
                <p className={`font-display text-sm font-bold ${emiPct > 40 ? 'text-destructive' : 'text-success'}`}>{emiPct.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        );
      }
      case 'salary-hike': {
        const newIncome = income * (1 + hikePercent / 100);
        const extraSavings = newIncome - income;
        const sipGrowth = calculateSIP(extraSavings * 0.5, 12, 5);
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Hike: {hikePercent}%</label>
              <input type="range" min={5} max={100} value={hikePercent} onChange={e => setHikePercent(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
                <p className="text-xs text-muted-foreground">New Income</p>
                <p className="font-display font-bold text-success">{formatCurrency(newIncome)}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <p className="text-xs text-muted-foreground">If you invest 50% of hike for 5 yrs</p>
                <p className="font-display font-bold text-primary">{formatCurrency(sipGrowth)}</p>
              </div>
            </div>
          </div>
        );
      }
      case 'job-loss': {
        const monthsSurvival = emergencyFund.current > 0 && income > 0 ? emergencyFund.current / (income * 0.5) : 0;
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-semibold mb-2">Simulation: You lose your job today</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Emergency fund</span>
                  <span className="text-foreground">{formatCurrency(emergencyFund.current)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Can survive</span>
                  <span className={`font-bold ${monthsSurvival >= 6 ? 'text-success' : 'text-destructive'}`}>{monthsSurvival.toFixed(1)} months</span>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'medical': {
        const afterEF = emergencyFund.current - medicalCost;
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Medical Cost: {formatCurrency(medicalCost)}</label>
              <input type="range" min={10000} max={2000000} step={10000} value={medicalCost} onChange={e => setMedicalCost(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Emergency fund after</span>
                  <span className={`font-bold ${afterEF >= 0 ? 'text-success' : 'text-destructive'}`}>{formatCurrency(afterEF)}</span>
                </div>
                {afterEF < 0 && <p className="text-xs text-destructive">You'd need a loan of {formatCurrency(Math.abs(afterEF))}</p>}
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Future Impact Simulator</h1>
      <p className="text-muted-foreground text-sm mb-6">Simulate financial decisions before making them</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {scenarios.map(s => (
          <button key={s.id} onClick={() => setScenario(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scenario === s.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <motion.div key={scenario} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        {renderSimulation()}
      </motion.div>
    </AppLayout>
  );
}
