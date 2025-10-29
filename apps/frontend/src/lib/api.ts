import { Product } from "@/types/product";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3012";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export async function getProducts(): Promise<Product[]> {
  const res = await api.get("/product");
  const products = res.data.data;

  return Array.isArray(products) ? products : [];
}

export async function getProductsByTitle(query: string): Promise<Product[]> {
  const res = await api.post("/product/by-title", { title: query });
  console.log(res);
  const products = res.data.data;
  return Array.isArray(products) ? products : [];
}

export interface OrderStats {
  totalOrders: number;
  activeOrders: number;
  shippingOrders: number;
}

export async function getOrderStats(): Promise<OrderStats> {
  const res = await api.get("/orders/stats");
  return res.data.data;
}