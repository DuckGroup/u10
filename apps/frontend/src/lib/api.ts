import { Product } from "@/types/product";
import { User } from "@/types/user";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3013";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await api.get("/product");
    const products = res.data.data;
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductsByTitle(query: string): Promise<Product[]> {
  try {
    const res = await api.post("/product/by-title", { title: query });
    console.log(res);
    const products = res.data.data;
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error("Error fetching products by title:", error);
    return [];
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const res = await api.get("/users");
    console.log("Users response:", res.data);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
