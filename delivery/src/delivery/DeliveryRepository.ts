import {inject, injectable} from "inversify";
import {Collection, ObjectId} from "mongodb";
import {Delivery} from "./Delivery";
import {Types} from "../di/types";
import {taskEither as TE} from "fp-ts";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {DeliveryStatus} from "./DeliveryStatus";

export interface DeliveryRepository {
    createDelivery(delivery: Delivery): TaskEither<Error, string | null>

    getDeliveryById(id: string): TaskEither<Error, Delivery | null>

    getDeliveriesByCourierId(courierId: string, skip: number, limit: number): TaskEither<Error, Delivery[]>

    getDeliveriesByOrderId(orderId: string, skip: number, limit: number): TaskEither<Error, Delivery[]>

    updateDelivery(delivery: Delivery): TaskEither<Error, Delivery | null>

    removeDelivery(id: string): TaskEither<Error, string | null>
}

@injectable()
export class DeliveryRepositoryImpl implements DeliveryRepository {
    constructor(
        @inject(Types.delivery.collection) private readonly collection: Collection<Delivery>
    ) {
    }

    createDelivery = (delivery: Delivery): TaskEither<Error, string | null> => pipe(
        TE.Do,
        TE.bind("id", () => TE.of(new ObjectId())),
        TE.bind("timestamp", () => TE.of(new Date().getTime())),
        TE.chain(({id, timestamp}) => TE.fromTask(() => this.collection.insertOne({
            _id: id,
            id: id.toHexString(),
            orderId: delivery.orderId,
            status: DeliveryStatus.Started,
            details: delivery.details,
            items: delivery.items,
            address: delivery.address,
            courierId: delivery.courierId,
            startedAt: timestamp,
            deliveredBy: delivery.deliveredBy
        }))),
        TE.map(({insertedId}) => insertedId.toHexString())
    );

    removeDelivery = (id: string): TaskEither<Error, string | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndDelete({id: id})),
        TE.map(({value}) => value ? id : null)
    );

    getDeliveriesByCourierId = (courierId: string, skip: number, limit: number): TaskEither<Error, Delivery[]> => pipe(
        TE.fromTask(() => this.collection.find({courierId: courierId}).skip(skip).limit(limit).toArray())
    );

    getDeliveriesByOrderId = (orderId: string, skip: number, limit: number): TaskEither<Error, Delivery[]> => pipe(
        TE.fromTask(() => this.collection.find({orderId: orderId}).skip(skip).limit(limit).toArray())
    );

    getDeliveryById = (id: string): TaskEither<Error, Delivery | null> => pipe(
        TE.fromTask(() => this.collection.findOne({id: id}))
    );

    updateDelivery = (delivery: Delivery): TaskEither<Error, Delivery | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndUpdate({id: delivery.id}, delivery)),
        TE.map(({value}) => value)
    );

}