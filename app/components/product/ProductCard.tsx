// components/product/ProductCard.tsx - FIXED VERSION
import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '~/types/product';
import { Button } from '../ui/Button';

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'line';
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (product: Product) => void;
    isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            product,
                                                            viewMode = 'grid',
                                                            onAddToCart,
                                                            onToggleWishlist,
                                                            isWishlisted = false
                                                        }) => {
    // Helper function to get price display
    const getPriceDisplay = () => {
        const currency = product.priceCurrency || 'EUR';
        const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency;

        if (product.priceAmount) {
            return `${currencySymbol}${product.priceAmount}`;
        } else if (product.priceAmountMin && product.priceAmountMax) {
            return `${currencySymbol}${product.priceAmountMin} - ${currencySymbol}${product.priceAmountMax}`;
        } else if (product.priceAmountMin) {
            return `From ${currencySymbol}${product.priceAmountMin}`;
        } else if (product.price) {
            return `${currencySymbol}${product.price}`;
        }
        return 'Price on request';
    };
    // Helper function to get currency name
    const getFormattedPrice = () => {
        const currency = (product.priceCurrency || 'EUR').toUpperCase();
        const symbol = currency === 'EUR'
            ? '€'
            : currency === 'USD'
                ? '$'
                : currency === 'GBP'
                    ? '£'
                    : '¤'; // fallback symbol

        const amount =
            product.priceAmount ??
            product.priceAmountMin ??
            product.price ??
            0;

        return `${symbol} ${amount}`;
    };

    // Helper function to get brand name
    const getBrandName = () => {
        if (typeof product.brand === 'object' && product.brand?.name) {
            return product.brand.name;
        } else if (typeof product.brand === 'string') {
            return product.brand;
        }
        return 'Unknown Brand';
    };
    // Check if product is in stock
    const inStock = product.isStocked ?? product.inStock ?? true;

    return (
        <div
            className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1
      ${viewMode === 'line' ? 'flex flex-col sm:flex-row gap-4' : ''}`}
        >
            {/* Product Image */}
            <div
                className={`relative bg-gray-50 overflow-hidden
        ${viewMode === 'line' ? 'sm:w-48 w-full aspect-video' : 'aspect-square'}`}
            >
                <img
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300
          ${viewMode === 'line' ? 'sm:h-full' : ''}`}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.jpg';
                    }}
                />

                {/* Stock Badge */}
                {!inStock && (
                    <div
                        className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Out of Stock
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={() => onToggleWishlist(product)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                        isWishlisted
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}/>
                </button>
            </div>

            {/* Product Info */}
            <div className={`p-4 flex flex-col justify-between ${viewMode === 'line' ? 'flex-1' : ''}`}>
                <div>
                    {/* Brand */}
                    <div className="text-sm font-medium text-blue-600 mb-1">{getBrandName()}</div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Description */}
                    {product.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    )}

                    {/* Region */}
                    <div className="text-xs text-gray-500 mb-3">📍 {product.region}</div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">{getFormattedPrice()}</span>
                        {product.originalPrice && product.price && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                        )}
                    </div>

                    <Button
                        onClick={() => onAddToCart(product)}
                        disabled={!inStock}
                        size="sm"
                        className={`flex items-center gap-2 ${
                            !inStock
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        <ShoppingCart className="w-4 h-4"/>
                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </div>

                {/* Category */}
                <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          {product.category}
        </span>
                </div>
            </div>
        </div>
    );
}