import { Consumer, EachBatchPayload, Kafka } from "kafkajs";

import { EventTopic, IKafkaEvent } from "../events";

export abstract class BatchConsumer<Payload extends IKafkaEvent> {
  protected kafka: Kafka;
  protected consumer: Consumer | null = null;

  abstract topic: Payload["topic"];

  abstract onEachBatch(
    messages: (Payload | null)[],
    kafkaBatch: EachBatchPayload
  ): Promise<void>;

  constructor(kafka: Kafka) {
    this.kafka = kafka;

    Object.setPrototypeOf(this, BatchConsumer.prototype);
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
          message.value
            ? (JSON.parse(message.value.toString()) as Payload)
            : null
        );

        await this.onEachBatch(messages, kafkaBatch);
      },
    });
  }
}
