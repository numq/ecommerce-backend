export namespace Types {
    export const app = {
        config: Symbol.for("appConfig"),
        database: Symbol.for("appDatabase"),
        server: Symbol.for("appServer")
    };
    export const category = {
        collection: Symbol.for("categoryCollection"),
        repository: Symbol.for("categoryRepository"),
        service: Symbol.for("categoryService"),
        addCategory: Symbol.for("addCategory"),
        getCategoryById: Symbol.for("getCategoryById"),
        getCategories: Symbol.for("getCategories"),
        updateCategory: Symbol.for("updateCategory"),
        removeCategory: Symbol.for("removeCategory")
    };
}