import amqp, { type Channel } from "amqplib";


let channel: Channel | null = null;
const exchange_value = process.env.ECOMMERCE_EXCHANGE!;
const queue_url = process.env.RABBITMQ_URL!;
const queue = process.env.RABBITMQ_QUEUE!; 

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(queue_url);
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log("RabbitMQ connected");
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    process.exit(1);
  }
}

export async function publishToQueue(message: unknown) {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}
