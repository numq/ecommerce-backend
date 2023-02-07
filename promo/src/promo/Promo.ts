export type Promo = {
    value: string;
    reusable: boolean;
    requiredAmount: number;
    productIds: string[];
    categoryIds: string[];
    freeShipping: boolean;
    expirationTime: number;
};