// components/layout/Header.tsx - FIXED
import React, {useEffect, useState} from 'react';
import { Search, ShoppingCart, ChevronDown } from 'lucide-react';
import {Dash} from "~/components/ui/Dash";

interface HeaderProps {
    onSearch?: (query: string) => void;
    cartItemCount?: number;
    currentLanguage?: string;
    currentCurrency?: string;
    searchValue?: string;
}

export const Header: React.FC<HeaderProps> = ({
                                                  onSearch,
                                                  cartItemCount = 0,
                                                  currentLanguage = 'English',
                                                  currentCurrency = 'EUR',
                                                  searchValue = ''
                                              }) => {
    const [searchQuery, setSearchQuery] = useState(searchValue);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    // FIX: Sync internal state with prop changes
    useEffect(() => {
        setSearchQuery(searchValue);
    }, [searchValue]);
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Header search submitted', searchQuery);
        onSearch?.(searchQuery);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        // Optional: Call onSearch immediately for real-time search
        // onSearch?.(value);
    };
    // FIX: Handle Enter key and clear button
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('🔍 Enter key pressed, searching:', searchQuery);
            onSearch?.(searchQuery);
        }
    };

    const handleClearSearch = () => {
        console.log('🔍 Clearing search');
        setSearchQuery('');
        onSearch?.('');
    };

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'nl', name: 'Netherlands', flag: '🇳🇱' }
    ];

    const currencies = ['EUR', 'USD', 'GBP'];

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">▶</span>
                                </div>
                                <span className="ml-2 text-xl font-bold text-gray-900">SKINE</span>
                            </div>
                        </div>
                    </div>

                    {/* Center - Search Bar */}
                    <div className="flex-1 max-w-lg mx-8">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
                                />
                                {/* Clear button */}
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Rest of the component remains the same... */}
                    <div className="flex items-center space-x-4">
                        {/* Language and Currency Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <span className="text-sm font-medium text-gray-700">
                                    {currentCurrency} (€)
                                </span>
                                <span className="text-gray-400">|</span>
                                <span className="text-sm font-medium text-gray-700">
                                    {currentLanguage}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {isLanguageDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="p-2">
                                        {/* Currency Section */}
                                        <div className="mb-3">
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
                                                Currency
                                            </div>
                                            <div className="space-y-1">
                                                {currencies.map((currency) => (
                                                    <button
                                                        key={currency}
                                                        className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 ${
                                                            currentCurrency === currency
                                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                                : 'text-gray-700'
                                                        }`}
                                                    >
                                                        {currency} ({currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£'})
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <Dash/>

                                        {/* Language Section */}
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
                                                Language
                                            </div>
                                            <div className="space-y-1">
                                                {languages.map((language) => (
                                                    <button
                                                        key={language.code}
                                                        className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 flex items-center space-x-2 ${
                                                            currentLanguage === language.name
                                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                                : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <span>{language.flag}</span>
                                                        <span>{language.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart Button */}
                        <button className="relative p-2.5 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors">
                            <ShoppingCart className="w-5 h-5 text-white" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden">
                    {/* Top Row - Logo and Cart */}
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">▶</span>
                            </div>
                            <span className="ml-2 text-xl font-bold text-gray-900">SKINE</span>
                        </div>

                        <button className="relative p-2.5 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors">
                            <ShoppingCart className="w-5 h-5 text-white" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Bottom Row - Search and Currency/Language */}
                    <div className="pb-4 space-y-3">
                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </form>

                        {/* Currency and Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <span className="text-sm font-medium text-gray-700">
                                    {currentCurrency} (€) | {currentLanguage}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Mobile Dropdown Menu */}
                            {isLanguageDropdownOpen && (
                                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="p-2">
                                        {/* Currency Section */}
                                        <div className="mb-3">
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
                                                Currency
                                            </div>
                                            <div className="space-y-1">
                                                {currencies.map((currency) => (
                                                    <button
                                                        key={currency}
                                                        className={`w-full text-left px-2 py-2 text-sm rounded hover:bg-gray-100 ${
                                                            currentCurrency === currency
                                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                                : 'text-gray-700'
                                                        }`}
                                                    >
                                                        {currency} ({currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£'})
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 my-2"></div>

                                        {/* Language Section */}
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
                                                Language
                                            </div>
                                            <div className="space-y-1">
                                                {languages.map((language) => (
                                                    <button
                                                        key={language.code}
                                                        className={`w-full text-left px-2 py-2 text-sm rounded hover:bg-gray-100 flex items-center space-x-2 ${
                                                            currentLanguage === language.name
                                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                                : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <span>{language.flag}</span>
                                                        <span>{language.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};