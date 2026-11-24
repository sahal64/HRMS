import * as React from 'react';
import { cn } from '@/utils/cn';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg font-bold',
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-medium text-slate-700 ring-1 ring-slate-200/80 select-none',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || fallback}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-semibold uppercase tracking-wider text-slate-600">
          {fallback.slice(0, 2)}
        </span>
      )}
    </div>
  );
};

export { Avatar };
