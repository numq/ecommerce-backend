import "reflect-metadata";
import {injectable} from "inversify";
import * as dotenv from "dotenv";

@injectable()
export class ConfigProvider {
    constructor() {
        dotenv.config();
    }
}