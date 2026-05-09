import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      <label className="mb-1.5 text-sm font-semibold text-text-primary">
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 bg-surface rounded-lg border-2 transition-all duration-200 outline-none
          ${error 
            ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/15' 
            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/15'
          } ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1.5 text-sm text-danger">{error}</span>
      )}
    </div>
  );
};

export default Input;
