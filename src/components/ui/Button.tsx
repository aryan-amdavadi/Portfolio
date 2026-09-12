import React from 'react';
import { useCursorHandlers } from '@/hooks/useCursorState';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-outline';
  
  const linkCursor = useCursorHandlers('link');
  
  return (
    <button 
      className={`btn ${variantClass} ${className}`} 
      {...linkCursor}
      {...props}
    >
      {children}
    </button>
  );
};
