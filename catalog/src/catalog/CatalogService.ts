import {inject, injectable} from "inversify";
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from "@grpc/grpc-js";
import {Types} from "../di/types";
import {AddCatalogItem} from "./AddCatalogItem";
import {GetCatalogItemById} from "./GetCatalogItemById";
import {UpdateCatalogItem} from "./UpdateCatalogItem";
import {RemoveCatalogItem} from "./RemoveCatalogItem";
import {response} from "../response";
import {CatalogItemMapper} from "./CatalogItemMapper";
import {GetCatalogItemsByTags} from "./GetCatalogItemsByTags";
import {
    AddCatalogItemRequest,
    AddCatalogItemResponse,
    CatalogServiceServer,
    GetCatalogItemByIdRequest,
    GetCatalogItemByIdResponse,
    GetCatalogItemsByTagsRequest,
    GetCatalogItemsByTagsResponse,
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
        @inject(Types.catalog.getCatalogItemsByTags) private readonly getCatalogItemsByTagsUseCase: GetCatalogItemsByTags,
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

    getCatalogItemsByTags = (call: ServerUnaryCall<GetCatalogItemsByTagsRequest, GetCatalogItemsByTagsResponse>, callback: sendUnaryData<GetCatalogItemsByTagsResponse>) => {
        const {tags, skip, limit} = call.request;
        response(this.getCatalogItemsByTagsUseCase.execute([tags, skip, limit]), callback, value => ({items: value.map(CatalogItemMapper.entityToMessage)}));
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