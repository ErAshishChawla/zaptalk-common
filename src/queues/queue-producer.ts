import { Channel, Connection, ConsumeMessage } from "amqplib";
import { IBaseEvent } from "../events";

export abstract class QueueProducer<T extends IBaseEvent> {
  protected connection: Connection;
  protected channel: Channel | null = null;
  abstract queueName: T["queue"];

  constructor(connection: Connection) {
    this.connection = connection;

    Object.setPrototypeOf(this, QueueProducer.prototype);
  }

  async connectToQueue() {
    if (!this.channel) {
      const channel = await this.connection.createChannel();

      await channel.assertQueue(this.queueName, {
        durable: true,
      });

      this.channel = channel;
      return this.channel;
    }

    return this.channel;
  }

  async publish(event: T) {
    if (!this.channel) {
      throw new Error("Channel not connected");
    }

    this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(event)),
      {
        persistent: true,
        headers: {
          "x-delivery-count": 0,
        },
      }
    );
  }

  async close() {
    if (!this.channel) {
      throw new Error("Channel not connected");
    }

    await this.channel.close();
  }
}
