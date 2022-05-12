import express from 'express';
import productsController from '../controllers/products.js'
import upload from '../utils/upload.js'

const router = express.Router();

router.get('/',productsController.getAll)
router.get('/:pid',productsController.getById)
router.post('/', upload.single('thumbnail'),productsController.insert)
router.put('/:pid',productsController.update)
router.delete('/:pid',productsController.del)

export default router;