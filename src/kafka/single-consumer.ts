import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { EventTopic, IKafkaEvent } from "../service-events";

export abstract class KafkaSingleConsumer<Event extends IKafkaEvent> {
  protected kafka: Kafka;
  protected consumer: Consumer;

  abstract topic: Event["topic"];

  abstract onEachMessage(
    message: Event | null,
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
          ? (JSON.parse(message.value.toString()) as Event)
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
