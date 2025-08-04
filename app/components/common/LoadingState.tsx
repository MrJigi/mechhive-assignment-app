import React from 'react';

interface LoadingStateProps {
    text?: string;
    className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
                                                              text = 'Loading...',
                                                              className = ''
                                                          }) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">{text}</p>
        </div>
    );
};
