import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4" />}
        rightIcon={
          value ? (
            <button
              onClick={() => onChange('')}
              className="hover:text-slate-600 transition-colors"
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : undefined
        }
        className={className}
      />
    </div>
  );
};
