export namespace Types {
    export const app = {
        config: Symbol.for("appConfig"),
        cache: Symbol.for("appCache"),
        server: Symbol.for("appServer")
    };
    export const cart = {
        repository: Symbol.for("cartRepository"),
        service: Symbol.for("cartService"),
        getItems: Symbol.for("getItems"),
        addItem: Symbol.for("addItem"),
        updateItem: Symbol.for("updateItem"),
        removeItem: Symbol.for("removeItem"),
        clearCart: Symbol.for("clearCart")
    };
}