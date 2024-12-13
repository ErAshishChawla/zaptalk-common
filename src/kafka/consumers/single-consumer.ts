import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { IEvent } from "../../events";

export abstract class KafkaSingleConsumer<Event extends IEvent> {
  private kafka: Kafka;
  private consumer: Consumer;

  abstract topic: Event["topic"];

  abstract onEachMessage(
    message: Event["payload"] | null,
    kafkaMessage: EachMessagePayload
  ): Promise<void>;

  constructor(kafka: Kafka, groupId: string) {
    this.kafka = kafka;
    this.consumer = kafka.consumer({ groupId });

    Object.setPrototypeOf(this, KafkaSingleConsumer.prototype);
  }

  async connect() {
    await this.consumer.connect();
  }

  async disconnect() {
    await this.consumer.disconnect();
  }

  async consumeMessages() {
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async (kafkaMessage) => {
        const message = kafkaMessage.message;
        const data = message?.value
          ? (JSON.parse(message.value.toString()) as Event["payload"])
          : null;
        await this.onEachMessage(data, kafkaMessage);

        await this.consumer.commitOffsets([
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
