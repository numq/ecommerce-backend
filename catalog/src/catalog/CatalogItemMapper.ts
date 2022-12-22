import {CatalogItem} from "./CatalogItem";
import {CatalogItem as CatalogItemMessage} from "../generated/catalog";
import {Buffer} from "buffer";

export namespace CatalogItemMapper {
    export const entityToMessage = (entity: CatalogItem): CatalogItemMessage => ({
        id: entity.id,
        name: entity.name,
        description: entity.description,
        imageBytes: Buffer.from(entity.imageBytes),
        price: entity.price,
        discount: entity.discount,
        weight: entity.weight,
        quantity: entity.quantity,
        tags: entity.tags,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
    });
    export const messageToEntity = (message: CatalogItemMessage): CatalogItem => ({
        id: message.id,
        name: message.name,
        description: message.description,
        imageBytes: new Uint8Array(message.imageBytes),
        price: message.price,
        discount: message.discount,
        weight: message.weight,
        quantity: message.quantity,
        tags: message.tags,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
    });
}