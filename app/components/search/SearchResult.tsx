// components/search/SearchResult.tsx
import React from 'react';
import { ProductCard } from '../product/ProductCard';
import { LoadingState } from '../common/LoadingState';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Product } from '~/types/product';

interface SearchResultProps {
    products: Product[];
    isLoading: boolean;
    total: number;
    onClearFilters: () => void;
    onAddToCart?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
    activeFilters?: {
        brand?: string;
        inStock?: boolean;
        priceRange?: [number, number];
    };
}

export const SearchResult: React.FC<SearchResultProps> = ({
                                                              products,
                                                              isLoading,
                                                              total,
                                                              onClearFilters,
                                                              onAddToCart,
                                                              onToggleWishlist,
                                                              activeFilters
                                                          }) => {
    if (isLoading) {
        return <LoadingState text="Loading products..." />;
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={onClearFilters}>
                    Clear All Filters
                </Button>
            </div>
        );
    }

    return (
        <div>
            {/* Display active filters */}
            {activeFilters && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
                    <div className="flex flex-wrap gap-2">
                        {activeFilters.brand && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Brand: {activeFilters.brand}
                            </span>
                        )}
                        {activeFilters.inStock && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                In Stock Only
                            </span>
                        )}
                        {activeFilters.priceRange && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                Price: €{activeFilters.priceRange[0]} - €{activeFilters.priceRange[1]}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <p className="text-sm text-gray-600">
                    Showing {products.length} of {total} products
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                    />
                ))}
            </div>
        </div>
    );
};

export default SearchResult;