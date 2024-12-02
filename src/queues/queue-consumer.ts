import { Channel, Connection } from "amqplib";
import { BaseEvent } from "../events";
/**
 * Abstract class representing a queue consumer.
 *
 * @template T - The type of event that extends BaseEvent.
 */
export abstract class QueueConsumer<T extends BaseEvent> {
  /**
   * The connection to the message broker.
   */
  protected connection: Connection;

  /**
   * The channel for communicating with the queue.
   */
  protected channel: Channel | null = null;

  /**
   * The name of the queue to consume messages from.
   */
  abstract queueName: BaseEvent["queue"];

  /**
   * Handles incoming messages from the queue.
   *
   * @param message - The incoming message of type T.
   * @returns A promise that resolves when the message is handled.
   */
  abstract handleIncomingMessage(message: T): Promise<void>;

  /**
   * Creates an instance of QueueConsumer.
   *
   * @param connection - The connection to the message broker.
   */
  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Connects to the queue and creates a channel if it doesn't exist.
   *
   * @returns A promise that resolves to the channel.
   */
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

  /**
   * Starts consuming messages from the queue.
   *
   * @throws Will throw an error if the channel is not connected.
   */
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
