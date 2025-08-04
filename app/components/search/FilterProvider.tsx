// // components/search/FilterProvider.tsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import type { FilterState, FilterContextType } from '~/types/filterState';
// import type { Product } from '~/types/product';
// import { getProducts } from '~/utils/api/products.server';
//
// const FilterContext = createContext<FilterContextType | undefined>(undefined);
//
// export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [filters, setFilters] = useState<FilterState>({
//         search: '',
//         category: 'All',
//         brand: 'All',
//         sortBy: 'featured',
//         inStock: false,
//         priceRange: [0, 500000],
//         currency: [],
//         region: []
//     });
//
//     const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//
//     useEffect(() => {
//         const fetchProducts = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await getProducts(filters);
//                 setFilteredProducts(response.products);
//             } catch (error) {
//                 console.error('Error filtering products:', error);
//                 setFilteredProducts([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//
//         const timer = setTimeout(() => {
//             fetchProducts();
//         }, 300); // Debounce the API calls
//
//         return () => clearTimeout(timer);
//     }, [filters]);
//
//     return (
//         <FilterContext.Provider value={{ filters, setFilters, filteredProducts, isLoading }}>
//             {children}
//         </FilterContext.Provider>
//     );
// };
//
// export const useFilters = () => {
//     const context = useContext(FilterContext);
//     if (!context) {
//         throw new Error('useFilters must be used within a FilterProvider');
//     }
//     return context;
// };