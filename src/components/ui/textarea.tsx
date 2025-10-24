import * as React from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    outline-none transition-all resize-none bg-white text-gray-800
                    placeholder:text-gray-400 ${className || ''}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
