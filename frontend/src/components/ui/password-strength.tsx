import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const strengthMeter = cva('h-1.5 rounded-full transition-all duration-300', {
  variants: {
    strength: {
      0: 'bg-red-500 w-1/5',
      1: 'bg-red-500 w-1/4',
      2: 'bg-yellow-500 w-1/2',
      3: 'bg-blue-500 w-3/4',
      4: 'bg-green-500 w-full',
    },
  },
  defaultVariants: {
    strength: 0,
  },
});

const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  
  // Contains both lower and uppercase letters
  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;
  
  // Contains numbers
  if (password.match(/([0-9])/)) strength += 1;
  
  // Contains special characters
  if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;
  
  return Math.min(strength, 4); // Cap at 4 for our strength meter
};

const strengthText = [
  'Very Weak',
  'Weak',
  'Moderate',
  'Strong',
  'Very Strong'
];

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className,
}) => {
  const strength = getPasswordStrength(password);
  
  return (
    <div className={cn('w-full space-y-1', className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Password Strength:</span>
        <span className={cn(
          'font-medium',
          strength < 2 ? 'text-red-500' :
          strength < 3 ? 'text-yellow-500' :
          strength < 4 ? 'text-blue-500' : 'text-green-500'
        )}>
          {strengthText[strength]}
        </span>
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={cn(
              'h-1.5 flex-1 rounded-full bg-muted',
              i <= strength && (
                strength < 2 ? 'bg-red-500' :
                strength < 3 ? 'bg-yellow-500' :
                strength < 4 ? 'bg-blue-500' : 'bg-green-500'
              )
            )}
          />
        ))}
      </div>
    </div>
  );
};
