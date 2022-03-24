import { io } from "../app.js";
import {productsService} from "../services/services.js";

const getAll = async(req,res)=>{
    productsService.getAll()
    .then(result => {
        res.send(result)
    })
}

const getById = async(req,res)=>{
    let id = req.params.pid
    productsService.getBy({id:id})
    .then(result=>{
        res.send(result)
    })
}

const insert = async(req,res)=>{
    let file = req.file
    let product = req.body
    product.thumbnail = req.protocol+"://"+req.hostname+'/images/'+file.filename
    // product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename
    productsService.insert(product)
    .then(result => {
        res.send(result)
        productsService.getAll().then(result => {
            io.emit('deliverProducts', result)
        })
    })
}

const update = async(req,res)=>{
    let body = req.body;
    let id = req.params.pid
    productsService.update(id,body).then(result=>{
        res.send(result);
    })
}

const del = async(req,res)=>{
    let id = req.params.pid
    productsService.delete(id).then(result => {
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