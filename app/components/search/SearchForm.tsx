// // // Search input and filter
// //
// // import { useState} from "react";
// //
// // type Props = {
// //     onSearch: (query: string) => void;
// // };
// //
// // export default function SearchForm({ onSearch} : Props){
// //     const [query, setQuery] = useState("");
// //
// //     return (
// //         <form
// //         onSubmit={(e) => {
// //         e.preventDefault();
// //         onSearch(query);
// //         }}
// //         className="mb-4"
// //         >
// //             <input
// //             value={query}
// //             onChange={(e) => setQuery(e.target.value)}
// //             placeholder="Search resources..."
// //             className="p-2 border rounded mr-2"
// //             />
// //             <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
// //                 Search
// //             </button>
// //         </form>
// //     );
// // }
//
//
// // components/search/SearchForm.tsx
// import React, { useState } from 'react';
// import { Form } from 'react-router';
// import { SearchBar } from './SearchBar';
// import { SortOptions } from './SortOptions';
// import { Button } from '../ui/Button';
// import { Filter } from 'lucide-react';
// import type { FilterState } from '~/types/filters';
//
// interface SearchFormProps {
//     initialFilters: FilterState;
//     sortOptions: Array<{ value: string; label: string }>;
//     onToggleFilters: () => void;
//     showMobileFilters: boolean;
// }
//
// export const SearchForm: React.FC<SearchFormProps> = ({
//                                                           initialFilters,
//                                                           sortOptions,
//                                                           onToggleFilters,
//                                                           showMobileFilters
//                                                       }) => {
//     const [searchValue, setSearchValue] = useState(initialFilters.search);
//
//     return (
//         <Form method="get" className="space-y-4">
//             <div className="flex items-center gap-4">
//                 {/* Search Bar */}
//                 <div className="flex-1">
//                     <SearchBar
//                         value={searchValue}
//                         onChange={setSearchValue}
//                         name="search"
//                     />
//                 </div>
//
//                 {/* Mobile Filter Toggle */}
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={onToggleFilters}
//                     className="lg:hidden flex items-center gap-2"
//                 >
//                     <Filter className="w-5 h-5" />
//                     Filters
//                 </Button>
//
//                 {/* Desktop Sort */}
//                 <div className="hidden text-gray-900 lg:block">
//                     <SortOptions
//                         value={initialFilters.sortBy}
//                         onChange={() => {}} // Handled by form submission
//                         options={sortOptions}
//                         name="sortBy"
//                     />
//                 </div>
//             </div>
//
//             {/* Hidden inputs to maintain other filter state */}
//             <input type="hidden" name="category" value={initialFilters.category} />
//             <input type="hidden" name="brand" value={initialFilters.brand} />
//             <input type="hidden" name="inStock" value={initialFilters.inStock.toString()} />
//             <input type="hidden" name="minPrice" value={initialFilters.priceRange[0].toString()} />
//             <input type="hidden" name="maxPrice" value={initialFilters.priceRange[1].toString()} />
//         </Form>
//     );
// };
// export default SearchForm;