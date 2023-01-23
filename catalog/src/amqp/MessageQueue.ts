import {inject, injectable} from "inversify";
import client, {Channel, Connection} from "amqplib";
import {Types} from "../di/types";
import {Config} from "../config/Config";

@injectable()
export class MessageQueue {

    constructor(@inject(Types.app.config) private readonly config: Config) {
    }

    private connection: Connection | null = null;
    private channels: Map<String, Channel> = new Map();

    connect = () => client.connect(this.config.AMQP_URL).then(connection => {
        console.log(`Connected to message queue: ${this.config.AMQP_URL}`);
        this.connection = connection
    }).catch(console.error);

    disconnect = () => this.connection?.close().then(() => {
        console.log(`Disconnected from message queue: ${this.config.AMQP_URL}`);
        this.connection = null;
    }).catch(console.error);

    openChannel = (name: string) => this.connection?.createChannel().then(channel => {
        this.channels.set(name, channel);
    });

    closeChannel = (name: string) => this.channels.get(name)?.close().then(() => {
        this.channels.delete(name);
    });

    useChannel = (name: string): Channel | null => {
        const channel = this.channels.get(name);
        return channel ? channel : null;
    };

}