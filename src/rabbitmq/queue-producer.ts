import { Channel, Connection, ConsumeMessage } from "amqplib";
import { IEvent } from "../events";

export abstract class RMQQueueProducer<Event extends IEvent> {
  protected connection: Connection;
  protected channel: Channel | null = null;
  abstract queueName: Event["queue"];

  constructor(connection: Connection) {
    this.connection = connection;

    Object.setPrototypeOf(this, RMQQueueProducer.prototype);
  }

  async connect() {
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

  async publish(event: Event) {
    if (!this.channel) {
      throw new Error("Channel not connected");
    }

    this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(event)),
      {
        persistent: true,
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
