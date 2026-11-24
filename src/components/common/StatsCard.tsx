import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  description,
  icon,
  iconBgColor = 'bg-primary-50',
  iconColor = 'text-primary-600',
  className,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:border-slate-300',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {title}
            </p>
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </div>
          </div>
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
              iconBgColor,
              iconColor
            )}
          >
            {icon}
          </div>
        </div>

        {(change || description) && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            {change && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded',
                  trend === 'up' && 'text-emerald-700 bg-emerald-50',
                  trend === 'down' && 'text-rose-700 bg-rose-50',
                  trend === 'neutral' && 'text-slate-700 bg-slate-100'
                )}
              >
                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                {change}
              </span>
            )}
            {description && (
              <span className="text-slate-500 truncate">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
