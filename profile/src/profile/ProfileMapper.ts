import {Profile as ProfileMessage} from "../generated/profile";
import {Profile} from "./Profile";

export namespace ProfileMapper {
    export const entityToMessage = (entity: Profile): ProfileMessage => ({
        id: entity.id,
        name: entity.name,
        addresses: entity.addresses,
        usedCoupons: entity.usedCoupons
    });
    export const messageToEntity = (message: ProfileMessage): Profile => ({
        id: message.id,
        name: message.name,
        addresses: message.addresses,
        usedCoupons: message.usedCoupons
    });
}