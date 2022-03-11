import Dao from "../model/Dao.js";
import UserService from "./userService.js";
import ProductsService from './productsService.js';
import CartService from "./cartsService.js";
import config from "../config/config.js";


const dao = new Dao(config.mongo);

export const userService = new UserService(dao);
export const productsService = new ProductsService(dao);
export const cartsService = new CartService(dao)