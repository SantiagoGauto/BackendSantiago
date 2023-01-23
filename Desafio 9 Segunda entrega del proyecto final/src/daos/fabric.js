import { options } from '../config/dataBaseConfig.js'
import mongoose from 'mongoose';
import admin from "firebase-admin";
import { CartModel } from '../models/cart.js';
import { ProductsModel } from '../models/products.js';

let ContenedorDaoProductos;
let ContenedorDaoCarts;

let databaseType = "filesystem";

switch(databaseType){
    case "filesystem":
        const {ProductsDAOFileSystem} = await import("./products/productsFileSystem.js");
        const {CartDAOFileSystem} = await import("./carts/cartFileSystem.js")
        ContenedorDaoProductos = new ProductsDAOFileSystem(options.fileSystem.pathProducts);
        ContenedorDaoCarts = new CartDAOFileSystem(options.fileSystem.pathCarts);
    break;

    case "mongo":
        mongoose.connect(options.mongo.path);
        const {ProductsDAOMongo} = await import("./products/productsMongo.js");
        const {CartDAOMongo} = await import("./carts/cartMongo.js");
        ContenedorDaoProductos = new ProductsDAOMongo(ProductsModel);
        ContenedorDaoCarts = new CartDAOMongo(CartModel);
    break;

    case "firestore":
        admin.initializeApp({
            credential: admin.credential.cert(options.firebase.key),
            databaseURL: options.firebase.databaseUrl
        });
        const {ProductsDAOFirestore} = await import("./products/productsFirestore.js");
        const {CartDAOFirestore} = await import("./carts/cartFirestore.js");
        ContenedorDaoProductos = new ProductsDAOFirestore("productos");
        ContenedorDaoCarts = new CartDAOFirestore("carrito");
    break;
};

export {ContenedorDaoProductos,ContenedorDaoCarts};