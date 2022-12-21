import {inject, injectable} from "inversify";
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from "@grpc/grpc-js";
import {Types} from "../di/types";
import {AddCatalogItem} from "./AddCatalogItem";
import {GetCatalogItemById} from "./GetCatalogItemById";
import {GetCatalogItemsByCategory} from "./GetCatalogItemsByCategory";
import {UpdateCatalogItem} from "./UpdateCatalogItem";
import {RemoveCatalogItem} from "./RemoveCatalogItem";
import {response} from "../response";
import {CatalogItemMapper} from "./CatalogItemMapper";
import {GetCatalogItemsByTag} from "./GetCatalogItemsByTag";
import {
    AddCatalogItemRequest,
    AddCatalogItemResponse,
    CatalogServiceServer,
    GetCatalogItemByIdRequest,
    GetCatalogItemByIdResponse,
    GetCatalogItemsByCategoryRequest,
    GetCatalogItemsByCategoryResponse,
    GetCatalogItemsByTagRequest,
    GetCatalogItemsByTagResponse,
    RemoveCatalogItemRequest,
    RemoveCatalogItemResponse,
    UpdateCatalogItemRequest,
    UpdateCatalogItemResponse
} from "../generated/catalog";

@injectable()
export class CatalogService implements CatalogServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.catalog.addCatalogItem) private readonly addCatalogItemUseCase: AddCatalogItem,
        @inject(Types.catalog.getCatalogItemById) private readonly getCatalogItemByIdUseCase: GetCatalogItemById,
        @inject(Types.catalog.getCatalogItemsByCategory) private readonly getCatalogItemsByCategoryUseCase: GetCatalogItemsByCategory,
        @inject(Types.catalog.getCatalogItemsByTag) private readonly getCatalogItemsByTagUseCase: GetCatalogItemsByTag,
        @inject(Types.catalog.updateCatalogItem) private readonly updateCatalogItemUseCase: UpdateCatalogItem,
        @inject(Types.catalog.removeCatalogItem) private removeCatalogItemUseCase: RemoveCatalogItem
    ) {
    }

    addCatalogItem = (call: ServerUnaryCall<AddCatalogItemRequest, AddCatalogItemResponse>, callback: sendUnaryData<AddCatalogItemResponse>) => {
        const {item} = call.request;
        if (item) {
            response(this.addCatalogItemUseCase.execute(CatalogItemMapper.messageToEntity(item)), callback, value => ({id: value}));
        }
    }

    getCatalogItemById = (call: ServerUnaryCall<GetCatalogItemByIdRequest, GetCatalogItemByIdResponse>, callback: sendUnaryData<GetCatalogItemByIdResponse>) => {
        const {id} = call.request;
        response(this.getCatalogItemByIdUseCase.execute(id), callback, value => ({item: CatalogItemMapper.entityToMessage(value)}));
    }

    getCatalogItemsByCategory = (call: ServerUnaryCall<GetCatalogItemsByCategoryRequest, GetCatalogItemsByCategoryResponse>, callback: sendUnaryData<GetCatalogItemsByCategoryResponse>) => {
        const {categoryId, skip, limit} = call.request;
        response(this.getCatalogItemsByCategoryUseCase.execute([categoryId, skip, limit]), callback, value => ({items: value.map(CatalogItemMapper.entityToMessage)}));
    }

    getCatalogItemsByTag = (call: ServerUnaryCall<GetCatalogItemsByTagRequest, GetCatalogItemsByTagResponse>, callback: sendUnaryData<GetCatalogItemsByTagResponse>) => {
        const {tag, skip, limit} = call.request;
        response(this.getCatalogItemsByTagUseCase.execute([tag, skip, limit]), callback, value => ({items: value.map(CatalogItemMapper.entityToMessage)}));
    }

    removeCatalogItem = (call: ServerUnaryCall<RemoveCatalogItemRequest, RemoveCatalogItemResponse>, callback: sendUnaryData<RemoveCatalogItemResponse>) => {
        const {id} = call.request;
        response(this.removeCatalogItemUseCase.execute(id), callback, value => ({id: value}));
    }

    updateCatalogItem = (call: ServerUnaryCall<UpdateCatalogItemRequest, UpdateCatalogItemResponse>, callback: sendUnaryData<UpdateCatalogItemResponse>) => {
        const {item} = call.request;
        if (item) {
            response(this.updateCatalogItemUseCase.execute(item), callback, value => ({item: CatalogItemMapper.entityToMessage(value)}));
        }
    }
}