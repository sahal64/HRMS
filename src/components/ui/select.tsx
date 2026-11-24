import * as React from 'react';
import { cn } from '@/utils/cn';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <select
          className={cn(
            'flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            error && 'border-rose-400 focus-visible:ring-rose-500/30 focus-visible:border-rose-500',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
