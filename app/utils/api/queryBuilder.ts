// utils/api/queryBuilder.ts - FIXED VERSION
import type { FilterState } from "~/types/filters";

export class QueryBuilder {
    private params: URLSearchParams;

    constructor() {
        this.params = new URLSearchParams();
    }

    static fromFilters(filters: FilterState): QueryBuilder {
        const builder = new QueryBuilder();
        const MAXPrice = 1000;

        console.log('🔧 QueryBuilder input filters:', filters);

        // Search parameter - use 'search' as main parameter
        if (filters.search && filters.search.trim()) {
            const searchTerm = filters.search.trim();
            console.log('🔍 Adding search parameter:', searchTerm);
            builder.addParam('search', searchTerm);
        }

        // Category filter
        if (filters.category && filters.category !== 'All') {
            console.log('📂 Adding category parameter:', filters.category);
            builder.addParam('category', filters.category.toLowerCase());
        }

        // Brand filter - FIXED: Better brand mapping
        if (filters.brand && filters.brand !== 'All') {
            console.log('🏷️ Original brand name:', filters.brand);

            // More comprehensive brand slug mapping
            const brandSlugMap: { [key: string]: string } = {
                // Common display names to API slugs
                'Disney Plus': 'disney',
                'Disney': 'disney',
                'Apple iTunes': 'apple',
                'Apple': 'apple',
                'Revolut': 'revolut',
                'Xbox': 'xbox',
                'XBOX': 'xbox',
                'Microsoft': 'xbox',
                'Playstation': 'playstation',
                'PlayStation': 'playstation',
                'Sony': 'playstation',
                'Nintendo': 'nintendo',
                'AliExpress': 'aliexpress',
                'OnlyFans': 'onlyfans',
                'PayPal': 'paypal',
                'Steam': 'steam',
                'Google': 'google',
                'Google Play': 'google',
                'Amazon': 'amazon',
                'Netflix': 'netflix',
                'Spotify': 'spotify'
            };

            // Try exact match first, then fallback to slug conversion
            const brandSlug = brandSlugMap[filters.brand] ||
                filters.brand.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');

            console.log('🏷️ Converted to brand slug:', brandSlug);
            builder.addParam('brand', brandSlug);
        }

        // Stock filter - FIXED: Use 'isStocked' parameter
        if (filters.inStock) {
            console.log('✅ Adding isStocked parameter: true');
            builder.addParam('isStocked', 'true');
        }

        // Price range - FIXED: Use proper parameter names
        if (filters.priceRange && filters.priceRange.length === 2) {
            const [min, max] = filters.priceRange;
            if (min > 0) {
                console.log('💰 Adding priceMin:', min);
                builder.addParam('priceMin', min.toString());
            }
            if (max < MAXPrice) {
                console.log('💰 Adding priceMax:', max);
                builder.addParam('priceMax', max.toString());
            }
        }

        // Currency filter - FIXED: Use proper format
        if (filters.currency && filters.currency.length > 0) {
            // Convert to lowercase and join with commas
            const currencies = filters.currency.map(c => c.toLowerCase());
            console.log('💱 Adding currencies:', currencies);
            builder.addParam('currency', currencies.join(','));
        }

        // Region filter - FIXED: Better region mapping
        if (filters.region && filters.region.length > 0) {
            console.log('🌍 Adding regions:', filters.region);

            // Map display names to API region codes
            const regionMap: { [key: string]: string } = {
                'United States': 'us',
                'US': 'us',
                'USA': 'us',
                'Netherlands': 'nl',
                'The Netherlands': 'nl',
                'NL': 'nl',
                'Germany': 'de',
                'DE': 'de',
                'Belgium': 'be',
                'BE': 'be',
                'United Kingdom': 'gb',
                'UK': 'gb',
                'GB': 'gb',
                'Europe': 'eu',
                'EU': 'eu',
                'Worldwide': 'ww',
                'WW': 'ww',
                'Global': 'ww'
            };

            const regions = filters.region.map(r =>
                regionMap[r] || r.toLowerCase()
            );
            console.log('🌍 Converted to region codes:', regions);
            builder.addParam('region', regions.join(','));
        }

        // Sorting - FIXED: Use proper sort parameters
        if (filters.sortBy && filters.sortBy !== 'featured') {
            console.log('📊 Adding sort parameter:', filters.sortBy);
            switch (filters.sortBy) {
                case 'price-low':
                    builder.addParam('sortBy', 'price');
                    builder.addParam('sortOrder', 'asc');
                    break;
                case 'price-high':
                    builder.addParam('sortBy', 'price');
                    builder.addParam('sortOrder', 'desc');
                    break;
                case 'name':
                    builder.addParam('sortBy', 'name');
                    builder.addParam('sortOrder', 'asc');
                    break;
                default:
                    builder.addParam('sortBy', filters.sortBy);
            }
        }

        const finalQuery = builder.build();
        console.log('🔧 Final query string:', finalQuery);
        return builder;
    }

    addParam(key: string, value: string): QueryBuilder {
        if (value && value.trim()) {
            this.params.set(key, value);
        }
        return this;
    }

    addPagination(page: number, limit: number): QueryBuilder {
        if (page > 1) {
            this.params.set('page', page.toString());
        }
        if (limit && limit !== 12) {
            this.params.set('limit', limit.toString());
        }
        return this;
    }

    build(): string {
        return this.params.toString();
    }

    getParams(): URLSearchParams {
        return this.params;
    }
}