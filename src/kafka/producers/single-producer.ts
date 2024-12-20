import { Kafka, Producer } from "kafkajs";
import { KafkaTopic, IEvent } from "../../events";

// A Producer can send messages to multiple topics
// A consumer can only consume messages from a single topic

export abstract class KafkaSingleProducer<Event extends IEvent> {
  private kafka: Kafka;
  private producer: Producer;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.producer = kafka.producer();

    Object.setPrototypeOf(this, KafkaSingleProducer.prototype);
  }

  async connect() {
    await this.producer.connect();
  }

  async sendMessage(topic: KafkaTopic, message: Event["payload"]) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
