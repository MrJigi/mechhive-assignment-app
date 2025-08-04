// routes/shop.tsx - Fixed Version
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { json } from '~/utils/api/json';
import { useLoaderData, useSearchParams, useNavigation } from 'react-router';
import React, { useState, useCallback } from 'react';
import {Filter, X, Search, LayoutGrid, List} from 'lucide-react';
import { useSubmit } from 'react-router'
import { getProducts, getCategories, getBrands } from '~/utils/api/products.server';
import { ProductCard } from '~/components/product/ProductCard';
import { FilterSidebar } from '~/components/search/FilterSidebar';
import { SortOptions } from '~/components/search/SortOptions';
// import { SortOptions } from '~/types/filters';
import { LoadingState } from '~/components/common/LoadingState';
import { Pagination } from '~/components/common/Pagination';
import { Button } from '~/components/ui/Button';
import type {FilterState, SortOption} from '~/types/filters';
import type { Product } from '~/types/product';
import { Header } from "~/components/layout/Header";

export const meta: MetaFunction = () => {
    return [
        { title: "Shop | Your Store" },
        { name: "description", content: "Browse our collection of digital products and gift cards" },
    ];
};



export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    console.log('🔄 Loader URL params:', Object.fromEntries(searchParams));

    // Extract filters from URL parameters
    const filters: Partial<FilterState> = {
        // FIX: Handle both 'search' and 'q' parameters
        search: searchParams.get('search') || searchParams.get('q') || '',
        category: searchParams.get('category') || 'All',
        brand: searchParams.get('brand') || 'All',
        sortBy: searchParams.get('sortBy') || searchParams.get('sort') || 'featured',
        inStock: searchParams.get('inStock') === 'true',
        priceRange: [
            Number(searchParams.get('minPrice')) || 0,
            Number(searchParams.get('maxPrice')) || 100
        ],
        currency: searchParams.get('currency')?.split(',').filter(Boolean) || [],
        region: searchParams.get('region')?.split(',').filter(Boolean) || []
    };

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;

    console.log('🔄 Loader filters:', filters);
    console.log('🔍 Search term from loader:', filters.search);

    try {
        const productsResponse = await getProducts(filters, page, limit);
        const [categories, brands] = await Promise.all([
            getCategories(),
            getBrands()
        ]);

        console.log('📊 Loader results:', {
            productsCount: productsResponse.products.length,
            totalProducts: productsResponse.total,
            searchTerm: filters.search
        });

        return json({
            products: productsResponse.products,
            total: productsResponse.total,
            page: productsResponse.page,
            totalPages: productsResponse.totalPages,
            categories,
            brands,
            filters
        });
    } catch (error) {
        console.error('❌ Loader error:', error);
        return json({
            products: [],
            total: 0,
            page: 1,
            totalPages: 1,
            categories: ['All'],
            brands: ['All'],
            filters
        });
    }
};

const sortOptions: SortOption[] = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A-Z', value: 'name-asc' },
    { label: 'Name: Z-A', value: 'name-desc' },
];

