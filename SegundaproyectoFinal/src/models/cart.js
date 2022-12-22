import mongoose from "mongoose";

const cartCollection = "carrito";

const cartSchema = new mongoose.Schema({
    timestamp:{
        type: String,
        required: true
    },
    productos:{
        type: Array,
        required: true
    }
});

export const CartModel = mongoose.model(cartCollection, cartSchema);