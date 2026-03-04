import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

const guides = [
  {
    title: 'How to Open a Demat Account',
    steps: [
      'Choose a broker (Zerodha, Groww, Angel One, etc.)',
      'Visit the broker website and click "Open Account"',
      'Enter your mobile number and email',
      'Complete KYC with Aadhaar + PAN',
      'Upload signature and photo',
      'Complete in-person verification (IPV) via video',
      'Account is activated in 24-48 hours',
      'Start investing in stocks, MFs, and more!',
    ],
  },
  {
    title: 'How to Start a SIP',
    steps: [
      'Open a Demat/mutual fund account',
      'Choose a mutual fund based on your goal and risk',
      'Select SIP amount (start with as low as ₹500)',
      'Choose SIP date (salary day + 2 days recommended)',
      'Set up auto-debit from bank account',
      'Review and confirm the SIP',
      'Track performance monthly, don\'t panic in dips',
    ],
  },
  {
    title: 'How to Invest in Sovereign Gold Bonds',
    steps: [
      'Check RBI announcement for new SGB series',
      'Apply through your bank or broker app',
      'Enter quantity (min 1 gram)',
      'Pay via net banking for ₹50/gram discount',
      'Bonds are credited to your Demat account',
      'Earn 2.5% annual interest + gold price appreciation',
      'Maturity in 8 years (exit after 5 years allowed)',
    ],
  },
  {
    title: 'How to Improve Your CIBIL Score',
    steps: [
      'Pay all EMIs and credit card bills on time',
      'Keep credit utilization below 30%',
      'Don\'t apply for multiple loans at once',
      'Maintain a good mix of secured & unsecured credit',
      'Check your CIBIL report for errors',
      'Dispute any incorrect entries',
      'Old accounts help — don\'t close them unnecessarily',
      'Target: 750+ score for best loan rates',
    ],
  },
  {
    title: 'Home Loan Application Process',
    steps: [
      'Check eligibility (income, age, CIBIL score)',
      'Calculate affordable EMI (max 40% of income)',
      'Compare rates across banks and NBFCs',
      'Gather documents: ID, address proof, salary slips, bank statements, ITR',
      'Apply online or visit the branch',
      'Property valuation by the bank',
      'Loan sanction and agreement signing',
      'Disbursement to builder/seller',
    ],
  },
];

export default function Learn() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Financial Learning Hub</h1>
      <p className="text-muted-foreground text-sm mb-6">Practical, action-based guides to level up your finances</p>

      <div className="space-y-3">
        {guides.map((guide, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{guide.title}</h3>
              </div>
              {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5">
                <div className="space-y-2">
                  {guide.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">{j + 1}</span>
                      </div>
                      <p className="text-sm text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}
