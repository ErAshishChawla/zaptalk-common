import { Kafka, Producer } from "kafkajs";
import { EventTopic, IKafkaEvent } from "../events";

export abstract class KafkaSingleProducer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected producer: Producer;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.producer = kafka.producer();

    Object.setPrototypeOf(this, KafkaSingleProducer.prototype);
  }

  async connectProducer() {
    await this.producer.connect();
  }

  async sendMessage(topic: EventTopic, message: Event["payload"]) {
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
    await this.producer.disconnect();
  }
}
