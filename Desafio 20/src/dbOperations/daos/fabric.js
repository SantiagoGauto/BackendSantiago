import mongoose from 'mongoose';
import { ProductsModel } from '../models/products.js';

let ContenedorDaoProductos;


mongoose.connect("mongodb+srv://Santidd11:coder.backend@cluster0.kc4fhea.mongodb.net/CoderDB?retryWrites=true&w=majority");
const {ProductsDAOMongo} = await import("./products/productsMongo.js");
ContenedorDaoProductos = new ProductsDAOMongo(ProductsModel);

export {ContenedorDaoProductos};