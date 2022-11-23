import {Category} from "./Category";
import {Category as CategoryMessage} from "../generated/category";

export namespace CategoryMapper {
    export const entityToMessage = (entity: Category): CategoryMessage => ({
        id: entity.id,
        name: entity.name,
        description: entity.description,
        imageBytes: Buffer.from(entity.imageBytes),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
    });
    export const messageToEntity = (message: CategoryMessage): Category => ({
        id: message.id,
        name: message.name,
        description: message.description,
        imageBytes: new Uint8Array(message.imageBytes),
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
    });
}