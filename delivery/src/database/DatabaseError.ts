export namespace DatabaseError {
    export const id = new Error("Unable to create object id");
    export const insert = new Error("Unable to insert document");
    export const findOne = new Error("Unable to find one document");
    export const find = new Error("Unable to find documents");
    export const update = new Error("Unable to update document");
    export const deleteOne = new Error("Unable to delete one document");
    export const deleteMany = new Error("Unable to delete many documents");
}