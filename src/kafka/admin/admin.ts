import { Admin, Kafka } from "kafkajs";
import { KafkaTopic } from "../../events";

export class KafkaAdmin {
  private kafka: Kafka;
  private admin: Admin;

  private static topics = KafkaTopic;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.admin = kafka.admin();
  }

  async connect() {
    await this.admin.connect();
  }

  async createTopics() {
    await this.admin.createTopics({
      topics: Object.values(KafkaAdmin.topics).map((topic) => ({
        topic,
      })),
    });
  }

  async disconnect() {
    await this.admin.disconnect();
  }
}
