import {Delivery as DeliveryMessage} from "../generated/delivery";
import {Delivery} from "./Delivery";
import {DeliveryItemMapper} from "./DeliveryItemMapper";

export namespace DeliveryMapper {
    export const entityToMessage = (entity: Delivery): DeliveryMessage => ({
        id: entity.id,
        orderId: entity.orderId,
        status: entity.status.valueOf(),
        details: entity.details,
        items: entity.items.map(DeliveryItemMapper.entityToMessage),
        address: entity.address,
        courierId: entity.courierId,
        startedAt: entity.startedAt,
        deliveredBy: entity.deliveredBy
    });
    export const messageToEntity = (message: DeliveryMessage): Delivery => ({
        id: message.id,
        orderId: message.orderId,
        status: message.status.valueOf(),
        details: message.details,
        items: message.items.map(DeliveryItemMapper.messageToEntity),
        address: message.address,
        courierId: message.courierId,
        startedAt: message.startedAt,
        deliveredBy: message.deliveredBy
    });
}