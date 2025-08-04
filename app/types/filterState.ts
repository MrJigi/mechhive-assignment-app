// types/filterState.ts
import type { Product } from './product';

export interface FilterState {
    search: string;
    category: string;
    brand: string[];
    sortBy: string;
    inStock: boolean;
    priceRange: [number, number];
    currency: string[];
    region: string[];
}

export interface FilterContextType {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    filteredProducts: Product[];
    isLoading: boolean;
}