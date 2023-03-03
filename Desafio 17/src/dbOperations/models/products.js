import mongoose from "mongoose";

const productsCollection = "productos";

const productSchema = new mongoose.Schema({
    code:{
        type: Number,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    timestamp:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true
    }
});

export const ProductsModel = mongoose.model(productsCollection, productSchema);