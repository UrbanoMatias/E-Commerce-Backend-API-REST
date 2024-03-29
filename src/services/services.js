import Dao from "../model/Dao.js";
import UserService from "./userService.js";
import ProductService from "./productService.js";
import CartService from "./cartService.js";
import config from "../config/config.js";
import MessageService from "./MessageService.js";

const dao = new Dao(config.mongo);

export const userService = new UserService(dao);
export const productService = new ProductService(dao);
export const cartService = new CartService(dao);
export const messageService = new MessageService(dao);
