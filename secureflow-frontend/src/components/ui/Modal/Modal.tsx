'use client';

import { forwardRef, type ReactNode, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      size = 'md',
      className,
      showCloseButton = true,
    },
    ref
  ) => {
    const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;
    const descriptionId = `modal-description-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay
            className={cn(
              'modal-overlay animate-slide-down-fade',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
            )}
          />
          <Dialog.Content
            ref={ref}
            className={cn(
              'modal-content animate-slide-up-fade',
              sizeClasses[size],
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-4',
              className
            )}
          >
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between mb-4">
                <div>
                  {title && (
                    <Dialog.Title id={titleId} className="text-headline-sm text-text-primary">
                      {title}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description id={descriptionId} className="text-body-sm text-text-muted mt-1">
                      {description}
                    </Dialog.Description>
                  )}
                </div>
                {showCloseButton && (
                  <Dialog.Close
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors duration-fast"
                    aria-label="Close modal"
                  >
                    <XIcon className="w-4 h-4" />
                  </Dialog.Close>
                )}
              </div>
            )}
            <div className="min-w-0">{children}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

Modal.displayName = 'Modal';

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'primary';
  requireConfirmation?: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  requireConfirmation,
  onConfirm,
  isLoading = false,
}: ConfirmModalProps) {
  const [confirmationInput, setConfirmationInput] = useState('');

  const handleConfirm = async () => {
    if (requireConfirmation && confirmationInput !== requireConfirmation) return;
    await onConfirm();
    onOpenChange(false);
    setConfirmationInput('');
  };

  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        if (!open) setConfirmationInput('');
        onOpenChange(open);
      }}
      title={title}
      size="sm"
    >
      <p className="text-body-md text-text-muted mb-6">{message}</p>
      {requireConfirmation && (
        <div className="mb-4">
          <label htmlFor="confirmation-input" className="text-label-md text-text-muted mb-1.5 block">
            Type <span className="font-mono text-primary">{requireConfirmation}</span> to confirm
          </label>
          <input
            id="confirmation-input"
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            className="input-field font-mono text-code-md"
            placeholder={`Type "${requireConfirmation}"`}
            autoFocus
          />
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="btn-secondary"
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className={variant === 'destructive' ? 'btn-destructive' : 'btn-primary'}
          disabled={isLoading || Boolean(requireConfirmation && confirmationInput !== requireConfirmation)}
        >
          {isLoading ? 'Confirming...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}