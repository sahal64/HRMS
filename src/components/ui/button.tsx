import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/40 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.985]',
  {
    variants: {
      variant: {
        default:
          'bg-[#1e1c1a] text-white hover:bg-[#2c2926] active:bg-[#121110] shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.12)] border border-black/15 font-medium tracking-tight',
        accent:
          'bg-[#d9533f] text-white hover:bg-[#c74431] active:bg-[#ad3726] shadow-[0_1px_2px_rgba(0,0,0,0.08)]',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-2xs',
        outline:
          'border border-[#e2dfd5] bg-white text-stone-800 hover:bg-[#faf9f6] hover:border-stone-400/80 hover:text-stone-950 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
        secondary:
          'bg-[#f0ede6] text-stone-800 hover:bg-[#e6e3da]',
        ghost:
          'text-stone-600 hover:bg-[#eeebe3] hover:text-stone-900',
        link:
          'text-stone-900 underline-offset-4 hover:underline p-0 h-auto font-normal',
        success:
          'bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs',
      },
      size: {
        default: 'h-8 sm:h-8.5 px-3 sm:px-3.5 py-1.5',
        sm: 'h-7 sm:h-7.5 rounded-md px-2.5 text-xs',
        lg: 'h-9.5 rounded-lg px-4 text-sm',
        icon: 'h-8 w-8 p-0',
        'icon-sm': 'h-7 w-7 p-0 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
