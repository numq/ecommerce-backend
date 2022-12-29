import {DeliveryItem as DeliveryItemMessage} from "../generated/delivery";
import {DeliveryItem} from "./DeliveryItem";

export namespace DeliveryItemMapper {
    export const entityToMessage = (entity: DeliveryItem): DeliveryItemMessage => ({
        id: entity.id,
        sku: entity.sku,
        quantity: entity.quantity,
        price: entity.price
    });
    export const messageToEntity = (message: DeliveryItemMessage): DeliveryItem => ({
        id: message.id,
        sku: message.sku,
        quantity: message.quantity,
        price: message.price
    });
}