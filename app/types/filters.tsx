// app/types/filters.ts
export interface FilterState {
    search: string;
    categories: string;
    priceRange: [number, number];
    brand: string;
    sortBy: string;
    inStock: boolean;
    currency?: string[];
    region?: string[];
    // currencies?: string[];
    regions?: string[];
    minPrice?: number;
    maxPrice?: number;
    // page?: number;
}

export interface SortOption {
    value: string;
    label: string;
}

export interface SortOption {
    label: string;
    value: string;
}

// Helper function to ensure brand filter is always an array for server queries
export function normalizeBrandFilter(brand: string[] | string | undefined): string[] {
    if (!brand) return [];
    if (typeof brand === 'string') {
        return brand === 'All' ? [] : [brand];
    }
    return brand;
}

// Helper function to ensure currency filter is always an array
export function normalizeCurrencyFilter(currency: string[] | undefined): string[] {
    return currency || [];
}

// Helper function to ensure region filter is always an array
export function normalizeRegionFilter(region: string[] | undefined): string[] {
    return region || [];
}