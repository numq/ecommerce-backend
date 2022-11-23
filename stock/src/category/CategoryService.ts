import {inject, injectable} from "inversify";
import {
    AddCategoryRequest,
    AddCategoryResponse,
    CategoryServiceServer,
    GetCategoriesRequest,
    GetCategoriesResponse,
    GetCategoryByIdRequest,
    GetCategoryByIdResponse,
    RemoveCategoryRequest,
    RemoveCategoryResponse,
    UpdateCategoryRequest,
    UpdateCategoryResponse
} from "../generated/category";
import {Types} from "../di/types";
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from "@grpc/grpc-js";
import {Config} from "../config/Config";
import {AddCategory} from "./AddCategory";
import {GetCategoryById} from "./GetCategoryById";
import {GetCategories} from "./GetCategories";
import {UpdateCategory} from "./UpdateCategory";
import {RemoveCategory} from "./RemoveCategory";
import {CategoryMapper} from "./CategoryMapper";
import {response} from "../response/response";

@injectable()
export class CategoryService implements CategoryServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.app.config) private readonly config: Config,
        @inject(Types.category.addCategory) private readonly addCategoryUseCase: AddCategory,
        @inject(Types.category.getCategoryById) private readonly getCategoryByIdUseCase: GetCategoryById,
        @inject(Types.category.getCategories) private readonly getCategoriesUseCase: GetCategories,
        @inject(Types.category.updateCategory) private readonly updateCategoryUseCase: UpdateCategory,
        @inject(Types.category.removeCategory) private removeCategoryUseCase: RemoveCategory
    ) {
    }

    addCategory(call: ServerUnaryCall<AddCategoryRequest, AddCategoryResponse>, callback: sendUnaryData<AddCategoryResponse>): void {
        const {category} = call.request;
        if (category) {
            response(this.addCategoryUseCase.execute(CategoryMapper.messageToEntity(category)), callback, value => ({id: value}));
        }
    }

    getCategories(call: ServerUnaryCall<GetCategoriesRequest, GetCategoriesResponse>, callback: sendUnaryData<GetCategoriesResponse>): void {
        if (call.request) {
            response(this.getCategoriesUseCase.execute(), callback, value => ({categories: value.map(CategoryMapper.entityToMessage)}));
        }
    }

    getCategoryById(call: ServerUnaryCall<GetCategoryByIdRequest, GetCategoryByIdResponse>, callback: sendUnaryData<GetCategoryByIdResponse>): void {
        const {id} = call.request;
        if (id) {
            response(this.getCategoryByIdUseCase.execute(id), callback, value => ({category: CategoryMapper.entityToMessage(value)}));
        }
    }

    removeCategory(call: ServerUnaryCall<RemoveCategoryRequest, RemoveCategoryResponse>, callback: sendUnaryData<RemoveCategoryResponse>): void {
        const {id} = call.request;
        if (id) {
            response(this.removeCategoryUseCase.execute(id), callback, value => ({id: value}));
        }
    }

    updateCategory(call: ServerUnaryCall<UpdateCategoryRequest, UpdateCategoryResponse>, callback: sendUnaryData<UpdateCategoryResponse>): void {
        const {category} = call.request;
        if (category) {
            response(this.updateCategoryUseCase.execute(category), callback, value => ({category: CategoryMapper.entityToMessage(value)}));
        }
    }
}