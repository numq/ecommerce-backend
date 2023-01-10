export namespace Types {
    export const app = {
        config: Symbol.for("config"),
        store: Symbol.for("store"),
        server: Symbol.for("server")
    };
    export const cart = {
        repository: Symbol.for("cartRepository"),
        service: Symbol.for("cartService"),
        getCart: Symbol.for("getCart"),
        clearCart: Symbol.for("clearCart"),
        increaseItemQuantity: Symbol.for("increaseItemQuantity"),
        decreaseItemQuantity: Symbol.for("decreaseItemQuantity")
    };
}