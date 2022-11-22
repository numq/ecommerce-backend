import {Exception} from "../exception/Exception";

export namespace CategoryException {
    export const insert = new Exception("Insert category exception");
    export const getById = new Exception("Get category by id exception");
    export const get = new Exception("Get categories exception");
    export const update = new Exception("Update category exception");
    export const remove = new Exception("Remove category exception");
}