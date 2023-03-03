import {
  cartService,
  productService,
  userService,
} from "../services/services.js";
import { createTransport } from "nodemailer";
import twilio from "twilio";
import config from "../config/config.js";

const client = twilio(config.twilio.SID, config.twilio.TOKEN);

const transport = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.twilio.TWILIO,
    pass: config.twilio.PWD,
  },
});

const getCartById = async (req, res) => {
  let id = req.params.cid;
  let cart = await cartService.getByWithPopulate({ _id: id });
  res.send({ status: "success", payload: cart });
};

const addProduct = async (req, res) => {
  let quantityChanged = false;
  let { cid, pid } = req.params;
  let { quantity } = req.body;
  let product = await productService.getBy({ _id: pid });
  if (!product)
    return res
      .status(404)
      .send({ status: "error", error: "Product not found" });
  let cart = await cartService.getBy({ _id: cid });
  if (!cart)
    return res.status(404).send({ status: "error", error: "Cart not found" });
  if (quantity > product.stock) {
    quantity = product.stock; //3  -> 1
    quantityChanged = true;
  }
  if (product.stock === 0) {
    return;
  } else {
    cart.products.push({ product: pid, quantity });
    await cartService.update(cid, cart);
    res.send({
      status: "success",
      quantityChanged,
      newQuantity: quantity,
      message: "Product added",
    });
  }
  // if(product.stock<quantity){
  //     quantity=product.stock
  //     quantityChanged=true;
  // }
  // product.stock = product.stock - quantity;
  // if(product.stock===0)
  //     product.status="unavailable"
  // await productService.update(pid,product);
};

const deleteProductFromCart = async (req, res) => {
  let { pid, cid } = req.params;
  console.log(pid);
  let cart = await cartService.getByWithPopulate({ _id: cid });
  if (!cart)
    return res.status(404).send({ status: "error", error: "Can't find cart" });
  if (cart.products.some((element) => element.product._id.toString() === pid)) {
    let product = await productService.getBy({ _id: pid });
    if (!product)
      return res
        .status(404)
        .send({ status: "error", error: "Product not found" });
    let productInCart = cart.products.find(
      (element) => element.product._id.toString() === pid
    );
    // product.stock = product.stock + productInCart.quantity;
    // await productService.update(pid,product);
    cart.products = cart.products.filter(
      (element) => element.product._id.toString() !== pid
    );
    await cartService.update(cid, cart);
    res.send({ status: "success", message: "Product deleted" });
  } else {
    res.status(400).send({ error: "Product not found in the cart" });
  }
};

const updateCart = async (req, res) => {
  let { cid } = req.params;
  let { products } = req.body;
  let productOutStock = false;
  //Check if cart exists
  let cart = await cartService.getBy({ _id: cid });
  if (!cart)
    return res.status(404).send({ status: "error", error: "Can't find cart" });
  //Iterate products array and check availability of each product
  for (const element of cart.products) {
    let product = await productService.getBy({ _id: element.product });
    //Get the product in actual cart in order to make a comparison between current quantity and requested quantity
    let associatedProductInCart = cart.products.find(
      (element) => element.product.toString() === product._id.toString()
    );
    //Now get the product in the requested product to check out the quantity
    let associatedProductInInput = products.find(
      (element) => element.product.toString() === product._id.toString()
    );
    //I'm requesting to add more quantity of the product, we need to check the stock first
    let difference =
      associatedProductInInput.quantity - associatedProductInCart.quantity;
    if (product.stock >= difference) {
      //We can add it to the cart
      product.stock -= difference;
      associatedProductInCart.quantity = associatedProductInInput.quantity;
    } else {
      //There's no sufficient stock to add to the cart
      productOutStock = product._id;
      associatedProductInCart.quantity += product.stock;
    }
  }
  await cartService.update(cid, cart);
  res.send({ status: "success", productOutStock });
};

