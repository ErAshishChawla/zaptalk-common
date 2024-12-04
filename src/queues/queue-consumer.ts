import { Channel, Connection, ConsumeMessage } from "amqplib";
import { IBaseEvent } from "../events";
export abstract class QueueConsumer<T extends IBaseEvent> {
  protected connection: Connection;
  protected channel: Channel | null = null;

  abstract queueName: T["queue"];

  abstract onMessage(data: T, msg: ConsumeMessage): Promise<void>;

  constructor(connection: Connection) {
    this.connection = connection;

    Object.setPrototypeOf(this, QueueConsumer.prototype);
  }

  async connectToQueue() {
    if (!this.channel) {
      const channel = await this.connection.createChannel();

      await channel.assertQueue(this.queueName, {
        durable: true,
      });
      channel.prefetch(1);

      this.channel = channel;
      return this.channel;
    }

    return this.channel;
  }

  async consume() {
    if (!this.channel) {
      throw new Error("Channel not connected");
    }

    this.channel.consume(
      this.queueName,
      async (message) => {
        if (message && this.channel) {
          console.log(
            `${
              this.queueName
            } - Received message: ${message.content.toString()}`
          );

          // Update the delivery count
          if (message.properties.headers) {
            const deliveryCount = message.properties.headers[
              "x-delivery-count"
            ] as number;

            // Update the delivery count
            message.properties.headers["x-delivery-count"] = deliveryCount + 1;
          }

          const parsedMessage = JSON.parse(message.content.toString()) as T;

          await this.onMessage(parsedMessage, message);
        }
      },
      {
        noAck: false,
      }
    );
  }
}
