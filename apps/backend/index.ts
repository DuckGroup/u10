import express from "express";
import { auth, requiresAuth } from "express-openid-connect";
import { connectDB, prisma } from "./db";
import dotenv from "dotenv";
import productRouter from "./src/routes/productRoutes";
import userRouter from "./src/routes/userRoutes";
import authRouter from "./src/routes/authRoutes";
import orderRouter from "./src/routes/orderRoutes";
import basketRouter from "./src/routes/basketRouter";
import cors from "cors";
import { connectRabbitMQ } from "./src/queues/connection";

dotenv.config();
connectDB();
const app = express();
const port = parseInt(process.env.PORT || "3013", 10);
const ALLOWED = process.env.ALLOWED_ORIGIN!;
const host = "0.0.0.0";

app.use(express.json());
connectRabbitMQ();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedList = ALLOWED.split(",").map((s) => s.trim());
      if (ALLOWED === "*" || allowedList.includes(origin))
        return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    exposedHeaders: ["Content-Range", "X-Total-Count"],
  })
);
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};
app.use(auth(config));

app.use("/users", userRouter);
app.use("/product", productRouter);
app.use("/orders", orderRouter)
app.use("/auth", authRouter);

app.use("/basket", basketRouter);
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
