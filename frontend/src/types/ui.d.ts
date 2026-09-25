
import { ReactNode } from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any additional HTML attributes you need
    className?: string;
    children?: ReactNode;
  }
}

// Common props for UI components
export interface CommonProps {
  className?: string;
  children?: ReactNode;
  [key: string]: any; // For any additional props
}

// Specific component props
export interface AlertProps extends CommonProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
}

export interface ButtonProps extends CommonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface CardProps extends CommonProps {
  variant?: 'default' | 'outline';
}

// Add more component props as needed