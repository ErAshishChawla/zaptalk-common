import { Kafka, Producer } from "kafkajs";
import { EventTopic, IKafkaEvent } from "../events";

export abstract class KafkaBatchProducer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected producer: Producer | null = null;

  constructor(kafka: Kafka) {
    this.kafka = kafka;

    Object.setPrototypeOf(this, KafkaBatchProducer.prototype);
  }

  async connect() {
    if (!this.producer) {
      const producer = this.kafka.producer();
      await producer.connect();
      this.producer = producer;

      return this.producer;
    }

    return this.producer;
  }

  async sendMessage(topic: EventTopic, message: Event["payload"][]) {
    if (!this.producer) {
      throw new Error("Producer not connected");
    }

    const messages = message.map((msg) => ({
      value: JSON.stringify(msg),
    }));

    await this.producer.send({
      topic,
      messages,
    });
  }

  async disconnect() {
    if (!this.producer) {
      throw new Error("Producer not connected");
    }

    await this.producer.disconnect();
  }
}
