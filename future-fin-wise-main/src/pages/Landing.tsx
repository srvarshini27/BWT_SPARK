import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Users, TrendingUp, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { useFinancialStore, LifeStage } from '@/store/financialStore';
import { lifeStageDefaults } from '@/lib/financial';

const stages = [
  { id: 'student' as LifeStage, label: 'Student', icon: GraduationCap, desc: 'Learning & building foundations' },
  { id: 'first-salary' as LifeStage, label: 'First Salary', icon: Briefcase, desc: 'Just started earning' },
  { id: 'parent' as LifeStage, label: 'Parent', icon: Users, desc: 'Family responsibilities' },
  { id: 'mid-career' as LifeStage, label: 'Mid-Career', icon: TrendingUp, desc: 'Growing wealth & assets' },
  { id: 'pre-retirement' as LifeStage, label: 'Pre-Retirement', icon: Clock, desc: 'Planning for retirement' },
];

export default function Landing() {
  const [step, setStep] = useState(0);
  const [selectedStage, setSelectedStage] = useState<LifeStage | null>(null);
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const navigate = useNavigate();
  const setProfile = useFinancialStore(s => s.setProfile);

  const handleComplete = () => {
    if (!selectedStage || !name) return;
    setProfile({
      name,
      lifeStage: selectedStage,
      monthlyIncome: Number(income) || 0,
      onboarded: true,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4"
      style={{ background: 'var(--gradient-hero)' }}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }}
            className="text-center max-w-2xl">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Future Finance</span>
              <br />Intelligence
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Your AI-powered financial planning companion. Track, plan, simulate, and grow your wealth intelligently.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg transition-shadow hover:shadow-lg hover:shadow-primary/25"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
            <p className="text-muted-foreground text-sm mt-4">Free • No signup required • Data stored locally</p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="name" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md">
            <h2 className="font-display text-2xl font-bold text-center mb-2">What's your name?</h2>
            <p className="text-muted-foreground text-center mb-6">Let's personalize your experience</p>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
              autoFocus
            />
            <button onClick={() => name && setStep(2)} disabled={!name}
              className="w-full mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="stage" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-lg">
            <h2 className="font-display text-2xl font-bold text-center mb-2">Hi {name}! Where are you in life?</h2>
            <p className="text-muted-foreground text-center mb-6">This helps us customize your financial plan</p>
            <div className="space-y-3">
              {stages.map(s => (
                <motion.button key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStage(s.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    selectedStage === s.id
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}>
                  <div className={`p-2 rounded-lg ${selectedStage === s.id ? 'bg-primary/20' : 'bg-secondary'}`}>
                    <s.icon className={`w-5 h-5 ${selectedStage === s.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-display font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  {selectedStage === s.id && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            {selectedStage && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Risk Profile: <span className="text-foreground font-medium">{lifeStageDefaults[selectedStage].riskProfile}</span></p>
                <p className="text-xs text-muted-foreground">Suggested Savings: <span className="text-primary font-medium">{lifeStageDefaults[selectedStage].suggestedSavings}%</span> of income</p>
              </motion.div>
            )}
            <button onClick={() => selectedStage && setStep(3)} disabled={!selectedStage}
              className="w-full mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="income" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md">
            <h2 className="font-display text-2xl font-bold text-center mb-2">Monthly Income</h2>
            <p className="text-muted-foreground text-center mb-6">How much do you earn per month? (in ₹)</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-display text-lg">₹</span>
              <input
                value={income} onChange={e => setIncome(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="50000"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body text-lg"
                autoFocus
              />
            </div>
            <button onClick={handleComplete} disabled={!income}
              className="w-full mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
