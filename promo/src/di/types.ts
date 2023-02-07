export namespace Types {
    export const app = {
        config: Symbol.for("config"),
        store: Symbol.for("store"),
        server: Symbol.for("server")
    };
    export const promo = {
        repository: Symbol.for("promoRepository"),
        service: Symbol.for("promoService"),
        insertPromo: Symbol.for("insertPromo"),
        getPromo: Symbol.for("getPromo"),
        removePromo: Symbol.for("removePromo")
    };
}