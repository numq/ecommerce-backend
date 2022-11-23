import {inject, injectable} from "inversify";
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from "@grpc/grpc-js";
import {
    AddProductRequest,
    AddProductResponse,
    GetProductByIdRequest,
    GetProductByIdResponse,
    GetProductsFromCategoryRequest,
    GetProductsFromCategoryResponse,
    ProductServiceServer,
    RemoveProductRequest,
    RemoveProductResponse,
    UpdateProductRequest,
    UpdateProductResponse
} from "../generated/product";
import {Types} from "../di/types";
import {Config} from "../config/Config";
import {AddProduct} from "./AddProduct";
import {GetProductById} from "./GetProductById";
import {GetProductsFromCategory} from "./GetProductsFromCategory";
import {UpdateProduct} from "./UpdateProduct";
import {RemoveProduct} from "./RemoveProduct";
import {response} from "../response/response";
import {ProductMapper} from "./ProductMapper";

@injectable()
export class ProductService implements ProductServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.app.config) private readonly config: Config,
        @inject(Types.product.addProduct) private readonly addProductUseCase: AddProduct,
        @inject(Types.product.getProductById) private readonly getProductByIdUseCase: GetProductById,
        @inject(Types.product.getProductsFromCategory) private readonly getProductsFromCategoryUseCase: GetProductsFromCategory,
        @inject(Types.product.updateProduct) private readonly updateProductUseCase: UpdateProduct,
        @inject(Types.product.removeProduct) private removeProductUseCase: RemoveProduct
    ) {
    }

    addProduct(call: ServerUnaryCall<AddProductRequest, AddProductResponse>, callback: sendUnaryData<AddProductResponse>): void {
        const {product} = call.request;
        if (product) {
            response(this.addProductUseCase.execute(ProductMapper.messageToEntity(product)), callback, value => ({id: value}));
        }
    }

    getProductById(call: ServerUnaryCall<GetProductByIdRequest, GetProductByIdResponse>, callback: sendUnaryData<GetProductByIdResponse>): void {
        const {id} = call.request;
        if (id) {
            response(this.getProductByIdUseCase.execute(id), callback, value => ({product: ProductMapper.entityToMessage(value)}));
        }
    }

    getProductsFromCategory(call: ServerUnaryCall<GetProductsFromCategoryRequest, GetProductsFromCategoryResponse>, callback: sendUnaryData<GetProductsFromCategoryResponse>): void {
        const {categoryId, skip, limit} = call.request;
        if (categoryId && skip && limit) {
            response(this.getProductsFromCategoryUseCase.execute([categoryId, skip, limit]), callback, value => ({products: value.map(ProductMapper.entityToMessage)}));
        }
    }

    removeProduct(call: ServerUnaryCall<RemoveProductRequest, RemoveProductResponse>, callback: sendUnaryData<RemoveProductResponse>): void {
        const {id} = call.request;
        if (id) {
            response(this.removeProductUseCase.execute(id), callback, value => ({id: value}));
        }
    }

    updateProduct(call: ServerUnaryCall<UpdateProductRequest, UpdateProductResponse>, callback: sendUnaryData<UpdateProductResponse>): void {
        const {product} = call.request;
        if (product) {
            response(this.updateProductUseCase.execute(product), callback, value => ({product: ProductMapper.entityToMessage(value)}));
        }
    }
}