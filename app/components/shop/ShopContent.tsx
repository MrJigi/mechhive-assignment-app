// // components/shop/ShopContent.tsx
// import React from 'react';
// import { useFilters } from '~/components/search/FilterProvider';
// import { Header } from '~/components/layout/Header';
// import { FilterSidebar } from '~/components/search/FilterSidebar';
// import { SearchResult } from '~/components/search/SearchResult';
//
// export const ShopContent: React.FC = () => {
//     const { filters, setFilters, filteredProducts, isLoading } = useFilters();
//
//     const handleSearch = (query: string) => {
//         setFilters({ ...filters, search: query });
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Header
//                 onSearch={handleSearch}
//                 searchValue={filters.search}
//                 cartItemCount={0}
//                 currentCurrency="EUR"
//                 currentLanguage="English"
//             />
//
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="lg:grid lg:grid-cols-4 lg:gap-8">
//                     <div className="hidden lg:block">
//                         <FilterSidebar
//                             filters={filters}
//                             onFiltersChange={setFilters}
//                         />
//                     </div>
//
//                     <div className="lg:col-span-3">
//                         <SearchResult
//                             products={filteredProducts}
//                             isLoading={isLoading}
//                             total={filteredProducts.length}
//                             onClearFilters={() => setFilters({
//                                 search: '',
//                                 category: 'All',
//                                 brand: 'All',
//                                 sortBy: 'featured',
//                                 inStock: false,
//                                 priceRange: [0, 1000],
//                                 currency: [],
//                                 region: []
//                             })}
//                         />
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };