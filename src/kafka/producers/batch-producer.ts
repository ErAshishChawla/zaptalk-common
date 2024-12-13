import { Kafka, Producer } from "kafkajs";
import { KafkaTopic, IEvent } from "../../events";

// A Producer can send messages to multiple topics
// A consumer can only consume messages from a single topic

export abstract class KafkaBatchProducer<Event extends IEvent> {
  private kafka: Kafka;
  private producer: Producer;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.producer = kafka.producer();

    Object.setPrototypeOf(this, KafkaBatchProducer.prototype);
  }

  async connect() {
    await this.producer.connect();
  }

  async sendMessage(topic: KafkaTopic, message: Event["payload"][]) {
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
