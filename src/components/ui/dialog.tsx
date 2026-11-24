import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog container */}
      <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transition-all duration-200 animate-in zoom-in-95 border border-slate-200">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-left mb-5', className)}
    {...props}
  />
);

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    className={cn('text-lg font-semibold leading-none tracking-tight text-slate-900', className)}
    {...props}
  />
);

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p className={cn('text-sm text-slate-500 mt-1', className)} {...props} />
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 pt-4 border-t border-slate-100', className)}
    {...props}
  />
);

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
