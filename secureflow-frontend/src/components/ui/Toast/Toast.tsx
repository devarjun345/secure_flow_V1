'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { XIcon, AlertCircleIcon, CheckCircleIcon, InfoIcon, AlertTriangleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastViewport() {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Toast.Viewport className="toast-container">
      {toasts.map((toast) => (
        <ToastItemComponent key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </Toast.Viewport>
  );
}

function ToastItemComponent({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const variantStyles = {
    default: 'border-border-strong',
    success: 'border-success/50 bg-success/10',
    error: 'border-critical/50 bg-critical/10',
    warning: 'border-warning/50 bg-warning/10',
    info: 'border-primary/50 bg-primary/10',
  };

  const variantIcons = {
    default: null,
    success: <CheckCircleIcon className="w-5 h-5 text-success" />,
    error: <AlertCircleIcon className="w-5 h-5 text-critical" />,
    warning: <AlertTriangleIcon className="w-5 h-5 text-warning" />,
    info: <InfoIcon className="w-5 h-5 text-primary" />,
  };

  useEffect(() => {
    if (toast.duration !== 0 && toast.duration !== Infinity) {
      const timer = setTimeout(onDismiss, toast.duration ?? 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toast.duration, onDismiss]);

  return (
    <Toast.Root
      className={cn(
        'toast flex items-start gap-3 animate-slide-up-fade',
        variantStyles[toast.variant]
      )}
    >
      {variantIcons[toast.variant] && <span className="flex-shrink-0 mt-0.5">{variantIcons[toast.variant]}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Toast.Title className="text-body-md font-medium text-text-primary">{toast.title}</Toast.Title>
          {toast.dismissible !== false && (
            <Toast.Close
              className="flex items-center justify-center w-6 h-6 rounded text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors duration-fast"
              aria-label="Dismiss"
            >
              <XIcon className="w-3 h-3" />
            </Toast.Close>
          )}
        </div>
        {toast.description && (
          <Toast.Description className="text-body-sm text-text-muted mt-1">{toast.description}</Toast.Description>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onDismiss();
            }}
            className="mt-2 text-body-sm font-medium text-primary hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
    </Toast.Root>
  );
}

export function useToastHelpers() {
  const { addToast } = useToast();

  const toast = useCallback(
    (title: string, options?: Partial<Omit<ToastItem, 'id' | 'title' | 'variant'>> & { variant?: ToastVariant }) => {
      return addToast({ title, variant: options?.variant ?? 'default', ...options });
    },
    [addToast]
  );

  const success = useCallback(
    (title: string, description?: string, options?: Partial<Omit<ToastItem, 'id' | 'title' | 'variant'>>) => {
      return addToast({ title, description, variant: 'success', ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string, options?: Partial<Omit<ToastItem, 'id' | 'title' | 'variant'>>) => {
      return addToast({ title, description, variant: 'error', ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string, options?: Partial<Omit<ToastItem, 'id' | 'title' | 'variant'>>) => {
      return addToast({ title, description, variant: 'warning', ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string, options?: Partial<Omit<ToastItem, 'id' | 'title' | 'variant'>>) => {
      return addToast({ title, description, variant: 'info', ...options });
    },
    [addToast]
  );

  return { toast, success, error, warning, info };
}