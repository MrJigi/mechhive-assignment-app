// import React from 'react';
// import { Search } from 'lucide-react';
// import { Input } from '../ui/Input';
//
// interface SearchBarProps {
//     value: string;
//     onChange: (value: string) => void;
//     placeholder?: string;
//     className?: string;
// }
//
// export const SearchBar: React.FC<SearchBarProps> = ({
//                                                         value,
//                                                         onChange,
//                                                         placeholder = 'Search products...',
//                                                         className = ''
//                                                     }) => {
//     return (
//         <div className={`relative ${className}`}>
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//                 type="text"
//                 placeholder={placeholder}
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="pl-10"
//             />
//         </div>
//     );
// };