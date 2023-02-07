import {Promo as PromoMessage} from "../generated/promo";
import {Promo} from "./Promo";

export namespace PromoMapper {
    export const entityToMessage = (entity: Promo): PromoMessage => ({
        value: entity.value,
        reusable: entity.reusable,
        requiredAmount: entity.requiredAmount,
        categoryIds: entity.categoryIds,
        productIds: entity.productIds,
        freeShipping: entity.freeShipping,
        expirationTime: entity.expirationTime
    });
    export const messageToEntity = (message: PromoMessage): Promo => ({
        value: message.value,
        reusable: message.reusable,
        requiredAmount: message.requiredAmount,
        categoryIds: message.categoryIds,
        productIds: message.productIds,
        freeShipping: message.freeShipping,
        expirationTime: message.expirationTime
    });
}