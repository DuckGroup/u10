import type { Request, Response } from "express";
import { publishToQueue } from "../queues/connection";
import { getBasketByUserIdService } from "../services/basketService";
import { z } from "zod";
import { isValidObjectId } from "../repositories/validationRepository";
import { prisma } from "../../prisma/prisma";
// add repository for findunique function, check error handling
const addProductSchema = z.object({
  basket_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid basket_id"),
  product_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product_id"),
});

export const createBasket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.params.id;

    if (!user_id) {
      res.status(400).json({
        success: false,
        message: "user_id is required",
      });
      return;
    }

    isValidObjectId(user_id);

    await publishToQueue({
      event: "create.basket",
      data: { user_id },
    });

    res.status(202).json({
      success: true,
      message: "Basket creation queued successfully",
    });
    return;
  } catch (error) {
    console.error("Basket queue connection error:", error);
    res
      .status(
        error instanceof Error && error.message.includes("Invalid object id")
          ? 400
          : 500
      )
      .json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to queue basket creation",
      });
    return;
  }
};

export const deleteBasket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const basket_id = req.params.id;

    if (!basket_id) {
      res.status(400).json({
        success: false,
        message: "basket_id is required",
      });
      return;
    }

    isValidObjectId(basket_id);

    await publishToQueue({
      event: "delete.basket",
      data: { basket_id },
    });

    res.status(202).json({
      success: true,
      message: "Basket deletion queued successfully",
    });
    return;
  } catch (error) {
    console.error("Basket queue connection error:", error);
    res
      .status(
        error instanceof Error && error.message.includes("Invalid object id")
          ? 400
          : 500
      )
      .json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to queue basket deletion",
      });
    return;
  }
};

export const addProductToBasket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = addProductSchema.parse(req.body);

    isValidObjectId(validatedData.basket_id);
    isValidObjectId(validatedData.product_id);

    const basket = await prisma.basket.findUnique({
      where: { id: validatedData.basket_id },
    });

    if (!basket) {
      res.status(404).json({
        success: false,
        message: `Basket with id ${validatedData.basket_id} not found`,
      });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: validatedData.product_id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with id ${validatedData.product_id} not found`,
      });
      return;
    }

    await publishToQueue({
      event: "add.product.basket",
      data: validatedData,
    });

    res.status(202).json({
      success: true,
      message: "Added product successfully to basket",
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.issues,
      });
      return;
    }

    console.error("Basket queue connection error:", error);
    res
      .status(
        error instanceof Error && error.message.includes("Invalid object id")
          ? 400
          : 500
      )
      .json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to queue product addition",
      });
    return;
  }
};

export const removeProductToBasket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = addProductSchema.parse(req.body);

    isValidObjectId(validatedData.basket_id);
    isValidObjectId(validatedData.product_id);

    const basket = await prisma.basket.findUnique({
      where: { id: validatedData.basket_id },
    });

    if (!basket) {
      res.status(404).json({
        success: false,
        message: `Basket with id ${validatedData.basket_id} not found`,
      });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: validatedData.product_id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with id ${validatedData.product_id} not found`,
      });
      return;
    }

    if (!basket.product_ids.includes(validatedData.product_id)) {
      res.status(404).json({
        success: false,
        message: `Product ${validatedData.product_id} not found in basket`,
      });
      return;
    }

    await publishToQueue({
      event: "remove.product.basket",
      data: validatedData,
    });

    res.status(202).json({
      success: true,
      message: "Removed product successfully from basket",
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.issues,
      });
      return;
    }

    console.error("Basket queue connection error:", error);
    res
      .status(
        error instanceof Error && error.message.includes("Invalid object id")
          ? 400
          : 500
      )
      .json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to queue product removal",
      });
    return;
  }
};

export const getBasketByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.params.id;

    if (!user_id) {
      res.status(400).json({
        success: false,
        message: "user_id is required",
      });
      return;
    }

    isValidObjectId(user_id);

    const basket = await getBasketByUserIdService(user_id);

    if (!basket) {
      res.status(404).json({
        success: false,
        message: "Basket not found for this user",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: basket,
      message: "Basket fetched successfully",
    });
    return;
  } catch (error) {
    console.error("Basket fetch error:", error);
    res
      .status(
        error instanceof Error && error.message.includes("Invalid object id")
          ? 400
          : 500
      )
      .json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch basket",
      });
    return;
  }
};
