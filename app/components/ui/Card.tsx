// components/ui/Card.ts
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              padding = 'md',
                                              shadow = 'sm',
                                              className = '',
                                              ...props
                                          }) => {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
    };

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
    };

    const baseClasses = `
    bg-white border border-gray-200 rounded-lg
    ${paddingClasses[padding]} ${shadowClasses[shadow]}
  `;

    return(
        <div className={`${baseClasses} ${className}`} {...props}>
    {children}
    </div>
    );
};
