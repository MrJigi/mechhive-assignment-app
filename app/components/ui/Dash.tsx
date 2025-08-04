// components/ui/Button.ts
import React from 'react';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
}

export const Dash: React.FC<ButtonProps> = ({

                                              }) => {
    return (
    <div className="border-t-2 border-gray-300 mb-4"></div>
    )
}

