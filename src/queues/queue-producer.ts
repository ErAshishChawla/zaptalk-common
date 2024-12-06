import { Channel, Connection, ConsumeMessage } from "amqplib";
import { IBaseEvent } from "../events";
import {
  DEFAULT_DELIERY_COUNT,
  DELIVERY_COUNT_HEADER,
} from "./producer-headers";

export abstract class QueueProducer<Event extends IBaseEvent> {
  protected connection: Connection;
  protected channel: Channel | null = null;
  abstract queueName: Event["queue"];

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

  async publish(event: Event) {
    if (!this.channel) {
      throw new Error("Channel not connected");
    }

    this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(event)),
      {
        persistent: true,
        headers: {
          DELIVERY_COUNT_HEADER: DEFAULT_DELIERY_COUNT,
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
