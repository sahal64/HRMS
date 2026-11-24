import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
        {icon || <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
