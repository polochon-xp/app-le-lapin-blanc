import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = ({ checked, onCheckedChange, className = '', style = {} }) => {
  return (
    <div
      className={`w-5 h-5 rounded border-2 cursor-pointer transition-all flex items-center justify-center ${className}`}
      style={{
        backgroundColor: checked ? style.borderColor || '#ff6b35' : 'transparent',
        borderColor: style.borderColor || '#ff6b35',
        ...style
      }}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
    >
      {checked && (
        <Check 
          className="w-3 h-3 text-black" 
          strokeWidth={3}
        />
      )}
    </div>
  );
};

export { Checkbox };