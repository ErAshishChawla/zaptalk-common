import { Kafka, Producer } from "kafkajs";
import { EventTopic, IKafkaEvent } from "../events";

export abstract class KafkaSingleProducer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected producer: Producer;
  protected isConnected: boolean = false;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.producer = kafka.producer();

    Object.setPrototypeOf(this, KafkaSingleProducer.prototype);
  }

  async connectProducer() {
    if (this.isConnected) {
      throw new Error("Producer already connected");
    }

    await this.producer.connect();
    this.isConnected = true;
  }

  async sendMessage(topic: EventTopic, message: Event["payload"]) {
    if (!this.producer) {
      throw new Error("Producer not connected");
    }

    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
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
