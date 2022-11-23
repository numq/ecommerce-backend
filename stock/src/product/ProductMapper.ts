import {Product} from "./Product";
import {Product as ProductMessage} from "../generated/product";
import {Buffer} from "buffer";

export namespace ProductMapper {
    export const entityToMessage = (entity: Product): ProductMessage => ({
        id: entity.id,
        name: entity.name,
        description: entity.description,
        imageBytes: Buffer.from(entity.imageBytes),
        price: entity.price,
        discount: entity.discount,
        weight: entity.weight,
        quantity: entity.quantity,
        categoryId: entity.categoryId,
        tags: entity.tags,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
    });
    export const messageToEntity = (message: ProductMessage): Product => ({
        id: message.id,
        name: message.name,
        description: message.description,
        imageBytes: new Uint8Array(message.imageBytes),
        price: message.price,
        discount: message.discount,
        weight: message.weight,
        quantity: message.quantity,
        categoryId: message.categoryId,
        tags: message.tags,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
    });
}