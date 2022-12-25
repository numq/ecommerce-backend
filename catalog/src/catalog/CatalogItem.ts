export type CatalogItem = {
    id: string;
    sku: string;
    name: string;
    description: string;
    imageBytes: Uint8Array;
    price: number;
    discount: number;
    weight: number;
    quantity: number;
    tags: string[];
    createdAt: number;
    updatedAt: number;
};