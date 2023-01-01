import {OrderedItem as OrderedItemMessage} from "../generated/order";
import {OrderedItem} from "./OrderedItem";

export namespace OrderedItemMapper {
    export const entityToMessage = (entity: OrderedItem): OrderedItemMessage => ({
        id: entity.id,
        sku: entity.sku,
        name: entity.name,
        quantity: entity.quantity,
        discount: entity.discount,
        price: entity.price
    });
    export const messageToEntity = (message: OrderedItemMessage): OrderedItem => ({
        id: message.id,
        sku: message.sku,
        name: message.name,
        quantity: message.quantity,
        discount: message.discount,
        price: message.price
    });
}