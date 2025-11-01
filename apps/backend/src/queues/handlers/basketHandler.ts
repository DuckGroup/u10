import type { Channel } from "amqplib";
import {
  addProductToBasketService,
  createBasketService,
  deleteBasketService,
  removeProductFromBasketService,
} from "../../services/basketService";
import type { BasketMessage } from "../types/basketQueue";

const QUEUE_NAME = process.env.RABBITMQ_QUEUE!;

export const basketHandler = async (channel: Channel): Promise<void> => {
  if (!channel) {
    throw new Error("Channel is not initialized");
  }

  await channel.consume(
    QUEUE_NAME,
    async (payload) => {
      if (!payload) return;

      try {
        const message: BasketMessage = JSON.parse(payload.content.toString());
        console.log("Received message:", message.event);

        switch (message.event) {
          case "create.basket":
            await createBasketService(message.data.user_id);
            console.log("Basket created successfully");
            break;
          case "add.product.basket":
            await addProductToBasketService(
              message.data.basket_id,
              message.data.product_id
            );
            console.log("Product successfully added to basket");
            break;
          case "remove.product.basket":
            await removeProductFromBasketService(
              message.data.basket_id,
              message.data.product_id
            );
            console.log("Product successfully removed from basket");
            break;
          case "delete.basket":
            await deleteBasketService(message.data.basket_id);
            console.log("Basket deleted successfully");
            break;

          default:
            console.warn(`Unknown event type`);
            break;
        }

        channel?.ack(payload);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error processing message:", error.message);
          channel?.nack(payload, false, false);
        }
      }
    },
    { noAck: false }
  );
};
