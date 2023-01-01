import {
    CreateOrderRequest,
    CreateOrderResponse,
    DeleteOrderRequest,
    DeleteOrderResponse,
    GetCustomerOrdersRequest,
    GetCustomerOrdersResponse,
    GetOrderByIdRequest,
    GetOrderByIdResponse,
    OrderServiceServer,
    UpdateOrderRequest,
    UpdateOrderResponse
} from "../generated/order";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {CreateOrder} from "./CreateOrder";
import {GetCustomerOrders} from "./GetCustomerOrders";
import {GetOrderById} from "./GetOrderById";
import {UpdateOrder} from "./UpdateOrder";
import {DeleteOrder} from "./DeleteOrder";
import {sendUnaryData, ServerUnaryCall, status, UntypedHandleCall} from "@grpc/grpc-js";
import {response} from "../response";
import {OrderMapper} from "./OrderMapper";

@injectable()
export class OrderService implements OrderServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.order.createOrder) private readonly createOrderUseCase: CreateOrder,
        @inject(Types.order.getOrderById) private readonly getOrderByIdUseCase: GetOrderById,
        @inject(Types.order.getCustomerOrders) private readonly getCustomerOrdersUseCase: GetCustomerOrders,
        @inject(Types.order.updateOrder) private readonly updateOrderUseCase: UpdateOrder,
        @inject(Types.order.deleteOrder) private readonly deleteOrderUseCase: DeleteOrder,
    ) {
    }

    createOrder = (call: ServerUnaryCall<CreateOrderRequest, CreateOrderResponse>, callback: sendUnaryData<CreateOrderResponse>) => {
        const {order} = call.request;
        if (order) {
            return response(this.createOrderUseCase.execute(OrderMapper.messageToEntity(order)), callback, value => ({id: value}))
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    deleteOrder = (call: ServerUnaryCall<DeleteOrderRequest, DeleteOrderResponse>, callback: sendUnaryData<DeleteOrderResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.deleteOrderUseCase.execute(id), callback, value => ({id: value}))
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getCustomerOrders = (call: ServerUnaryCall<GetCustomerOrdersRequest, GetCustomerOrdersResponse>, callback: sendUnaryData<GetCustomerOrdersResponse>) => {
        const {customerId} = call.request;
        if (customerId) {
            return response(this.getCustomerOrdersUseCase.execute(customerId), callback, value => ({orders: value.map(OrderMapper.entityToMessage)}))
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getOrderById = (call: ServerUnaryCall<GetOrderByIdRequest, GetOrderByIdResponse>, callback: sendUnaryData<GetOrderByIdResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.getOrderByIdUseCase.execute(id), callback, value => ({order: OrderMapper.entityToMessage(value)}))
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    updateOrder = (call: ServerUnaryCall<UpdateOrderRequest, UpdateOrderResponse>, callback: sendUnaryData<UpdateOrderResponse>) => {
        const {order} = call.request;
        if (order) {
            return response(this.updateOrderUseCase.execute(OrderMapper.messageToEntity(order)), callback, value => ({order: OrderMapper.entityToMessage(value)}))
        }
        return callback({code: status.INVALID_ARGUMENT});
    };
}