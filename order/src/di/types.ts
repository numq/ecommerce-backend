export namespace Types {
    export const app = {
        config: Symbol.for("appConfig"),
        database: Symbol.for("appDatabase"),
        server: Symbol.for("appServer")
    };
    export const order = {
        collection: Symbol.for("orderCollection"),
        repository: Symbol.for("orderRepository"),
        service: Symbol.for("orderService"),
        createOrder: Symbol.for("createOrder"),
        getOrderById: Symbol.for("getOrderById"),
        getCustomerOrders: Symbol.for("getCustomerOrders"),
        updateOrder: Symbol.for("updateOrder"),
        deleteOrder: Symbol.for("deleteOrder")
    };
}