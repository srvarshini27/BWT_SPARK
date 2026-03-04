import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/AppLayout';
import { formatCurrency, calculateSIP } from '@/lib/financial';

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const corpus = calculateSIP(monthly, rate, years);
  const invested = monthly * years * 12;
  const returns = corpus - invested;

  const chartData = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Y${i}`,
    invested: monthly * i * 12,
    corpus: calculateSIP(monthly, rate, i),
  }));

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-1">SIP Calculator</h1>
      <p className="text-muted-foreground text-sm mb-6">See how your money grows with systematic investing</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Monthly Investment</label>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">₹</span>
                <input type="range" min={500} max={100000} step={500} value={monthly}
                  onChange={e => setMonthly(Number(e.target.value))} className="flex-1 accent-primary" />
                <span className="font-display font-bold text-foreground w-24 text-right">{formatCurrency(monthly)}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Expected Return Rate</label>
              <div className="flex items-center gap-3">
                <input type="range" min={1} max={30} step={0.5} value={rate}
                  onChange={e => setRate(Number(e.target.value))} className="flex-1 accent-primary" />
                <span className="font-display font-bold text-foreground w-16 text-right">{rate}%</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Time Period</label>
              <div className="flex items-center gap-3">
                <input type="range" min={1} max={40} value={years}
                  onChange={e => setYears(Number(e.target.value))} className="flex-1 accent-primary" />
                <span className="font-display font-bold text-foreground w-16 text-right">{years} yrs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <p className="text-[10px] text-muted-foreground">Invested</p>
              <p className="font-display text-sm font-bold text-foreground">{formatCurrency(invested)}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <p className="text-[10px] text-muted-foreground">Returns</p>
              <p className="font-display text-sm font-bold text-success">{formatCurrency(returns)}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-center glow-border">
              <p className="text-[10px] text-muted-foreground">Total Corpus</p>
              <p className="font-display text-sm font-bold text-primary">{formatCurrency(corpus)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-sm mb-4">Growth Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="corpusG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="investedG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              <Area type="monotone" dataKey="invested" stroke="hsl(var(--muted-foreground))" fill="url(#investedG)" strokeWidth={2} />
              <Area type="monotone" dataKey="corpus" stroke="hsl(var(--primary))" fill="url(#corpusG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AppLayout>
  );
}
