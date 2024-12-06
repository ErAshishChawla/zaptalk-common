import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { EventTopic, IKafkaEvent } from "../events";

export abstract class KafkaSingleConsumer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected consumer: Consumer | null = null;

  abstract topic: Event["topic"];

  abstract onEachMessage(
    message: Event | null,
    kafkaMessage: EachMessagePayload
  ): Promise<void>;

  constructor(kafka: Kafka) {
    this.kafka = kafka;

    Object.setPrototypeOf(this, KafkaSingleConsumer.prototype);
  }

  async connect(groupId: string) {
    if (!this.consumer) {
      const consumer = this.kafka.consumer({ groupId });
      await consumer.connect();
      this.consumer = consumer;

      return this.consumer;
    }

    return this.consumer;
  }

  async subscribe(topic: EventTopic) {
    if (!this.consumer) {
      throw new Error("Consumer not connected");
    }

    await this.consumer.subscribe({ topic, fromBeginning: true });
  }

  async disconnect() {
    if (!this.consumer) {
      throw new Error("Consumer not connected");
    }

    await this.consumer.disconnect();
  }

  async run() {
    if (!this.consumer) {
      throw new Error("Consumer not connected");
    }

    await this.consumer.run({
      eachMessage: async (kafkaMessage) => {
        const message = kafkaMessage.message;
        const data = message?.value
          ? (JSON.parse(message.value.toString()) as Event)
          : null;
        await this.onEachMessage(data, kafkaMessage);

        await this.consumer!.commitOffsets([
          {
            topic: kafkaMessage.topic,
            partition: kafkaMessage.partition,
            offset: (parseInt(kafkaMessage.message.offset, 10) + 1).toString(),
          },
        ]);
      },
    });
  }
}
