"use client";
import "./globals.css";
import { Header } from "./components/header";
import { useEffect, useState } from "react";
import { getProducts, getProductsByTitle, getUsers } from "@/lib/api";
import { Product } from "@/types/product";
import { User } from "@/types/user";
import { ProductDisplay } from "./components/products/productDisplay";
import { SearchBar } from "./components/searchBar";
import { UserTable } from "./components/admin/usertable";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error: unknown) {
        console.error("Failed to fetch products:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        console.log("Fetched users in page:", data);
        setUsers(data);
      } catch (error: unknown) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <main>
      <Header></Header>
      <section className="bg-secondary h-96 flex items-center p-4">
        <h1 className="font-medium">
          <span className="text-primary">New</span> season.
          <br />
          Never known <span className="text-primary">designs</span>.
        </h1>
      </section>
      <section className="p-4">
        <SearchBar
          onSearch={async (query) => {
            try {
              const result = await getProductsByTitle(query);
              console.log(result);
              setProducts(result ?? []);
            } catch (error: unknown) {
              console.error("Search failed:", error);
              setProducts([]);
            }
          }}
          placeholder="search..."
        />
      </section>
      <ProductDisplay products={products} />
      <UserTable users={users} />
    </main>
  );
}
