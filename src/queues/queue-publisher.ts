/**
 * Abstract class representing a queue publisher.
 *
 * This class is responsible for managing the connection to a message queue and
 * publishing events to it. It uses the AMQP protocol to interact with the queue.
 *
 * @template T - The type of event that extends the BaseEvent.
 *
 * @property {Connection} connection - The connection to the message queue.
 * @property {Channel | null} channel - The channel used to communicate with the queue.
 * @property {BaseEvent["queue"]} queueName - The name of the queue to publish events to.
 *
 * @method connectToQueue - Establishes a connection to the queue and asserts its existence.
 * @method publish - Publishes an event to the queue.
 * @method close - Closes the channel to the queue.
 */
import { Connection, Channel } from "amqplib";
import { BaseEvent } from "../events";

export abstract class QueuePublisher<T extends BaseEvent> {
  protected connection: Connection;
  protected channel: Channel | null = null;
  abstract queueName: BaseEvent["queue"];

  constructor(connection: Connection) {
    this.connection = connection;
  }

  // Connect to the queue
  async connectToQueue() {
    if (!this.channel) {
      const channel = await this.connection.createChannel();

      await channel.assertQueue(this.queueName, {
        durable: true,
      });

      return this.channel;
    }

    return this.channel;
  }

  // Publish the message to the queue
  async publish(event: T) {
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

  // Close the connection, this will close the channel, not the connection
  async close() {
    if (this.channel) {
      await this.channel.close();
    }
  }
}
