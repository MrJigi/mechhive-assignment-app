// utils/api/products.server.ts - FIXED PARAMETERS
import type { Product, ApiProduct } from '~/types/product';
import type { FilterState } from '~/types/filters';
import type { ProductsResponse } from '~/types/api';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

interface ApiResponse {
    products?: ApiProduct[];
    meta?: {
        pagination?: {
            totalItems?: number;
            currentPage?: number;
            totalPages?: number;
        };
    };
    filters?: {
        brands?: string[];
        categories?: string[];
    };
    data?: ApiProduct;
}

// Store the API response globally so we can reuse the filters data
let cachedApiResponse: ApiResponse | null = null;

// Transform API product to our internal format
function transformApiProduct(apiProduct: ApiProduct, index: number): Product {
    return {
        id: apiProduct.slug || `product-${index}`,
        name: apiProduct.name,
        brand: apiProduct.brand,
        description: apiProduct.description,
        slug: apiProduct.slug,
        priceCurrency: apiProduct.priceCurrency,
        priceAmount: apiProduct.priceAmount,
        priceAmountMin: apiProduct.priceAmountMin,
        priceAmountMax: apiProduct.priceAmountMax,
        category: apiProduct.category,
        isStocked: apiProduct.isStocked,
        region: apiProduct.region,
        image: apiProduct.image,
        price: apiProduct.priceAmount || apiProduct.priceAmountMin || 0,
        inStock: apiProduct.isStocked,
        originalPrice: undefined,
    };
}

// FIXED: Build query parameters for API with correct parameter names
function buildQueryParams(filters: Partial<FilterState>, page: number, limit: number): Record<string, string> {
    const params: Record<string, string> = {};

    console.log('🔧 Building query params:', { filters, page, limit });

    // Pagination
    if (page > 1) params.page = page.toString();

    // Search - The API accepts 'search' parameter
    if (filters.search?.trim()) {
        params.search = filters.search.trim();
        console.log('🔍 Search:', params.search);
    }


    if (filters.brand && filters.brand !== 'All') {
        // Map display names to API brand slugs
        const brandSlugMap: { [key: string]: string } = {
            'Disney Plus': 'disney',
            'Disney': 'disney',
            'Apple iTunes': 'apple',
            'Apple': 'apple',
            'Revolut': 'revolut',
            'Xbox': 'xbox',
            'XBOX': 'xbox',
            'Playstation': 'playstation',
            'PlayStation': 'playstation',
            'Nintendo': 'nintendo',
            'AliExpress': 'aliexpress',
            'OnlyFans': 'onlyfans',
            'PayPal': 'paypal'
        };

        const brandSlug = brandSlugMap[filters.brand] ||
            filters.brand.toLowerCase().replace(/\s+/g, '-');

        params.brands = brandSlug; // Use 'brands' not 'brand'
        console.log('🏷️ Brand filter:', { display: filters.brand, slug: brandSlug });
    }

    // CRITICAL FIX: Use 'currencies' (plural) instead of 'currency'
    if (filters.currency && filters.currency.length > 0) {
        params.currencies = filters.currency.map(c => c.toLowerCase()).join(',');
        console.log('💱 Currency filter:', params.currencies);
    }

    // CRITICAL FIX: Use 'regions' (plural) instead of 'region'
    if (filters.region && filters.region.length > 0) {
        // Map display names to API region codes
        const regionMap: { [key: string]: string } = {
            'The Netherlands': 'nl',
            'Netherlands': 'nl',
            'Germany': 'de',
            'Belgium': 'be',
            'United States': 'us',
            'United Kingdom': 'gb',
            'Europe': 'eu',
            'Worldwide': 'ww'
        };

        const regions = filters.region.map(r =>
            regionMap[r] || r.toLowerCase()
        );
        params.regions = regions.join(',');
        console.log('🌍 Region filter:', params.regions);
    }

    // Price range
    if (filters.priceRange?.length === 2) {
        const [min, max] = filters.priceRange;
        if (min > 0) params.minPrice = min.toString();
        if (max < 5000) params.maxPrice = max.toString();
        console.log('💰 Price range:', { min, max });
    }

    // Stock filter
    if (filters.inStock) {
        params.inStock = 'true';
        console.log('📦 Stock filter: true');
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
        params.categories = filters.category.toLowerCase();
        console.log('📂 Category filter:', params.category);
    }

    console.log('🔧 Final query params:', params);
    return params;
}

