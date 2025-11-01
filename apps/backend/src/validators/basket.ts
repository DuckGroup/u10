import { z } from 'zod';

export const BasketSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  product_ids: z.array(z.string()), 
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
  order_id: z.string().nullable().optional(),
});

export const CreateBasketSchema = BasketSchema
  .omit({ id: true, createdAt: true, updatedAt: true, order_id: true });

export const UpdateBasketSchema = BasketSchema
  .partial()
  .omit({ user_id: true, id: true })
  .extend({
    product_ids: z.array(z.string()).optional(), // Allow partial updates
  });

export const BasketWithRelationsSchema = BasketSchema.extend({
  // Add relation schemas here when needed
  // user: UserSchema.omit({ baskets: true }),
  // products: z.array(ProductSchema.omit({ baskets: true })),
  // order: OrderSchema.nullable().optional(),
});

// TypeScript types
export type Basket = z.infer<typeof BasketSchema>;
export type CreateBasketInput = z.infer<typeof CreateBasketSchema>;
export type UpdateBasketInput = z.infer<typeof UpdateBasketSchema>;
export type BasketWithRelations = z.infer<typeof BasketWithRelationsSchema>;
