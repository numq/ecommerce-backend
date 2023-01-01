import {Order as OrderMessage} from "../generated/order";
import {Order} from "./Order";
import {OrderedItemMapper} from "./OrderedItemMapper";

export namespace OrderMapper {
    export const entityToMessage = (entity: Order): OrderMessage => ({
        id: entity.id,
        customerId: entity.customerId,
        items: entity.items.map(OrderedItemMapper.entityToMessage),
        discount: entity.discount,
        price: entity.price,
        status: entity.status.valueOf(),
        creationDate: entity.creationDate,
        deliveryDate: entity.deliveryDate
    });
    export const messageToEntity = (message: OrderMessage): Order => ({
        id: message.id,
        customerId: message.customerId,
        items: message.items.map(OrderedItemMapper.messageToEntity),
        discount: message.discount,
        price: message.price,
        status: message.status.valueOf(),
        creationDate: message.creationDate,
        deliveryDate: message.deliveryDate
    });
}