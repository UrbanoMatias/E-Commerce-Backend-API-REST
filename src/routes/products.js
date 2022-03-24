import express from 'express';
import productsController from '../controllers/products.js'
import upload from '../services/upload.js';
const router = express.Router();


//GETS
router.get('/',productsController.getAll)
router.get('/:pid',productsController.getById)

//POSTS
router.post('/', upload.single('image'),productsController.insert)

//PUTS
router.put('/:pid',productsController.update)

//DELETES
router.delete('/:pid',productsController.del)

export default router;