const confirm = async (req, res) => {
  let { cid } = req.params;
  let cart = await cartService.getBy({ _id: cid });
  if (!cart)
    return res.status(404).send({ status: "error", error: "Can't find cart" });
  let user = await userService.getBy({ cart: cid });
  if (!user) res.status(404).send({ status: "error", error: "Not found" });
  let cartPopulate = await cartService.getByWithPopulate({ _id: cid });
  let productsInCart = await cartPopulate.products.map((prod) => prod.product);
  // let productsInCartIds = productsInCart.map((prod) => prod._id);
  // let quantity = cartPopulate.products.map((quant) => quant.quantity);
  for (const element of cart.products) {
    let product = await productService.getBy({ _id: element.product });
    let associatedProductInCart = cart.products.find(
      (element) => element.product.toString() === product._id.toString()
    );

    if (product.stock >= associatedProductInCart.quantity) {
      product.stock = product.stock - associatedProductInCart.quantity;
      if (product.stock === 0) product.status = "unavailable";
      await productService.update(product._id, product);
    }
  }

  // //Check if product exists
  // let product = await productService.getBy({ _id: productsInCartIds });
  // if (!product)
  //   return res
  //     .status(404)
  //     .send({ status: "error", error: "Product not found" });

  // if (product.stock === 0)
  //   return res.status(400).send({ status: "error", error: "No stock" });
  // //Check if requested quantity is greater than product stock
  // if (product.stock < quantity) {
  //   quantity = product.stock; //3  -> 1
  //   quantityChanged = true;
  // }
  // //Remove stock
  // product.stock = product.stock - quantity;
  // if (product.stock === 0) product.status = "unavailable";
  // await productService.update(product._id, product);
  // console.log(quantity);
  // console.log(productsInCart);
  // console.log(productsInCartIds);
  //console.log(productsInCart);

  // Metodo de confirmarcion de compra utilizando TWILIO, Lo tengo desabilitado debido a las politicas de twilio
  // de cambiar el token del usuario en la free tryal, lo cual hace que se tenga que estar renobando a cada tiempo
  // const mail = {
  //             from:"Online E-commerce <Online E-commerce>",
  //             to: process.env.TWILIO_USER,
  //             subject:`nuevo pedido de ${user.email}`,
  //             html:`

  //                 <h1>Productos comprados de ${user.first_name} ${user.last_name}: </h1>
  //                 ${productsInCart.map(prod => `
  //                                 <h2>${prod.title}</h2>
  //                                 <h3>$${prod.price} por unidad</h3>
  //                                 <p>${prod.description}</p>

  //                 `)}
  //                 <p>${JSON.stringify(cart.products)}</p>
  //             `
  //         }

  //         let emailResult = transport.sendMail(mail)

  //         let wspResult = await client.messages.create({
  //             from: "whatsapp:+14155238886",
  //             to:"whatsapp:+5491139165275",
  //             body:`nuevo pedido de ${user.first_name} ${user.last_name}:,
  //             productos: <h1>Productos a comprar de ${user.first_name} ${user.last_name}: </h1>
  //                         ${productsInCart.map(prod => `
  //                                             <h2>${prod.title}</h2>
  //                                             <h3>${prod.price}</h3>
  //                                             <p>${prod.description}</p>

  //                             `)}
  //                         <p>${JSON.stringify(cart.products)}</p>
  //              `,
  //         })

  //          const sms = await client.messages.create({
  //              body:`Hola ${user.first_name}, su pedido ha sido registrado y se encuentra en proceso.
  //                     Productos:<h1>Productos a comprar de ${user.first_name} ${user.last_name}: </h1>
  //                                 ${productsInCart.map(prod => `
  //                                 <h2>${prod.title}</h2>
  //                                 <h3>${prod.price}</h3>
  //                                 <p>${prod.description}</p>

  //                                  `)}
  //                                 <p>${JSON.stringify(cart.products)}</p>`,
  //              from:'+19036051039',
  //              to:`+${user.phone}`
  //          })

  cart.products = [];
  await cartService.update(cid, cart);
  res.send({ status: "success", message: "Finished purchase!" });
};

export default {
  getCartById,
  addProduct,
  deleteProductFromCart,
  updateCart,
  confirm,
};
