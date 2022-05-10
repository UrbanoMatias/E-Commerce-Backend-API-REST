import {productService} from "../services/services.js";

const getAll = async(req,res)=>{
    let products = await productService.getAll();
    res.send({status:"success",payload:products})
}

const getById = async(req,res)=>{
    let id = req.params.pid;
    let product = await productService.getBy({_id:id})
    if(!product) res.status(404).send({status:"error",error:"Not found"})
    res.send({status:"success",payload:product})
}

const insert = async(req,res)=>{
    let file = req.file
    let product = req.body
    // product.thumbnail = req.protocol+"://"+req.hostname+'/images/'+file.filename
    product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename
    productService.insert(product)
    .then(result => {
        res.send(result)
    })
}

const update = async(req,res)=>{
    let body = req.body;
    let id = req.params.pid
    productService.update(id,body).then(result=>{
        res.send(result);
    })
}

const del = async(req,res)=>{
    let id = req.params.pid
    productService.delete(id).then(result => {
        res.send(result)
    })
}

export default {
    getAll,
    getById,
    insert,
    update,
    del
}