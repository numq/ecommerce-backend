import {inject, injectable} from "inversify";
import {sendUnaryData, ServerUnaryCall, status, UntypedHandleCall} from "@grpc/grpc-js";
import {AddCategory} from "./AddCategory";
import {GetCategoryById} from "./GetCategoryById";
import {GetCategories} from "./GetCategories";
import {UpdateCategory} from "./UpdateCategory";
import {RemoveCategory} from "./RemoveCategory";
import {CategoryMapper} from "./CategoryMapper";
import {Types} from "../di/types";
import {response} from "../response";
import {
    AddCategoryRequest,
    AddCategoryResponse,
    CategoryServiceServer,
    GetCategoriesByTagsRequest,
    GetCategoriesByTagsResponse,
    GetCategoriesRequest,
    GetCategoriesResponse,
    GetCategoryByIdRequest,
    GetCategoryByIdResponse,
    RemoveCategoryRequest,
    RemoveCategoryResponse,
    UpdateCategoryRequest,
    UpdateCategoryResponse
} from "../generated/category";
import {GetCategoriesByTags} from "./GetCategoriesByTags";

@injectable()
export class CategoryService implements CategoryServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.category.addCategory) private readonly addCategoryUseCase: AddCategory,
        @inject(Types.category.getCategoryById) private readonly getCategoryByIdUseCase: GetCategoryById,
        @inject(Types.category.getCategories) private readonly getCategoriesUseCase: GetCategories,
        @inject(Types.category.getCategoriesByTags) private readonly getCategoriesByTagsUseCase: GetCategoriesByTags,
        @inject(Types.category.updateCategory) private readonly updateCategoryUseCase: UpdateCategory,
        @inject(Types.category.removeCategory) private removeCategoryUseCase: RemoveCategory
    ) {
    }

    addCategory = (call: ServerUnaryCall<AddCategoryRequest, AddCategoryResponse>, callback: sendUnaryData<AddCategoryResponse>) => {
        const {category} = call.request;
        if (category) {
            response(this.addCategoryUseCase.execute(CategoryMapper.messageToEntity(category)), callback, value => ({id: value}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getCategories = (call: ServerUnaryCall<GetCategoriesRequest, GetCategoriesResponse>, callback: sendUnaryData<GetCategoriesResponse>) => {
        const {skip, limit} = call.request;
        if (skip && limit) {
            return response(this.getCategoriesUseCase.execute([skip, limit]), callback, value => ({categories: value.map(CategoryMapper.entityToMessage)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getCategoriesByTags = (call: ServerUnaryCall<GetCategoriesByTagsRequest, GetCategoriesByTagsResponse>, callback: sendUnaryData<GetCategoriesByTagsResponse>) => {
        const {tags, skip, limit} = call.request;
        if (tags && skip && limit) {
            if (tags.length > 0) {
                return response(this.getCategoriesByTagsUseCase.execute([tags, skip, limit]), callback, value => ({categories: value.map(CategoryMapper.entityToMessage)}));
            }
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getCategoryById = (call: ServerUnaryCall<GetCategoryByIdRequest, GetCategoryByIdResponse>, callback: sendUnaryData<GetCategoryByIdResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.getCategoryByIdUseCase.execute(id), callback, value => ({category: CategoryMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    removeCategory = (call: ServerUnaryCall<RemoveCategoryRequest, RemoveCategoryResponse>, callback: sendUnaryData<RemoveCategoryResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.removeCategoryUseCase.execute(id), callback, value => ({id: value}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    updateCategory = (call: ServerUnaryCall<UpdateCategoryRequest, UpdateCategoryResponse>, callback: sendUnaryData<UpdateCategoryResponse>) => {
        const {category} = call.request;
        if (category) {
            return response(this.updateCategoryUseCase.execute(category), callback, value => ({category: CategoryMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };
}