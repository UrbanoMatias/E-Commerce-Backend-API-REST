import express from "express";
import productsController from "../controllers/products.js";
import { uploader } from "../utils.js";

const router = express.Router();

router.get("/", productsController.getAllProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", uploader.array("thumbnail"), productsController.saveProduct);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

export default router;
