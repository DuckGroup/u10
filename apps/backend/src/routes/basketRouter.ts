import { Router } from "express";
import { addProductToBasket, createBasket, deleteBasket, getBasketByUserId, removeProductToBasket } from "../controllers/basketController";
const basketRouter = Router();

basketRouter.post("/:id", createBasket)
basketRouter.post("/add-product", addProductToBasket)
basketRouter.get("/:id", getBasketByUserId)
basketRouter.delete("/remove-product", removeProductToBasket)
basketRouter.delete("/:id", deleteBasket)

export default basketRouter;
 