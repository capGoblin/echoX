'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Allow empty string, numbers, and decimals
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        onChange?.(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevent up/down arrow keys
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
    };

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full text-right text-xl bg-transparent outline-none",
          "placeholder:text-muted-foreground/50",
          "focus:outline-none focus:ring-0 focus:ring-offset-0",
          "selection:bg-blue-500/20",
          className
        )}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';