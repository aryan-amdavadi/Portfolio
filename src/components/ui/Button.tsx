import React from 'react';

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
  
  return (
    <button className={`btn ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
