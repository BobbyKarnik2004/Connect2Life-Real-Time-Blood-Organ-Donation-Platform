import React from 'react';
import { Heart } from 'lucide-react';

export default function LoadingSpinner({ message = "Loading...", size = 'md' }) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };
  
  const iconSize = typeof size === 'string' ? sizeMap[size] || 24 : size;
  return (
    <div className="loading-spinner">
      <div className="relative">
        <div className="spinner"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart size={iconSize} className="text-primary-blue animate-pulse" />
        </div>
      </div>
      <p className="text-lg font-medium text-neutral-600 mt-4">{message}</p>
      <p className="text-sm text-neutral-500">Connecting lives, saving futures...</p>
    </div>
  );
}