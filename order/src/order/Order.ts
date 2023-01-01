import {OrderStatus} from "./OrderStatus";
import {OrderedItem} from "./OrderedItem";

export type Order = {
    id: string;
    customerId: string;
    items: OrderedItem[];
    discount: string;
    price: string;
    status: OrderStatus;
    creationDate: number;
    deliveryDate: number;
};