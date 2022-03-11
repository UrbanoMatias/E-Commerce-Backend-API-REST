import express from 'express';
import { io } from '../app.js';
import { productsService } from '../services/services.js';
import upload from '../services/upload.js';
const router = express.Router();


//GETS
router.get('/', async (req, res) => {
    productsService.getAll()
    .then(result => {
        res.send(result)
    })
})

router.get('/:pid', (req, res) => {
    let id = req.params.pid
    productsService.getBy({id:id})
    .then(result=>{
        res.send(result)
    })
})

//POSTS

router.post('/', upload.single('image'), (req, res) => {
    let file = req.file
    let product = req.body
    product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename
    productsService.insert(product)
    .then(result => {
        res.send(result)
        productsService.getAll().then(result => {
            io.emit('deliverProducts', result)
        })
    })

})

//PUTS
router.put('/:pid', (req,res) => {
    let body = req.body;
    let id = req.params.pid
    productsService.update(id,body).then(result=>{
        res.send(result);
    })
})

//DELETES
router.delete('/:pid', (req,res) => {
    let id = req.params.pid
    productsService.delete(id).then(result => {
        res.send(result)
    })
})

export default router;