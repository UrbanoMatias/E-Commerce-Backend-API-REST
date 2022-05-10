import express from 'express';
import productsController from '../controllers/products.js'
import { uploader } from "../utils/uploader.js"

const router = express.Router();

router.get('/',productsController.getAll)
router.get('/:pid',productsController.getById)
router.post('/', uploader.single('thumbnail'),productsController.insert)
router.put('/:pid',productsController.update)
router.delete('/:pid',productsController.del)

export default router;