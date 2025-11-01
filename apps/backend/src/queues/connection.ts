import amqp, { type Channel } from "amqplib";
import { basketHandler } from "./handlers/basketHandler";
import type { BasketMessage } from "./types/basketQueue";
const QUEUE_NAME = process.env.RABBITMQ_QUEUE!;
let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "");
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log("Connected to RabbitMQ");

  connection.on("error", (err) =>
    console.error("RabbitMQ connection error:", err)
  );
  connection.on("close", () => console.log("Disconnected from RabbitMQ"));

  await basketHandler(channel);
};

export const publishToQueue = async (message: { event: string; data: BasketMessage | unknown}) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel not initialized");
    }
    const success = channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    console.log("Message sent to queue:", message);
    return success;
  } catch (error) {
    console.error("Error publishing to queue:", error);
    throw error;
  }
};

export const getChannel = (): Channel | null => channel;
