import { Consumer, EachBatchPayload, Kafka } from "kafkajs";

import { EventTopic, IKafkaEvent } from "../events";

export abstract class KafkaBatchConsumer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected consumer: Consumer | null = null;

  abstract topic: Event["topic"];

  abstract onEachBatch(
    messages: (Event | null)[],
    kafkaBatch: EachBatchPayload
  ): Promise<void>;

  constructor(kafka: Kafka) {
    this.kafka = kafka;

    Object.setPrototypeOf(this, KafkaBatchConsumer.prototype);
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
      eachBatch: async (kafkaBatch) => {
        const messages = kafkaBatch.batch.messages.map((message) =>
          message.value ? (JSON.parse(message.value.toString()) as Event) : null
        );

        await this.onEachBatch(messages, kafkaBatch);

        await this.consumer!.commitOffsets([
          {
            topic: kafkaBatch.batch.topic,
            partition: kafkaBatch.batch.partition,
            offset: (
              parseInt(kafkaBatch.batch.lastOffset(), 10) + 1
            ).toString(),
          },
        ]);
      },
    });
  }
}
