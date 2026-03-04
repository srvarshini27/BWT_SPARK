export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateSIP = (monthly: number, rate: number, years: number) => {
  const n = years * 12;
  const r = rate / 100 / 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
};

export const calculateEMI = (principal: number, rate: number, years: number) => {
  const n = years * 12;
  const r = rate / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

export const getHealthScore = (
  savingsRate: number,
  emergencyFundPct: number,
  emiRatio: number,
  hasGoals: boolean,
  investmentRate: number
): number => {
  let score = 0;
  // Savings rate (30 pts)
  score += Math.min(savingsRate / 30 * 30, 30);
  // Emergency fund (20 pts)
  score += Math.min(emergencyFundPct / 100 * 20, 20);
  // Low EMI ratio (20 pts)
  score += Math.max(0, (1 - emiRatio / 50) * 20);
  // Has goals (10 pts)
  if (hasGoals) score += 10;
  // Investment rate (20 pts)
  score += Math.min(investmentRate / 20 * 20, 20);
  return Math.round(Math.min(score, 100));
};

export const getScoreColor = (score: number): string => {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 70) return 'bg-success';
  if (score >= 40) return 'bg-warning';
  return 'bg-destructive';
};

export const lifeStageDefaults: Record<string, { riskProfile: string; suggestedSavings: number; goals: string[] }> = {
  'student': { riskProfile: 'Conservative', suggestedSavings: 10, goals: ['Emergency Fund', 'First Laptop', 'Higher Education'] },
  'first-salary': { riskProfile: 'Moderate', suggestedSavings: 20, goals: ['Emergency Fund', 'Travel', 'Two-Wheeler', 'Investment Start'] },
  'parent': { riskProfile: 'Balanced', suggestedSavings: 25, goals: ['Child Education', 'Home Down Payment', 'Life Insurance', 'Emergency Fund'] },
  'mid-career': { riskProfile: 'Growth', suggestedSavings: 30, goals: ['Home Purchase', 'Retirement Fund', 'Children Education', 'Wealth Building'] },
  'pre-retirement': { riskProfile: 'Conservative', suggestedSavings: 40, goals: ['Retirement Corpus', 'Health Fund', 'Legacy Planning'] },
};
