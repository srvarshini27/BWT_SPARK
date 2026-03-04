import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  className?: string;
}

export default function MetricCard({ title, value, icon, trend, trendUp, subtitle, className = '' }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`metric-card ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-xs mb-1">{title}</p>
      <p className="font-display text-xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-muted-foreground text-[11px] mt-1">{subtitle}</p>}
    </motion.div>
  );
}
