import {
    CancelDeliveryRequest,
    CancelDeliveryResponse,
    CompleteDeliveryRequest,
    CompleteDeliveryResponse,
    DeliveryServiceServer,
    GetDeliveriesByCourierIdRequest,
    GetDeliveriesByCourierIdResponse,
    GetDeliveriesByOrderIdRequest,
    GetDeliveriesByOrderIdResponse,
    GetDeliveryByIdRequest,
    GetDeliveryByIdResponse,
    RemoveDeliveryRequest,
    RemoveDeliveryResponse,
    StartDeliveryRequest,
    StartDeliveryResponse,
    UpdateDeliveryRequest,
    UpdateDeliveryResponse
} from "../generated/delivery";
import {sendUnaryData, ServerUnaryCall, status, UntypedHandleCall} from "@grpc/grpc-js";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {StartDelivery} from "./StartDelivery";
import {GetDeliveryById} from "./GetDeliveryById";
import {GetDeliveriesByCourierId} from "./GetDeliveriesByCourierId";
import {GetDeliveriesByOrderId} from "./GetDeliveriesByOrderId";
import {UpdateDelivery} from "./UpdateDelivery";
import {RemoveDelivery} from "./RemoveDelivery";
import {CancelDelivery} from "./CancelDelivery";
import {CompleteDelivery} from "./CompleteDelivery";
import {response} from "../response";
import {DeliveryMapper} from "./DeliveryMapper";

@injectable()
export class DeliveryService implements DeliveryServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.delivery.startDelivery) private readonly startDeliveryUseCase: StartDelivery,
        @inject(Types.delivery.getDeliveryById) private readonly getDeliveryByIdUseCase: GetDeliveryById,
        @inject(Types.delivery.getDeliveriesByCourierId) private readonly getDeliveriesByCourierIdUseCase: GetDeliveriesByCourierId,
        @inject(Types.delivery.getDeliveriesByOrderId) private readonly getDeliveriesByOrderIdUseCase: GetDeliveriesByOrderId,
        @inject(Types.delivery.updateDelivery) private readonly updateDeliveryUseCase: UpdateDelivery,
        @inject(Types.delivery.cancelDelivery) private readonly cancelDeliveryUseCase: CancelDelivery,
        @inject(Types.delivery.completeDelivery) private readonly completeDeliveryUseCase: CompleteDelivery,
        @inject(Types.delivery.removeDelivery) private readonly removeDeliveryUseCase: RemoveDelivery,
    ) {
    }

    cancelDelivery = (call: ServerUnaryCall<CancelDeliveryRequest, CancelDeliveryResponse>, callback: sendUnaryData<CancelDeliveryResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.cancelDeliveryUseCase.execute(id), callback, value => ({delivery: DeliveryMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    completeDelivery = (call: ServerUnaryCall<CompleteDeliveryRequest, CompleteDeliveryResponse>, callback: sendUnaryData<CompleteDeliveryResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.completeDeliveryUseCase.execute(id), callback, value => ({delivery: DeliveryMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getDeliveriesByCourierId = (call: ServerUnaryCall<GetDeliveriesByCourierIdRequest, GetDeliveriesByCourierIdResponse>, callback: sendUnaryData<GetDeliveriesByCourierIdResponse>) => {
        const {courierId, skip, limit} = call.request;
        if (courierId) {
            return response(this.getDeliveriesByCourierIdUseCase.execute([courierId, skip, limit]), callback, value => ({deliveries: value.map(DeliveryMapper.entityToMessage)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getDeliveryById = (call: ServerUnaryCall<GetDeliveryByIdRequest, GetDeliveryByIdResponse>, callback: sendUnaryData<GetDeliveryByIdResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.getDeliveryByIdUseCase.execute(id), callback, value => ({delivery: DeliveryMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getDeliveriesByOrderId = (call: ServerUnaryCall<GetDeliveriesByOrderIdRequest, GetDeliveriesByOrderIdResponse>, callback: sendUnaryData<GetDeliveriesByOrderIdResponse>) => {
        const {orderId, skip, limit} = call.request;
        if (orderId) {
            return response(this.getDeliveriesByOrderIdUseCase.execute([orderId, skip, limit]), callback, value => ({deliveries: value.map(DeliveryMapper.entityToMessage)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    removeDelivery = (call: ServerUnaryCall<RemoveDeliveryRequest, RemoveDeliveryResponse>, callback: sendUnaryData<RemoveDeliveryResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.removeDeliveryUseCase.execute(id), callback, value => ({id: value}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    startDelivery = (call: ServerUnaryCall<StartDeliveryRequest, StartDeliveryResponse>, callback: sendUnaryData<StartDeliveryResponse>) => {
        const {delivery} = call.request;
        if (delivery) {
            return response(this.startDeliveryUseCase.execute(DeliveryMapper.messageToEntity(delivery)), callback, value => ({delivery: DeliveryMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    updateDelivery = (call: ServerUnaryCall<UpdateDeliveryRequest, UpdateDeliveryResponse>, callback: sendUnaryData<UpdateDeliveryResponse>) => {
        const {delivery} = call.request;
        if (delivery) {
            return response(this.updateDeliveryUseCase.execute(DeliveryMapper.messageToEntity(delivery)), callback, value => ({delivery: DeliveryMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };
}