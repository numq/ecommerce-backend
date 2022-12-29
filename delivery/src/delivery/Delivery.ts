import {DeliveryItem} from "./DeliveryItem";
import {DeliveryStatus} from "./DeliveryStatus";

export type Delivery = {
    id: string;
    orderId: string;
    status: DeliveryStatus;
    details: string;
    items: DeliveryItem[];
    address: string;
    courierId: string;
    startedAt: number;
    deliveredBy: number;
};