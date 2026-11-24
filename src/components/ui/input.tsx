import * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error && 'border-rose-400 focus-visible:ring-rose-500/30 focus-visible:border-rose-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
