import * as React from 'react';
import { cn } from '@/utils/cn';

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}> = ({ children, className }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuTrigger must be within DropdownMenu');

  return (
    <div
      onClick={() => context.setOpen((prev) => !prev)}
      className={cn('cursor-pointer inline-flex items-center', className)}
    >
      {children}
    </div>
  );
};

export const DropdownMenuContent: React.FC<{
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  width?: string;
}> = ({ children, align = 'right', className, width = 'w-56' }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuContent must be within DropdownMenu');

  if (!context.open) return null;

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200/90 text-slate-700 animate-in fade-in-80 zoom-in-95 duration-100',
        align === 'right' ? 'right-0' : 'left-0',
        width,
        className
      )}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  destructive?: boolean;
}> = ({ children, onClick, className, destructive = false }) => {
  const context = React.useContext(DropdownContext);

  const handleClick = () => {
    if (onClick) onClick();
    context?.setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'w-full flex items-center px-2.5 py-1.5 text-xs sm:text-sm rounded-lg text-left transition-colors select-none',
        destructive
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        className
      )}
    >
      {children}
    </button>
  );
};

export const DropdownMenuSeparator: React.FC = () => (
  <div className="my-1 h-px bg-slate-100 -mx-1" />
);

export const DropdownMenuLabel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      'px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider',
      className
    )}
  >
    {children}
  </div>
);
