import { options } from '../config/databaseConfig.js'
import mongoose from 'mongoose';
/* import admin from "firebase-admin"; */
import { CartModel } from '../models/cart.js';
import { ProductsModel } from '../models/products.js';

let ContenedorDaoProductos;
let ContenedorDaoCarts;

let databaseType = "filesystem";

switch(databaseType){
    case "filesystem":
    break;

    case "mongo":
        mongoose.connect(options.mongo.path);
        const {ProductsDAOMongo} = await import("./products/productsMongo.js");
        const {CartDAOMongo} = await import("./carts/cartMongo.js");
        ContenedorDaoProductos = new ProductsDAOMongo(ProductsModel);
        ContenedorDaoCarts = new CartDAOMongo(CartModel);
    break;

    case "firestore":
       
    break;
};

export {ContenedorDaoProductos,ContenedorDaoCarts};