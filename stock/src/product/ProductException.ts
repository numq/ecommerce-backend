import {Exception} from "../exception/Exception";

export namespace ProductException {
    export const insert = new Exception("Insert product exception");
    export const getById = new Exception("Get product by id exception");
    export const getFromCategory = new Exception("Get products from category exception");
    export const update = new Exception("Update product exception");
    export const remove = new Exception("Remove product exception");
}