import { create } from 'zustand';

export type LifeStage = 'student' | 'first-salary' | 'parent' | 'mid-career' | 'pre-retirement';

export interface UserProfile {
  name: string;
  lifeStage: LifeStage;
  monthlyIncome: number;
  onboarded: boolean;
}

export interface Expense {
  id: string;
  category: string;
  type: 'need' | 'want' | 'savings' | 'investment';
  amount: number;
  date: string;
  description: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FinancialState {
  profile: UserProfile | null;
  expenses: Expense[];
  goals: Goal[];
  emergencyFund: { target: number; current: number };
  investments: { monthly: number; total: number };
  emis: { name: string; amount: number; remaining: number }[];
  setProfile: (p: UserProfile) => void;
  addExpense: (e: Expense) => void;
  removeExpense: (id: string) => void;
  addGoal: (g: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  setEmergencyFund: (ef: { target: number; current: number }) => void;
  setInvestments: (inv: { monthly: number; total: number }) => void;
  addEmi: (emi: { name: string; amount: number; remaining: number }) => void;
}

const loadState = () => {
  try {
    const s = localStorage.getItem('ffi-state');
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
};

const saveState = (state: any) => {
  localStorage.setItem('ffi-state', JSON.stringify({
    profile: state.profile,
    expenses: state.expenses,
    goals: state.goals,
    emergencyFund: state.emergencyFund,
    investments: state.investments,
    emis: state.emis,
  }));
};

const initial = loadState();

export const useFinancialStore = create<FinancialState>((set, get) => ({
  profile: initial.profile || null,
  expenses: initial.expenses || [],
  goals: initial.goals || [],
  emergencyFund: initial.emergencyFund || { target: 0, current: 0 },
  investments: initial.investments || { monthly: 0, total: 0 },
  emis: initial.emis || [],
  setProfile: (p) => { set({ profile: p }); saveState({ ...get(), profile: p }); },
  addExpense: (e) => {
    const expenses = [...get().expenses, e];
    set({ expenses }); saveState({ ...get(), expenses });
  },
  removeExpense: (id) => {
    const expenses = get().expenses.filter(e => e.id !== id);
    set({ expenses }); saveState({ ...get(), expenses });
  },
  addGoal: (g) => {
    const goals = [...get().goals, g];
    set({ goals }); saveState({ ...get(), goals });
  },
  updateGoal: (id, updates) => {
    const goals = get().goals.map(g => g.id === id ? { ...g, ...updates } : g);
    set({ goals }); saveState({ ...get(), goals });
  },
  removeGoal: (id) => {
    const goals = get().goals.filter(g => g.id !== id);
    set({ goals }); saveState({ ...get(), goals });
  },
  setEmergencyFund: (ef) => { set({ emergencyFund: ef }); saveState({ ...get(), emergencyFund: ef }); },
  setInvestments: (inv) => { set({ investments: inv }); saveState({ ...get(), investments: inv }); },
  addEmi: (emi) => {
    const emis = [...get().emis, emi];
    set({ emis }); saveState({ ...get(), emis });
  },
}));
