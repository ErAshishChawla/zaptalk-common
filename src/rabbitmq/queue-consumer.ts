import { Channel, Connection, ConsumeMessage } from "amqplib";
import { IEvent } from "../events";

export abstract class RMQQueueConsumer<Event extends IEvent> {
  protected connection: Connection;
  protected channel: Channel | null = null;

  abstract queueName: Event["queue"];

  abstract onMessage(data: Event, msg: ConsumeMessage): Promise<void>;

  constructor(connection: Connection) {
    this.connection = connection;

    Object.setPrototypeOf(this, RMQQueueConsumer.prototype);
  }

  async connect() {
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

          const parsedMessage = JSON.parse(message.content.toString()) as Event;

          await this.onMessage(parsedMessage, message);
        }
      },
      {
        noAck: false,
      }
    );
  }
}
