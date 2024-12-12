import { Consumer, EachBatchPayload, Kafka } from "kafkajs";

import { EventTopic, IKafkaEvent } from "../service-events";

export abstract class KafkaBatchConsumer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected consumer: Consumer;

  abstract topic: Event["topic"];

  abstract onEachBatch(
    messages: (Event | null)[],
    kafkaBatch: EachBatchPayload
  ): Promise<void>;

  constructor(kafka: Kafka, groupId: string) {
    this.kafka = kafka;
    this.consumer = kafka.consumer({ groupId });

    Object.setPrototypeOf(this, KafkaBatchConsumer.prototype);
  }

  async connect() {
    await this.consumer.connect();
  }

  async disconnect() {
    await this.consumer.disconnect();
  }

  async consumeBatch() {
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

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
