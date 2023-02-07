import {sendUnaryData, ServerUnaryCall, status, UntypedHandleCall} from "@grpc/grpc-js";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {
    GetPromoRequest,
    GetPromoResponse,
    InsertPromoRequest,
    InsertPromoResponse,
    PromoServiceServer,
    RemovePromoRequest,
    RemovePromoResponse
} from "../generated/promo";
import {InsertPromo} from "./InsertPromo";
import {GetPromo} from "./GetPromo";
import {RemovePromo} from "./RemovePromo";
import {response} from "../response";
import {PromoMapper} from "./PromoMapper";

@injectable()
export class PromoService implements PromoServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.promo.insertPromo) private readonly insertPromoUseCase: InsertPromo,
        @inject(Types.promo.getPromo) private readonly getPromoUseCase: GetPromo,
        @inject(Types.promo.removePromo) private readonly removePromoUseCase: RemovePromo
    ) {
    }

    insertPromo = (call: ServerUnaryCall<InsertPromoRequest, InsertPromoResponse>, callback: sendUnaryData<InsertPromoResponse>) => {
        const {value, reusable, requiredAmount, categoryIds, productIds, freeShipping, expirationTime} = call.request;
        if (value != null && expirationTime > 0) {
            return response(this.insertPromoUseCase.execute([value, reusable, requiredAmount, categoryIds, productIds, freeShipping, expirationTime]), callback, promo => ({promo: PromoMapper.entityToMessage(promo)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getPromo = (call: ServerUnaryCall<GetPromoRequest, GetPromoResponse>, callback: sendUnaryData<GetPromoResponse>) => {
        const {value} = call.request;
        if (value) {
            return response(this.getPromoUseCase.execute(value), callback, promo => ({promo: PromoMapper.entityToMessage(promo)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    removePromo = (call: ServerUnaryCall<RemovePromoRequest, RemovePromoResponse>, callback: sendUnaryData<RemovePromoResponse>) => {
        const {value} = call.request;
        if (value) {
            return response(this.removePromoUseCase.execute(value), callback, value => ({value: value}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };
}