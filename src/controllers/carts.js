import { cartService, productService, userService } from "../services/services.js";
import { createTransport } from 'nodemailer';
import twilio from 'twilio';
import config from "../config/config.js";

const client = twilio(config.twilio.SID,config.twilio.TOKEN)

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.twilio.TWILIO,
        pass: config.twilio.PWD
    }
})

const getCartById = async(req,res) =>{
    let id = req.params.cid;
    let cart = await cartService.getByWithPopulate({_id:id})
    res.send({status:"success",payload:cart})
}

const addProduct = async(req,res)=>{
    let quantityChanged = false;
    let {cid,pid} = req.params;
    let {quantity} = req.body;//3
    //Check if product exists
    let product = await productService.getBy({_id:pid});
    if(!product) return res.status(404).send({status:"error",error:"Product not found"});
    //check if cart exists
    let cart = await cartService.getBy({_id:cid});
    if(!cart) return res.status(404).send({status:"error",error:"Cart not found"});
    //Check product stock
    if(product.stock===0) return res.status(400).send({status:"error",error:"No stock"});
    //Check if requested quantity is greater than product stock
    if(product.stock<quantity){
        quantity=product.stock//3  -> 1
        quantityChanged=true;
    }
    //Remove stock
    product.stock = product.stock - quantity;
    if(product.stock===0)
        product.status="unavailable"
    await productService.update(pid,product);
    //Add product to cart
    cart.products.push({product:pid,quantity});
    await cartService.update(cid,cart);
    res.send({status:"success",quantityChanged,newQuantity:quantity,message:"Product added"})
}

const deleteProductFromCart = async(req,res)=>{
    let {pid,cid} = req.params;
    console.log(pid);
    //Check if cart exists.
    let cart = await cartService.getByWithPopulate({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"Can't find cart"});
    //Check if product exists in the cart
    if(cart.products.some(element=>element.product._id.toString()===pid)){
        //Get product with pid
        let product = await productService.getBy({_id:pid});
        if(!product) return res.status(404).send({status:"error",error:"Product not found"});
        //Get associated product on Cart
        let productInCart = cart.products.find(element=>element.product._id.toString()===pid);
        //Restock actual quantity
        product.stock = product.stock + productInCart.quantity;
        await productService.update(pid,product);
        //Delete product from cart
        cart.products = cart.products.filter(element=>element.product._id.toString()!==pid);
        await cartService.update(cid,cart);
        res.send({status:"success",message:"Product deleted"})
    }else{
        res.status(400).send({error:"Product not found in the cart"})
    }
}

const updateCart = async(req,res)=>{
    let {cid} = req.params;
    let {products} = req.body;
    let stockLimitation = false;
    console.log(products);
    //Check if cart exists
    let cart = await cartService.getBy({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"Can't find cart"});
    //Iterate products array and check availability of each product
    for(const element of cart.products){
        let product = await productService.getBy({_id:element.product});
        //Get the product in actual cart in order to make a comparison between que current quantity and requested quantity
        let associatedProductInCart = cart.products.find(element=>element.product.toString()===product._id.toString());
        //Now get the product in the requested product to check out the quantity
        let associatedProductInInput = products.find(element=>element.product.toString()===product._id.toString());
        if(associatedProductInCart.quantity!==associatedProductInInput.quantity){
            //Ask if the requested quantity is less than the current quantity of the cart
            if(associatedProductInCart.quantity>associatedProductInInput.quantity){
                let difference = associatedProductInCart.quantity - associatedProductInInput.quantity;
                associatedProductInCart.quantity = associatedProductInInput.quantity;
                product.stock+=difference;
                //Restock the product
                await productService.update(product._id,product);
            }else{//I'm requesting to add more quantity of the product, we need to check the stock first
                let difference = associatedProductInInput.quantity - associatedProductInCart.quantity;
                if(product.stock>=difference){//We can add it to the cart
                    product.stock -=difference;
                    await productService.update(product._id,product);
                    associatedProductInCart.quantity = associatedProductInInput.quantity;
                }
                else{//There's no sufficient stock to add to the cart
                    stockLimitation=true;
                    associatedProductInCart.quantity +=product.stock;
                    product.stock=0;
                    await productService.update(product._id,product);
                }
            }
        }
        else{
            console.log("La cantidad para este producto no cambió")
        }
    }
    await cartService.update(cid,cart);
    res.send({status:"success",stockLimitation})
}

const confirm = async(req,res)=>{
    // let userId = req.params.uid
    // let user = await userService.getBy({_id:userId})
    // console.log(user.first_name)
    let {cid} = req.params;
    let cart = await cartService.getBy({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"Can't find cart"});
    cart.products=[];
    await cartService.update(cid,cart);
    res.send({status:"success",message:"Finished purchase!"})
    // try{
    //     let userId = req.params.uid
    //     let user = await userService.getBy({_id:userId})
    //     const mail = {
    //         from:"Online E-commerce <Online E-commerce>",
    //         to: config.twilio.TWILIO,
    //         subject:`nuevo pedido de ${user.first_name} ${user.email}`,
    //         html:`
    //             <h1>Productos a comprar de ${user.first_name} ${user.email}</h1>
    //             <p>${JSON.stringify(user.cart)}</p>
    //         `
    //     }
    //     let emailResult = transport.sendMail(mail)
    //     console.log(emailResult)

    //     let wspResult = await client.messages.create({
    //         from: "whatsapp:+14155238886",
    //         to:"whatsapp:+5491139165275",
    //         body:`nuevo pedido de ${user.first_name} ${user.email}, productos: ${JSON.stringify(user.cart)}`,
    //     })
    //     console.log(wspResult)
    //     res.send({status:"success",message:`Felicitaciones ${user.first_name} su compra fue realizada`})
    // }catch(err){
    //     console.log(err)
    // }
}


export default {
    getCartById,
    addProduct,
    deleteProductFromCart,
    updateCart,
    confirm
}
