export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {
        rate?: number;
        race?: number;
        count: number;
    };
}

export type LoadStatus = 
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";