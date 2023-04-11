import { Router } from "../../depts.ts";
import { findProducts, findProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.ts";

export const productRouter = new Router()
.get("/productos", findProducts)
.get("/productos/:id", findProductById)
.post("/productos", createProduct)
.put("/productos/:id", updateProduct)
.delete("/productos/:id", deleteProduct)