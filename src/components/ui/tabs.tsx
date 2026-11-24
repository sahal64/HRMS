import * as React from 'react';
import { cn } from '@/utils/cn';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}) => {
  const [internalTab, setInternalTab] = React.useState(defaultValue);
  const activeTab = value !== undefined ? value : internalTab;

  const setActiveTab = React.useCallback(
    (newVal: string) => {
      setInternalTab(newVal);
      onValueChange?.(newVal);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-start rounded-lg bg-slate-100 p-1 text-slate-500 border border-slate-200/60',
        className
      )}
      {...props}
    />
  );
};

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 select-none',
        isActive
          ? 'bg-white text-slate-900 shadow-sm font-semibold'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
        className
      )}
      onClick={() => context.setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.activeTab !== value) return null;

  return (
    <div
      className={cn(
        'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 animate-in fade-in-50 duration-150',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
