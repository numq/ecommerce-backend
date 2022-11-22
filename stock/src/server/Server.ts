import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {Config} from "../config/Config";
import {Server as GrpcServer, ServerCredentials} from "@grpc/grpc-js";
import {ProductServiceServer} from "../generated/product";

@injectable()
export class Server {
    constructor(
        @inject(Types.app.config) private readonly config: Config,
        @inject(Types.product.service) private readonly productService: ProductServiceServer
    ) {
    }

    launch(bind: (server: GrpcServer) => void) {
        const server: GrpcServer = new GrpcServer();
        bind(server);
        server.bindAsync(this.config.SERVER_URL, ServerCredentials.createInsecure(), (error, port) => {
            if (error) console.error(error);
            server.start();
            console.log(`Server running on port: ${port}`);
        });
    };
}