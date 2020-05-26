import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./controllers/products.ts";

const router = new Router();

router
  .get("/api/v0/products", getProducts)
  .get("/api/v0/products/:id", getProduct)
  .post("/api/v0/products", addProduct)
  .put("/api/v0/products/:id", updateProduct)
  .delete("/api/v0/products/:id", deleteProduct);

export default router;
