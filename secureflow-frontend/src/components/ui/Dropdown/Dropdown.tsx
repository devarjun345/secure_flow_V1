'use client';

import { forwardRef, type ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  label: ReactNode;
  value: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
  subItems?: DropdownItem[];
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
  onItemSelect?: (value: string) => void;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, trigger, items, align = 'start', side = 'bottom', sideOffset = 4, onItemSelect, ...props }, ref) => {
    const renderItems = (items: DropdownItem[], depth = 0) => (
      <>
        {items.map((item, _index) => (
          <DropdownMenu.Item
            key={item.value}
            disabled={item.disabled}
            onSelect={item.onSelect}
            className={cn(
              'dropdown-item flex items-center gap-2 relative',
              item.destructive && 'text-critical',
              depth > 0 && 'pl-8'
            )}
            textValue={item.value}
          >
            {item.icon && <span className="flex-shrink-0 w-4 h-4">{item.icon}</span>}
            <span className="flex-1 truncate">{item.label}</span>
            {item.shortcut && (
              <span className="text-body-sm text-text-muted ml-auto font-mono">{item.shortcut}</span>
            )}
            {item.subItems && (
              <ChevronRightIcon className="w-4 h-4 text-text-muted ml-auto flex-shrink-0" />
            )}
          </DropdownMenu.Item>
        ))}
      </>
    );

    return (
      <DropdownMenu.Root {...props}>
        <DropdownMenu.Trigger asChild>
          <span ref={ref} className={cn('inline-block', className)}>
            {trigger}
          </span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="dropdown-content"
            side={side}
            align={align}
            sideOffset={sideOffset}
          >
            {renderItems(items)}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export interface DropdownMenuButtonProps extends DropdownMenu.DropdownMenuTriggerProps {
  children: ReactNode;
  className?: string;
}

export const DropdownMenuButton = forwardRef<HTMLButtonElement, DropdownMenuButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <DropdownMenu.Trigger
        ref={ref}
        asChild
        {...props}
      >
        <button
          className={cn(
            'btn-secondary flex items-center gap-1.5',
            className
          )}
        >
          {children}
          <ChevronRightIcon className="w-3 h-3" />
        </button>
      </DropdownMenu.Trigger>
    );
  }
);

DropdownMenuButton.displayName = 'DropdownMenuButton';

export interface DropdownMenuCheckboxItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
}

export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ className, checked, onCheckedChange, label, disabled, ...props }, ref) => {
    return (
      <DropdownMenu.CheckboxItem
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'dropdown-item flex items-center gap-2',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...props}
      >
        <DropdownMenu.ItemIndicator className="flex items-center justify-center">
          <CheckIcon className="w-3 h-3" strokeWidth={3} />
        </DropdownMenu.ItemIndicator>
        {label}
      </DropdownMenu.CheckboxItem>
    );
  }
);

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export interface DropdownMenuRadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: ReactNode; disabled?: boolean }[];
  className?: string;
}

export const DropdownMenuRadioGroup = ({ value, onValueChange, items, className }: DropdownMenuRadioGroupProps) => {
  return (
    <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange} className={className}>
      {items.map((item) => (
        <DropdownMenu.RadioItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className="dropdown-item flex items-center gap-2"
        >
          <DropdownMenu.ItemIndicator className="flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </DropdownMenu.ItemIndicator>
          {item.label}
        </DropdownMenu.RadioItem>
      ))}
    </DropdownMenu.RadioGroup>
  );
};

export const DropdownSeparator = () => (
  <DropdownMenu.Separator className="separator my-1" />
);