//Manipulate the shop page
export default function ShopPage() {

    const {
        products,
        total,
        page,
        totalPages,
        categories,
        brands,
        filters: initialFilters
    } = useLoaderData<typeof loader>();

    const [clientProducts, setClientProducts] = useState<Product[]>(products)
    const [sortValue, setSortValue] = useState('relevance')
    const maxPriceLimit = 100;
    const submit = useSubmit();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');


    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Build current filters from URL
    const currentFilters: FilterState = {
        search: searchParams.get('search') || searchParams.get('q') || '',
        category: searchParams.get('category') || 'All',
        brand: searchParams.get('brand') || 'All',
        sortBy: searchParams.get('sortBy') || searchParams.get('sort') || 'featured',
        inStock: searchParams.get('inStock') === 'true',
        priceRange: [
            Number(searchParams.get('minPrice')) || 0,
            Number(searchParams.get('maxPrice')) || maxPriceLimit,
        ],
        currency: searchParams.get('currency')?.split(',').filter(Boolean) || [],
        region: searchParams.get('region')?.split(',').filter(Boolean) || []
    };

    // Update URL with new filters
    const updateURL = useCallback((newFilters: FilterState, newPage: number = 1) => {
        const formData = new FormData();
        // const params = new URLSearchParams();

        // Add filter parameters
        if (newFilters.search && newFilters.search.trim()) {
            formData.set('search', newFilters.search.trim());
        }
        if (newFilters.category && newFilters.category !== 'All') {
            formData.set('category', newFilters.category);
        }
        if (newFilters.brand && newFilters.brand !== 'All') {
            formData.set('brand', newFilters.brand);
        }
        if (newFilters.sortBy && newFilters.sortBy !== 'featured') {
            formData.set('sortBy', newFilters.sortBy);
        }
        if (newFilters.inStock) {
            formData.set('inStock', 'true');
        }
        if (newFilters.priceRange && newFilters.priceRange[0] > 0) {
            formData.set('minPrice', newFilters.priceRange[0].toString());
        }
        if (newFilters.priceRange && newFilters.priceRange[1] < 100) {
            formData.set('maxPrice', newFilters.priceRange[1].toString());
        }
        if (newFilters.currency && newFilters.currency.length > 0) {
            formData.set('currency', newFilters.currency.join(','));
        }
        if (newFilters.region && newFilters.region.length > 0) {
            formData.set('region', newFilters.region.join(','));
        }
        if (newPage > 1) {
            formData.set('page', newPage.toString());
        }

        console.log('🔄 Updating URL with params:', Object.fromEntries(formData));
        submit(formData, { method: "GET"}); // This should trigger the loader prop
        // setSearchParams(formData, { replace: false });
    }, [submit]);

    const handleFiltersChange = useCallback((newFilters: FilterState) => {
        console.log('🔄 Filters changed:', newFilters);
        updateURL(newFilters, 1); // Reset to page 1 when filters change
    }, [updateURL]);

    // const handleHeaderSearch = useCallback((searchQuery: string) => {
    //     console.log('🔍 Header search triggered with query:', searchQuery);
    //     const lowerQuery= (searchQuery.toLowerCase());
    //     const filtered = products.filter(product =>
    //     product.name.toLowerCase().includes(lowerQuery)) ||
    //         product.description?.toLowerCase().includes(lowerQuery);
    //
    //     const updatedFilters = {
    //         ...currentFilters,
    //         search: searchQuery.trim() // Ensure we trim whitespace
    //     };
    //
    //     console.log('🔍 Updated filters:', updatedFilters);
    //     handleFiltersChange(updatedFilters);
    // }, [handleFiltersChange, currentFilters]);

    const handlePageChange = useCallback((newPage: number) => {
        console.log('📄 Page changed to:', newPage);
        updateURL(currentFilters, newPage);
    }, [updateURL, currentFilters]);

    const handleAddToCart = (product: Product) => {
        console.log('🛒 Add to cart:', product);
        // Implement cart logic here
    };

    const handleToggleWishlist = (product: Product) => {
        console.log('❤️ Toggle wishlist:', product);
        // Implement wishlist logic here
    };

    const handleClearFilters = useCallback(() => {
        const clearedFilters: FilterState = {
            search: '',
            category: 'All',
            brand: 'All',
            sortBy: 'featured',
            inStock: false,
            priceRange: [0, 5000],
            currency: [],
            region: []
        };
        handleFiltersChange(clearedFilters);
    }, [handleFiltersChange]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Logo, Search, and Cart */}
            <Header
                // onSearch={handleHeaderSearch}
                searchValue={currentFilters.search}
                cartItemCount={0}
                currentCurrency="EUR"
                currentLanguage="English"
            />


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block">
                        <FilterSidebar
                            filters={currentFilters}
                            onFiltersChange={handleFiltersChange}
                            categories={categories}
                            brands={brands}
                            isOpen={true}
                            onClose={() => {}}
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {/* Mobile Products Header with Filter Button */}
                        <div className="lg:hidden mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Products</h1>
                            <Button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-full flex items-center justify-center gap-2 font-medium"
                            >
                                <Filter className="w-5 h-5"/>
                                {showMobileFilters ? 'Hide filters' : `Filter ${total} results`}
                            </Button>

                            {/* Mobile Collapsible Filters */}
                            {showMobileFilters && (
                                <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <FilterSidebar
                                        filters={currentFilters}
                                        onFiltersChange={handleFiltersChange}
                                        categories={categories}
                                        brands={brands}
                                        isOpen={true}
                                        onClose={() => setShowMobileFilters(false)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Sort Options and Results Count - Desktop */}
                        <div className="hidden lg:flex items-center justify-between mb-6">
                            <div className="text-sm text-gray-600">
                                {total} products found
                                {currentFilters.search && (
                                    <span className="ml-1">for "{currentFilters.search}"</span>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <SortOptions
                                    value={currentFilters.sortBy}
                                    onChange={(value) => handleFiltersChange({...currentFilters, sortBy: value})}
                                    options={sortOptions}
                                />
                            </div>
                        </div>

                        {/* Mobile Sort Options */}
                        <div className="lg:hidden mb-6">
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                                <SortOptions
                                    value={currentFilters.sortBy}
                                    onChange={(value) => handleFiltersChange({...currentFilters, sortBy: value})}
                                    options={sortOptions}
                                />
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(currentFilters.search || currentFilters.category !== 'All' || currentFilters.brand !== 'All' || currentFilters.inStock) && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {currentFilters.search && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-sm">
                                            <span>Search: "{currentFilters.search}"</span>
                                            <button
                                                onClick={() => handleFiltersChange({...currentFilters, search: ''})}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="w-3 h-3"/>
                                            </button>
                                        </div>
                                    )}
                                    {currentFilters.category !== 'All' && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-sm">
                                            <span>Category: {currentFilters.category}</span>
                                            <button
                                                onClick={() => handleFiltersChange({...currentFilters, category: 'All'})}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="w-3 h-3"/>
                                            </button>
                                        </div>
                                    )}
                                    {currentFilters.brand !== 'All' && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-sm">
                                            <span>Brand: {currentFilters.brand}</span>
                                            <button
                                                onClick={() => handleFiltersChange({...currentFilters, brand: 'All'})}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="w-3 h-3"/>
                                            </button>
                                        </div>
                                    )}
                                    {currentFilters.inStock && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-sm">
                                            <span>In Stock Only</span>
                                            <button
                                                onClick={() => handleFiltersChange({...currentFilters, inStock: false})}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="w-3 h-3"/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* blocks and list switch*/}
                        <div className="flex item-centre gap-2 p-4">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                aria-label="Grid View"
                            >
                                <LayoutGrid />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                aria-label="List View"
                            >
                                <List />
                            </button>
                        </div>
                        {/* Loading/Content */}
                        {isLoading ? (
                            <LoadingState text="Loading products..."/>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Search className="w-8 h-8 text-gray-400"/>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-4">
                                    {currentFilters.search
                                        ? `No results found for "${currentFilters.search}". Try adjusting your search or filters.`
                                        : 'Try adjusting your search or filters'
                                    }
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        ) : (
                            <>
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                viewMode="grid"
                                                onAddToCart={handleAddToCart}
                                                onToggleWishlist={handleToggleWishlist}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 mb-4">
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                viewMode="line"
                                                onAddToCart={handleAddToCart}
                                                onToggleWishlist={handleToggleWishlist}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        className="mt-8"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}