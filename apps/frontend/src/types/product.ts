export type Product = {
  title: string;
  price: number;
  id: string;
  createdAt: string;
  updatedAt: string;
  introduction: string | null;
  body: string | null;
  description: string | null;
  status: boolean | null;
  stock: number | null;
  basket_ids: string[];
};

export type User = {
  id: string;
  email: string;
  role?: "admin" | "user" | "guest";
  auth0Id?: string;
  createdAt: string;
  updatedAt: string;
};
