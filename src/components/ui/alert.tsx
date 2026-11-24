import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-xl border p-4 text-sm [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  {
    variants: {
      variant: {
        default: 'bg-white text-slate-800 border-slate-200',
        info: 'bg-sky-50 text-sky-900 border-sky-200 [&>svg]:text-sky-600',
        success: 'bg-emerald-50 text-emerald-900 border-emerald-200 [&>svg]:text-emerald-600',
        warning: 'bg-amber-50 text-amber-900 border-amber-200 [&>svg]:text-amber-600',
        destructive: 'bg-rose-50 text-rose-900 border-rose-200 [&>svg]:text-rose-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', icon = true, children, ...props }, ref) => {
    const renderIcon = () => {
      if (!icon) return null;
      switch (variant) {
        case 'info':
          return <Info className="h-5 w-5" />;
        case 'success':
          return <CheckCircle2 className="h-5 w-5" />;
        case 'warning':
          return <AlertTriangle className="h-5 w-5" />;
        case 'destructive':
          return <AlertCircle className="h-5 w-5" />;
        default:
          return <Info className="h-5 w-5 text-slate-500" />;
      }
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {renderIcon()}
        {children}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-xs sm:text-sm [&_p]:leading-relaxed text-slate-600', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
