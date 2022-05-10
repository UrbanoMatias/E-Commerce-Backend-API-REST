import express from 'express';
import cartController from '../controllers/carts.js'

const router = express.Router();
router.post('/purchase/:cid',cartController.confirm);
router.get('/:cid',cartController.getCartById)
router.put('/:cid/',cartController.updateCart)
router.post('/:cid/products/:pid',cartController.addProduct)
router.delete('/:cid/products/:pid',cartController.deleteProductFromCart)

export default router;

// import express from 'express'
// import cartController from '../controllers/carts.js';

// const router = express.Router();


// //POSTS
// router.post('/',cartController.save)
// router.post('/:cid/product',cartController.add)


// //DELETES
// router.delete('/:cid',cartController.del)
// router.delete('/:cid/product/:pid',cartController.delCartbyId)


// //GETS
// router.get('/:cid/product',cartController.getProductByCart)
// router.get('/',cartController.getCarts)
// router.get('/:cid',cartController.getCartById)
// router.get('/:uid/confirm',cartController.confirm)

// export default router