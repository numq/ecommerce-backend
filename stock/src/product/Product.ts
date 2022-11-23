export type Product = {
    id: string;
    name: string;
    description: string;
    imageBytes: Uint8Array;
    price: number;
    discount: number;
    weight: number;
    quantity: number;
    categoryId: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
};