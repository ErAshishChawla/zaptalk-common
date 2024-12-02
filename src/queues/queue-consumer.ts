import { Connection, Channel } from "amqplib";
import { BaseEvent } from "../events";

export abstract class QueueConsumer<T extends BaseEvent> {
  protected connection: Connection;
  protected channel: Channel | null = null;
  abstract queueName: BaseEvent["queue"];
  abstract handleIncomingMessage(message: T): Promise<void>;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async connectToQueue() {
    if (!this.channel) {
      const channel = await this.connection.createChannel();
      await channel.assertQueue(this.queueName, {
        durable: true,
      });
      channel.prefetch(1);
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

          const parsedMessage = JSON.parse(message.content.toString()) as T;

          await this.handleIncomingMessage(parsedMessage);

          this.channel.ack(message);
        }
      },
      {
        noAck: false,
      }
    );
  }
}
