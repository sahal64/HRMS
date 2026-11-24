import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
}) => {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-[11px] text-stone-400 mb-1.5 select-none font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-stone-300" />}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="hover:text-stone-800 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-stone-600 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-sans">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-xs sm:text-[13px] text-stone-500 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto pt-1 sm:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
};
