//Card UI for single result
// app/components/ResourceCard.tsx
import React from "react";

export type Resource = {
    href: string;
    text: string;
    icon?: React.ReactNode;
};

interface ResourceCardProps {
    resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    return (
        <a
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 border rounded-2xl shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
            <div className="flex-shrink-0">{resource.icon}</div>
            <div className="text-lg font-medium text-gray-800 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
                {resource.text}
            </div>
        </a>
    );
};

export default ResourceCard;