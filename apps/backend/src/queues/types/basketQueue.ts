export interface CreateBasketData {
  user_id: string;
}

export interface AddProductToBasketData {
  basket_id: string;
  product_id: string;
}

export interface RemoveProductFromBasketData {
  basket_id: string;
  product_id: string;
}

export interface DeleteBasketData {
  basket_id: string;
}

export type BasketMessage =
  | { event: "create.basket"; data: CreateBasketData }
  | { event: "add.product.basket"; data: AddProductToBasketData }
  | { event: "remove.product.basket"; data: RemoveProductFromBasketData }
  | { event: "delete.basket"; data: DeleteBasketData };
