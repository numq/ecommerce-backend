export namespace PromoError {
    export const InsertionFailed = new Error("Failed to insert promo");
    export const NotFound = new Error("Promo not found");
    export const RemovalFailed = new Error("Failed to remove promo");
}