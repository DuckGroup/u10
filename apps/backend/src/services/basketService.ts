import { type Basket, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/prisma";
import { isValidObjectId } from "../repositories/validationRepository";

export const createBasketService = async (user_id: string): Promise<Basket> => {
  try {
    isValidObjectId(user_id);

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new Error(`User with id ${user_id} not found`);
    }

    const existingBasket = await prisma.basket.findUnique({
      where: { user_id },
    });

    if (existingBasket) {
      throw new Error(`Basket already exists for user ${user_id}`);
    }

    const basket = await prisma.basket.create({
      data: {
        user_id: user_id,
        product_ids: [],
      },
    });

    console.log(`Created basket ${basket.id} for user ${user_id}`);
    return basket;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(`Basket already exists for user ${user_id}`);
      }
    }
    throw error instanceof Error ? error : new Error("Failed to create basket");
  }
};

export const getBasketByUserIdService = async (
  user_id: string
): Promise<Basket | null> => {
  try {
    isValidObjectId(user_id);

    const basket = await prisma.basket.findUnique({
      where: { user_id },
      include: {
        products: true,
        user: true,
      },
    });

    return basket;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch basket");
  }
};

export const deleteBasketService = async (
  basket_id: string
): Promise<Basket> => {
  try {
    isValidObjectId(basket_id);

    const deletedBasket = await prisma.basket.delete({
      where: { id: basket_id },
    });

    console.log(`Deleted basket ${basket_id}`);
    return deletedBasket;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error(`Basket with id ${basket_id} not found`);
      }
    }
    throw error instanceof Error ? error : new Error("Failed to delete basket");
  }
};

export const addProductToBasketService = async (
  basket_id: string,
  product_id: string
): Promise<Basket> => {
  try {
    isValidObjectId(basket_id);
    isValidObjectId(product_id);

    const basket = await prisma.basket.findUnique({
      where: { id: basket_id },
    });

    if (!basket) {
      throw new Error(`Basket with id ${basket_id} not found`);
    }

    if (basket.product_ids.includes(product_id)) {
      console.log(`Product ${product_id} already in basket ${basket_id}`);
      return basket;
    }

    const updatedBasket = await prisma.basket.update({
      where: { id: basket_id },
      data: {
        product_ids: {
          push: product_id,
        },
      },
      include: {
        products: true,
      },
    });

    console.log(`Added product ${product_id} to basket ${basket_id}`);
    return updatedBasket;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Basket or product not found");
      }
    }
    throw error instanceof Error
      ? error
      : new Error("Failed to add product to basket");
  }
};

export const removeProductFromBasketService = async (
  basket_id: string,
  product_id: string
): Promise<Basket> => {
  try {
    isValidObjectId(basket_id);
    isValidObjectId(product_id);

    const basket = await prisma.basket.findUnique({
      where: { id: basket_id },
    });

    if (!basket) {
      throw new Error(`Basket with id ${basket_id} not found`);
    }

    if (!basket.product_ids.includes(product_id)) {
      throw new Error(`Product ${product_id} not found in basket ${basket_id}`);
    }

    const updatedProductIds = basket.product_ids.filter(
      (id) => id !== product_id
    );

    const updatedBasket = await prisma.basket.update({
      where: { id: basket_id },
      data: {
        product_ids: updatedProductIds,
      },
      include: {
        products: true,
      },
    });

    console.log(`Removed product ${product_id} from basket ${basket_id}`);
    return updatedBasket;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error(`Basket with id ${basket_id} not found`);
      }
    }
    throw error instanceof Error
      ? error
      : new Error("Failed to remove product from basket");
  }
};
