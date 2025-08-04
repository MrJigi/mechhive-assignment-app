import React from 'react';
import type { SortOption } from '~/types/filters';

interface SortOptionsProps {
    value: string;
    onChange: (value: string) => void;
    options: SortOption[];
    className?: string;
}

export const SortOptions: React.FC<SortOptionsProps> = ({
                                                            value,
                                                            onChange,
                                                            options,
                                                            className = ''
                                                        }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
