import { type Basket, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/prisma";

export const isValidObjectId = (id: string): boolean => {
  const test_id = /^[0-9a-fA-F]{24}$/.test(id);

  if (!test_id) {
    throw new Error(`Invalid object id format: ${id}`);
  }
  return test_id;
};
