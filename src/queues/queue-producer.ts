import { Connection, Channel } from "amqplib";
import { BaseEvent } from "../events";

/**
 * Abstract class representing a queue publisher.
 * This class is responsible for connecting to a queue and publishing messages to it.
 *
 * @template T - The type of event that extends BaseEvent.
 */
export abstract class QueueProducer<T extends BaseEvent> {
  protected connection: Connection;
  protected channel: Channel | null = null;
  abstract queueName: T["queue"];

  /**
   * Creates an instance of QueuePublisher.
   *
   * @param connection - The connection to the message broker.
   */
  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Connects to the queue. If the channel is not already created, it creates a new channel
   * and asserts the queue with the specified name.
   *
   * @returns The channel connected to the queue.
   */
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

  /**
   * Publishes the message to the queue.
   *
   * @param event - The event to be published to the queue.
   * @throws Will throw an error if the channel is not connected.
   */
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

  /**
   * Closes the channel. This will not close the connection.
   */
  async close() {
    if (this.channel) {
      await this.channel.close();
    }
  }
}
