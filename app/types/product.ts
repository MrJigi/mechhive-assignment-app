//
// export interface Product {
//     id: string;
//     name: string;
//     brand: string;
//     region: string;
//     price: number;
//     description?: string; // possibly could be none
//     image: string;
//     inStock: boolean;
//
// }

// types/product.ts
export interface Brand {
    slug: string;
    name: string;
}

export interface Product {
    id?: string; // For compatibility with existing code
    name: string;
    brand: Brand;
    description: string;
    slug: string;
    priceCurrency: string;
    priceAmount?: number; // For fixed price products
    priceAmountMin?: number; // For variable price products
    priceAmountMax?: number; // For variable price products
    categories: string;
    isStocked: boolean;
    region: string;
    image: string;

    // Legacy fields for compatibility
    price?: number;
    originalPrice?: number;
    inStock?: boolean;
}

export interface ApiProduct {
    name: string;
    brand: Brand;
    description: string;
    slug: string;
    priceCurrency: string;
    priceAmount?: number;
    priceAmountMin?: number;
    priceAmountMax?: number;
    category: string;
    isStocked: boolean;
    region: string;
    image: string;
}