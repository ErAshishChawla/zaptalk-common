import { Kafka, Producer } from "kafkajs";
import { KafkaTopic, IKafkaEvent } from "../service-events";

// A Producer can send messages to multiple topics
// A consumer can only consume messages from a single topic

export abstract class KafkaBatchProducer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected producer: Producer;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.producer = kafka.producer();

    Object.setPrototypeOf(this, KafkaBatchProducer.prototype);
  }

  async connect() {
    await this.producer.connect();
  }

  async sendMessage(topic: KafkaTopic, message: Event["message"][]) {
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
    await this.producer.disconnect();
  }
}
