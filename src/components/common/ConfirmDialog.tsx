import * as React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-3">
            <AlertTriangle className="h-5 w-5" />
          </div>
        );
      case 'warning':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-3">
            <AlertTriangle className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-3">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        {getIcon()}
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'destructive' : 'default'}
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
