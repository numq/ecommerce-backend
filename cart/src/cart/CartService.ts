import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {IncreaseItemQuantity} from "./IncreaseItemQuantity";
import {GetCart} from "./GetCart";
import {sendUnaryData, ServerUnaryCall, status, UntypedHandleCall} from "@grpc/grpc-js";
import {response} from "../response";
import {ItemMapper} from "./ItemMapper";
import {ClearCart} from "./ClearCart";
import {DecreaseItemQuantity} from "./DecreaseItemQuantity";
import {
    CartServiceServer,
    ClearCartRequest,
    ClearCartResponse,
    DecreaseItemQuantityRequest,
    DecreaseItemQuantityResponse,
    GetCartRequest,
    GetCartResponse,
    IncreaseItemQuantityRequest,
    IncreaseItemQuantityResponse
} from "../generated/cart";

@injectable()
export class CartService implements CartServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.cart.getCart) private readonly getCartUseCase: GetCart,
        @inject(Types.cart.increaseItemQuantity) private readonly increaseItemQuantityUseCase: IncreaseItemQuantity,
        @inject(Types.cart.decreaseItemQuantity) private readonly decreaseItemQuantityUseCase: DecreaseItemQuantity,
        @inject(Types.cart.clearCart) private readonly clearCartUseCase: ClearCart
    ) {
    }

    getCart = (call: ServerUnaryCall<GetCartRequest, GetCartResponse>, callback: sendUnaryData<GetCartResponse>) => {
        const {cartId} = call.request;
        if (cartId) {
            return response(this.getCartUseCase.execute(cartId), callback, value => ({items: value.map(ItemMapper.entityToMessage)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    clearCart = (call: ServerUnaryCall<ClearCartRequest, ClearCartResponse>, callback: sendUnaryData<ClearCartResponse>) => {
        const {cartId} = call.request;
        if (cartId) {
            return response(this.clearCartUseCase.execute(cartId), callback, value => ({cartId: value}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    increaseItemQuantity = (call: ServerUnaryCall<IncreaseItemQuantityRequest, IncreaseItemQuantityResponse>, callback: sendUnaryData<IncreaseItemQuantityResponse>) => {
        const {cartId, itemId} = call.request;
        if (cartId && itemId) {
            return response(this.increaseItemQuantityUseCase.execute([cartId, itemId]), callback, value => ({item: ItemMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    decreaseItemQuantity = (call: ServerUnaryCall<DecreaseItemQuantityRequest, DecreaseItemQuantityResponse>, callback: sendUnaryData<DecreaseItemQuantityResponse>) => {
        const {cartId, itemId} = call.request;
        if (cartId && itemId) {
            return response(this.decreaseItemQuantityUseCase.execute([cartId, itemId]), callback, value => ({item: value ? ItemMapper.entityToMessage(value) : undefined}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };
}