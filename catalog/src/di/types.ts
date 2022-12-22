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
        getCatalogItemsByTags: Symbol.for("getCatalogItemsByTags"),
        updateCatalogItem: Symbol.for("updateCatalogItem"),
        removeCatalogItem: Symbol.for("removeCatalogItem")
    };
}