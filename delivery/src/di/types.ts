export namespace Types {
    export const app = {
        config: Symbol.for("config"),
        database: Symbol.for("database"),
        server: Symbol.for("server")
    };
    export const delivery = {
        collection: Symbol.for("deliveryCollection"),
        repository: Symbol.for("deliveryRepository"),
        service: Symbol.for("deliveryService"),
        startDelivery: Symbol.for("startDelivery"),
        getDeliveryById: Symbol.for("getDeliveryById"),
        getDeliveriesByCourierId: Symbol.for("getDeliveriesByCourierId"),
        getDeliveriesByOrderId: Symbol.for("getDeliveriesByOrderId"),
        updateDelivery: Symbol.for("updateDelivery"),
        completeDelivery: Symbol.for("completeDelivery"),
        cancelDelivery: Symbol.for("cancelDelivery"),
        removeDelivery: Symbol.for("removeDelivery")
    };
}