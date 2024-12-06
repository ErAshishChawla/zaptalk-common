import { Kafka, Producer } from "kafkajs";
import { EventTopic, IKafkaEvent } from "../events";

export abstract class KafkaBatchProducer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected producer: Producer;
  protected isConnected: boolean = false;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.producer = kafka.producer();

    Object.setPrototypeOf(this, KafkaBatchProducer.prototype);
  }

  async connectProducer() {
    if (this.isConnected) {
      throw new Error("Producer already connected");
    }

    await this.producer.connect();
    this.isConnected = true;
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

  async disconnectProducer() {
    if (!this.isConnected) {
      throw new Error("Producer not connected");
    }

    await this.producer.disconnect();
    this.isConnected = false;
  }
}
