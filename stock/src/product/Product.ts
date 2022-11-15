import {Category} from "../category/Category";

export type Product = {
    id: string;
    name: string;
    description: string;
    category: Category;
    price: number;
    weight: number;
    tags: string[];
    quantity: number;
};