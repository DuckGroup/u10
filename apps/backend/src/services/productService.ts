import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/prisma";
import {
  type CreateProductInput,
  type Product,
  type ProductUpdateData,
} from "../validators/product";

export const createSingleProduct = async (
  data: CreateProductInput
): Promise<Product> => {
  try {
    const existingProduct: Product | null = await prisma.product.findFirst({
      where: { title: data.title },
    });

    if (existingProduct) {
      throw new Error("A product with this title already exists");
    }

    const product = await prisma.product.create({
      data: data,
    });

    return product;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A product with this title already exists");
      }
      if (error.code === "P2025") {
        throw new Error("One or more basket IDs do not exist");
      }
    }
    throw new Error("Failed to create product");
  }
};

export const filterProductsByTitle = async (data: string): Promise<Product[] | null> => {
  try {
    const filteredProduct = await prisma.product.findMany({
      where: {
        title: {
          startsWith: data,
          mode: "insensitive",
        },
      },
    });
    if (!filteredProduct) throw Error("Could not find product");
    return filteredProduct;
  } catch (error) {
    throw Error("Failed to find product");
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const products: Product[] = await prisma.product.findMany();
    return products;
  } catch (error) {
    throw new Error("failed to fetch products from database");
  }
};

export const updateSingleProductDetails = async (
  id: string,
  data: ProductUpdateData
): Promise<Product> => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return updatedProduct;
  } catch (error) {
    throw new Error("failed to update product");
  }
};

export const deleteSingleProduct = (data: string): Promise<Product> => {
  try {
    const deletedProduct = prisma.product.delete({
      where: {
        id: data,
      },
    });
    return deletedProduct;
  } catch (error) {
    throw new Error("failed to delete product");
  }
};
