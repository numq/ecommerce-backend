export namespace Types {
    export const app = {
        config: Symbol.for("appConfig"),
        database: Symbol.for("appDatabase"),
        server: Symbol.for("appServer")
    };
    export const catalog = {
        collection: Symbol.for("catalogCollection"),
        repository: Symbol.for("catalogRepository"),
        service: Symbol.for("catalogService"),
        addCatalogItem: Symbol.for("addCatalogItem"),
        getCatalogItemById: Symbol.for("getCatalogItemById"),
        getCatalogItemsByCategory: Symbol.for("getCatalogItemsByCategory"),
        getCatalogItemsByTag: Symbol.for("getCatalogItemsByTag"),
        updateCatalogItem: Symbol.for("updateCatalogItem"),
        removeCatalogItem: Symbol.for("removeCatalogItem")
    };
}