import { useCallback } from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export const useToast = () => {
  const toast = useCallback(({ title, description, variant = 'default' }: ToastOptions) => {
    // In a real implementation, you might want to use a toast library here
    // For now, we'll just log to console
    console.log(`[Toast] ${title}${description ? `: ${description}` : ''}`, { variant });
    
    // If you want to show actual toasts, you can integrate with a toast library here
    // For example, with react-hot-toast:
    // if (variant === 'destructive') {
    //   toast.error(description || title);
    // } else {
    //   toast.success(description || title);
    // }
  }, []);

  return { toast };
};

export default useToast;
