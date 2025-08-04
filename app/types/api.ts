// import type {Product} from "~/types/product";
//
// export interface ApiResponse<T> {
//     data: T;
//     success: boolean;
//     message?: string;
//     total?: number;
//     page?: number;
//     limit?: number;
// }
//
// export interface ProductsResponse {
//     products: Product[];
//     total: number;
//     page: number;
//     totalPages: number;
// }

// types/api.ts
import type { Product } from './product';

export interface ApiResponse<T> {
    data?: T;
    products?: Product[]; // For products endpoint
    total?: number;
    brands?: string[];
    categories?: string;
    page?: number;
    totalPages?: number;
    success?: boolean;
    message?: string;
    error?: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
    categories?: string[];  // Add this
    brands?: string[];      // Add this
}