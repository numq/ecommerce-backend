import {TaskEither} from "fp-ts/TaskEither";
import {Order} from "./Order";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {Collection, ObjectId} from "mongodb";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";

export interface OrderRepository {
    addOrder(order: Order): TaskEither<Error, string | null>

    getOrderById(id: string): TaskEither<Error, Order | null>

    getOrdersByCustomerId(customerId: string): TaskEither<Error, Order[]>

    updateOrder(order: Order): TaskEither<Error, Order | null>

    removeOrder(id: string): TaskEither<Error, string | null>
}

@injectable()
export class OrderRepositoryImpl implements OrderRepository {

    constructor(@inject(Types.order.collection) private readonly collection: Collection<Order>) {
    }

    addOrder = (order: Order): TaskEither<Error, string | null> => pipe(
        TE.Do,
        TE.bind("id", () => TE.of(new ObjectId())),
        TE.bind("timestamp", () => TE.of(new Date().getTime())),
        TE.chain(({id, timestamp}) => TE.fromTask(() => this.collection.insertOne({
            _id: id,
            id: id.toHexString(),
            customerId: order.customerId,
            items: order.items,
            discount: order.discount,
            price: order.price,
            status: order.status,
            creationDate: timestamp,
            deliveryDate: timestamp
        }))),
        TE.map(({insertedId}) => insertedId.toHexString())
    );

    getOrderById = (id: string): TaskEither<Error, Order | null> => pipe(
        TE.fromTask(() => this.collection.findOne({id: id}))
    );

    getOrdersByCustomerId = (customerId: string): TaskEither<Error, Order[]> => pipe(
        TE.fromTask(() => this.collection.find({customerId: customerId}).toArray())
    );

    removeOrder = (id: string): TaskEither<Error, string | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndDelete({id: id})),
        TE.map(({value}) => value ? id : null)
    );

    updateOrder = (order: Order): TaskEither<Error, Order | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndUpdate({id: order.id}, order)),
        TE.map(({value}) => value)
    );
}