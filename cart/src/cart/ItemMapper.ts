import {Item as ItemMessage} from "../generated/cart";
import {Item} from "./Item";

export namespace ItemMapper {
    export const entityToMessage = (entity: Item): ItemMessage => ({
        id: entity.id,
        quantity: entity.quantity,
        addedAt: entity.addedAt
    });
    export const messageToEntity = (message: ItemMessage): Item => ({
        id: message.id,
        quantity: message.quantity,
        addedAt: message.addedAt
    });
}