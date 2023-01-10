export namespace Types {
    export const app = {
        config: Symbol.for("config"),
        database: Symbol.for("database"),
        server: Symbol.for("server")
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