export async function getProducts(
    filters: Partial<FilterState> = {},
    page = 1,
    limit = 12
): Promise<ProductsResponse> {
    if (!apiClient.isReady()) {
        console.warn('⚠️ API not configured, using mock data.');
        return getMockProducts(filters, page, limit);
    }

    if (!API_ENDPOINTS?.PRODUCTS) {
        console.error('❌ API_ENDPOINTS.PRODUCTS is undefined!');
        return getMockProducts(filters, page, limit);
    }

    try {
        const queryParams = buildQueryParams(filters, page, limit);

        console.log('🔍 Making API request:', {
            endpoint: API_ENDPOINTS.PRODUCTS,
            params: queryParams,
            filters: JSON.stringify(filters),
            page,
            limit
        });

        // Use the apiClient.get method with params object
        const response = await apiClient.get<ApiResponse>(API_ENDPOINTS.PRODUCTS, queryParams);

        if (!response) {
            throw new Error('API returned null/undefined response');
        }

        cachedApiResponse = response;

        // Extract products
        const apiProducts = Array.isArray(response.products) ? response.products : [];

        console.log('📦 API returned:', {
            productsCount: apiProducts.length,
            totalItems: response.meta?.pagination?.totalItems,
            currentPage: response.meta?.pagination?.currentPage,
            hasFilters: Object.keys(queryParams).length > 0
        });

        if (!Array.isArray(apiProducts)) {
            console.warn('⚠️ API products is not an array:', typeof apiProducts);
            return getMockProducts(filters, page, limit);
        }

        const products = apiProducts.map((product, index) => {
            try {
                return transformApiProduct(product, index);
            } catch (transformError) {
                console.error('❌ Failed to transform product:', product, transformError);
                return null;
            }
        }).filter(Boolean) as Product[];

        const meta = response.meta?.pagination || {};

        return {
            products,
            total: meta.totalItems ?? products.length,
            page: meta.currentPage ?? page,
            totalPages: meta.totalPages ?? Math.ceil((meta.totalItems ?? products.length) / limit),
            categories: response.filters?.categories ?? [],
            brands: response.filters?.brands ?? [],
        };
    } catch (error) {
        console.error('❌ API request failed:', error);
        return getMockProducts(filters, page, limit);
    }
}

export async function getCategories(): Promise<string[]> {
    if (!apiClient.isReady()) return ['All', 'topup', 'card'];

    try {
        // Make a basic API call to get categories from the filters
        if (!cachedApiResponse) {
            const response = await apiClient.get<ApiResponse>(API_ENDPOINTS.PRODUCTS);
            cachedApiResponse = response;
        }

        if (cachedApiResponse?.filters?.categories) {
            const categories = cachedApiResponse.filters.categories.map(cat =>
                cat.charAt(0).toUpperCase() + cat.slice(1)
            );
            return ['All', ...categories];
        }

        // Fallback to extracting from products
        if (cachedApiResponse?.products) {
            const categories = Array.from(
                new Set(cachedApiResponse.products.map(p => p.category))
            ).filter(Boolean).map(cat =>
                cat.charAt(0).toUpperCase() + cat.slice(1)
            );
            return ['All', ...categories];
        }

        return ['All'];
    } catch (error) {
        console.error('Error getting categories:', error);
        return ['All'];
    }
}

export async function getBrands(): Promise<string[]> {
    if (!apiClient.isReady()) return ['All'];

    try {
        // Make a basic API call to get brands from the filters
        if (!cachedApiResponse) {
            const response = await apiClient.get<ApiResponse>(API_ENDPOINTS.PRODUCTS);
            cachedApiResponse = response;
        }

        if (cachedApiResponse?.filters?.brands) {
            const brandNames = cachedApiResponse.filters.brands.map(slug =>
                slug
                    .split('-')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')
            );
            return ['All', ...brandNames];
        }

        // Fallback to extracting from products
        if (cachedApiResponse?.products) {
            const brands = Array.from(
                new Set(cachedApiResponse.products.map(p => p.brand?.name || 'Unknown'))
            ).filter(Boolean);
            return ['All', ...brands];
        }

        return ['All'];
    } catch (error) {
        console.error('Error getting brands:', error);
        return ['All'];
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    if (!apiClient.isReady()) {
        return null;
    }

    try {
        const response = await apiClient.get<{ data?: ApiProduct } & ApiProduct>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
        const apiProduct = response.data ?? response as unknown as ApiProduct;
        return apiProduct ? transformApiProduct(apiProduct, 0) : null;
    } catch (error) {
        console.error('❌ Error fetching product by ID:', error);
        return null;
    }
}

// Mock data fallback
const mockApiProducts: ApiProduct[] = [
    {
        name: "Disney 50 USD US",
        brand: { slug: "disney", name: "Disney Plus" },
        description: "Disney gift card",
        slug: "disney-us-usd-50",
        priceCurrency: "usd",
        priceAmount: 50,
        category: "topup",
        isStocked: true,
        region: "us",
        image: "https://cdn.rewarble.com/i/storebrandlandscape/disney.png"
    }
];

function getMockProducts(
    filters?: Partial<FilterState>,
    page = 1,
    limit = 12
): ProductsResponse {
    console.log('🎭 Using mock data for products');
    const products = mockApiProducts.map(transformApiProduct);
    return {
        products,
        total: products.length,
        page: 1,
        totalPages: 1,
        categories: ['All', 'topup', 'card'],
        brands: ['All', 'Disney', 'Apple', 'Xbox'],
    };
}