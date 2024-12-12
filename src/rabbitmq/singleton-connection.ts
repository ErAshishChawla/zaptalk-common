import ampq, { Connection } from "amqplib";

export class RabbitMQConnection {
  static instance: Connection | null = null;

  private constructor() {}

  static getInstance() {
    if (!RabbitMQConnection.instance) {
      throw new Error("RabbitMQ connection not initialized");
    }

    return RabbitMQConnection.instance;
  }

  static async connect(url: string) {
    if (!RabbitMQConnection.instance) {
      const connection = await ampq.connect(url);
      RabbitMQConnection.instance = connection;
      return RabbitMQConnection.instance;
    }

    throw new Error("RabbitMQ connection already initialized");
  }

  static async disconnect() {
    if (RabbitMQConnection.instance) {
      await RabbitMQConnection.instance.close();
      RabbitMQConnection.instance = null;
    }

    throw new Error("No RabbitMQ connection to close");
  }
}
