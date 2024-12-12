import { Kafka } from "kafkajs";
import { EventTopic } from "../service-events";

export class KafkaAdminSetup {
  constructor(private kafka: Kafka) {
    this.kafka = kafka;
  }

  async createTopics(topics: EventTopic[]) {
    const admin = this.kafka.admin();
    await admin.connect();

    await admin.createTopics({
      topics: topics.map((topic) => ({ topic })),
    });

    await admin.disconnect();
  }
}
