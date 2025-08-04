// components/search/FilterSidebar.tsx - Complete and Fixed
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import type { FilterState } from '~/types/filters';
import { Dash } from "~/components/ui/Dash";

interface FilterSidebarProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    categories: string[];
    brands: string[];
    isOpen: boolean;
    onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
                                                                filters,
                                                                onFiltersChange,
                                                                categories,
                                                                brands,
                                                                isOpen,
                                                                onClose
                                                            }) => {
    const [showAllBrands, setShowAllBrands] = useState(false);
    const [showAllRegions, setShowAllRegions] = useState(false);

    const MAX_PRICE = 100;

    const [minInput, setMinInput] = useState(filters.priceRange[0].toString());
    const [maxInput, setMaxInput] = useState(filters.priceRange[1].toString());
    const availableRegions = ['The Netherlands', 'Germany', 'Belgium', 'United States', 'United Kingdom', 'Europe', 'Worldwide'];
    const availableCurrencies = ['EUR', 'USD', 'GBP', 'AUD', 'CAD'];


// Update when filters change externally (e.g. reset)
    useEffect(() => {
        setMinInput(filters.priceRange[0].toString());
        setMaxInput(filters.priceRange[1].toString());
    }, [filters.priceRange]);
    const updateFilter = (key: keyof FilterState, value: any) => {
        console.log(`🔄 Filter changing: ${key} =`, value);
        const updatedFilters = { ...filters, [key]: value };
        onFiltersChange(updatedFilters);
    };

    if (!isOpen) return null;

    const visibleBrands = showAllBrands ? brands : brands.slice(0, 8);
    const visibleRegions = showAllRegions ? availableRegions : availableRegions.slice(0, 5);

    return (
        <>
            <style jsx>{`
              .dual-range-slider {
                position: relative;
                height: 24px;
                width: 100%;
              }

              .range-input {
                position: absolute;
                width: 100%;
                height: 24px;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background: transparent;
                pointer-events: none;
                outline: none;
              }

              .range-input::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 18px;
                width: 18px;
                border-radius: 50%;
                background: #3b82f6;
                border: 3px solid white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                cursor: pointer;
                pointer-events: auto;
                position: relative;
                z-index: 1;
              }

              .range-input::-moz-range-thumb {
                height: 18px;
                width: 18px;
                border-radius: 50%;
                background: #3b82f6;
                border: 3px solid white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                cursor: pointer;
                pointer-events: auto;
                -moz-appearance: none;
              }

              .range-input::-webkit-slider-track {
                -webkit-appearance: none;
                appearance: none;
                height: 8px;
                background: transparent;
              }

              .range-input::-moz-range-track {
                height: 8px;
                background: transparent;
                border: none;
              }

              .range-input.range-min {
                z-index: 2;
              }

              .range-input.range-max {
                z-index: 1;
              }
            `}</style>

            <div className="h-full overflow-y-auto bg-white">
                <div className="p-4 space-y-6">
                    {/* Categories Filter */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
                        <Dash />

                        <div className="space-y-3 mt-4">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filters.category === 'All'}
                                        onChange={() => updateFilter('category', 'All')}
                                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                    />
                                </div>
                                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                                    All Categories
                                </span>
                            </label>
                            {categories.filter(cat => cat !== 'All').map(category => (
                                <label key={category} className="flex items-center cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === category}
                                            onChange={() => updateFilter('category', category)}
                                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                        />
                                    </div>
                                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                                        {category}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4">Brands</h3>
                        <Dash />

                        <div className="space-y-3 mt-4">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={filters.brand === 'All'}
                                        onChange={() => updateFilter('brand', 'All')}
                                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                    />
                                </div>
                                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                                    All Brands
                                </span>
                            </label>
                            {visibleBrands.filter(brand => brand !== 'All').map(brand => (
                                <label key={brand} className="flex items-center cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            name="brand"
                                            checked={filters.brand === brand}
                                            onChange={() => updateFilter('brand', brand)}
                                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                        />
                                    </div>
                                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                                        {brand}
                                    </span>
                                </label>
                            ))}

                            {brands.length > 8 && (
                                <button
                                    onClick={() => setShowAllBrands(!showAllBrands)}
                                    className="flex items-center text-blue-600 text-sm font-medium hover:underline"
                                >
                                    {showAllBrands ? (
                                        <>
                                            <ChevronUp className="w-4 h-4 mr-1" />
                                            Show less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4 mr-1" />
                                            Show all ({brands.length - 8} more)
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
                        <Dash />

                        <div className="space-y-4 mt-4">
                            {/* Current range display */}
                            <div className="text-sm text-gray-600">
                                €{filters.priceRange[0]} - €{filters.priceRange[1]}
                            </div>

                            {/* Min and Max Inputs */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        min="0"
                                        max={MAX_PRICE}
                                        value={minInput}
                                        onChange={(e) => setMinInput(e.target.value)}
                                        onBlur={() => {
                                            const val = Math.max(0, Math.min(Number(minInput), filters.priceRange[1] - 1));
                                            updateFilter('priceRange', [val, filters.priceRange[1]]);
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Min"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        min="0"
                                        max={MAX_PRICE}
                                        value={maxInput}
                                        onChange={(e) => setMaxInput(e.target.value)}
                                        onBlur={() => {
                                            const val = Math.max(Number(maxInput), filters.priceRange[0] + 1);
                                            updateFilter('priceRange', [filters.priceRange[0], Math.min(val, MAX_PRICE)]);
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* Dual Range Slider */}
                            <div className="dual-range-slider px-1">
                                {/* Background track */}
                                <div className="absolute w-full h-2 bg-gray-300 rounded-full top-1/2 transform -translate-y-1/2" />

                                {/* Active range track */}
                                <div
                                    className="absolute h-2 bg-blue-500 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{
                                        left: `${(filters.priceRange[0] / MAX_PRICE) * 100}%`,
                                        width: `${((filters.priceRange[1] - filters.priceRange[0]) / MAX_PRICE) * 100}%`,
                                    }}
                                />

                                {/* Min value slider */}
                                <input
                                    type="range"
                                    min="0"
                                    max={MAX_PRICE}
                                    value={filters.priceRange[0]}
                                    onChange={(e) => {
                                        const val = Math.min(Number(e.target.value), filters.priceRange[1] - 1);
                                        updateFilter('priceRange', [val, filters.priceRange[1]]);
                                    }}
                                    className="range-input range-min"
                                />

                                {/* Max value slider */}
                                <input
                                    type="range"
                                    min="0"
                                    max={MAX_PRICE}
                                    value={filters.priceRange[1]}
                                    onChange={(e) => {
                                        const val = Math.max(Number(e.target.value), filters.priceRange[0] + 1);
                                        updateFilter('priceRange', [filters.priceRange[0], val]);
                                    }}
                                    className="range-input range-max"
                                />
                            </div>


                        </div>
                    </div>

                    {/* Currency Filter */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4">Currency</h3>
                        <Dash />

                        <div className="space-y-3 mt-4">
                            {availableCurrencies.slice(0, 6).map(currency => (
                                <label key={currency} className="flex items-center cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={filters.currency?.includes(currency) || false}
                                            onChange={(e) => {
                                                const currentCurrency = filters.currency || [];
                                                const newCurrency = e.target.checked
                                                    ? [...currentCurrency, currency]
                                                    : currentCurrency.filter(c => c !== currency);
                                                updateFilter('currency', newCurrency);
                                            }}
                                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    </div>
                                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                                        {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : ''} {currency}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Region Filter */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4">Region</h3>
                        <Dash />

                        <div className="space-y-3 mt-4">
                            {visibleRegions.map(region => (
                                <label key={region} className="flex items-center cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={filters.region?.includes(region) || false}
                                            onChange={(e) => {
                                                const currentRegion = filters.region || [];
                                                const newRegion = e.target.checked
                                                    ? [...currentRegion, region]
                                                    : currentRegion.filter(r => r !== region);
                                                updateFilter('region', newRegion);
                                            }}
                                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    </div>
                                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                                        {region}
                                    </span>
                                </label>
                            ))}

                            {availableRegions.length > 5 && (
                                <button
                                    onClick={() => setShowAllRegions(!showAllRegions)}
                                    className="flex items-center text-blue-600 text-sm font-medium hover:underline"
                                >
                                    {showAllRegions ? (
                                        <>
                                            <ChevronUp className="w-4 h-4 mr-1" />
                                            Show less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4 mr-1" />
                                            Show all ({availableRegions.length - 5} more)
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stock Filter */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4">Availability</h3>
                        <Dash />

                        <div className="space-y-3 mt-4">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStock || false}
                                        onChange={(e) => updateFilter('inStock', e.target.checked)}
                                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                </div>
                                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                                    In Stock Only
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="pt-4 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={() => onFiltersChange({
                                search: '',
                                category: 'All',
                                brand: 'All',
                                sortBy: 'featured',
                                inStock: false,
                                priceRange: [0, MAX_PRICE],
                                currency: [],
                                region: []
                            })}
                            className="w-full"
                        >
                            Clear All Filters
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};