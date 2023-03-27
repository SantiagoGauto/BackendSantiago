import {buildSchema} from "graphql";
import {graphqlHTTP} from "express-graphql";
import { ProductsModel } from "../../dbOperations/models/products.js";
import { logger } from "../logger/log4js.js";


const graphqlSchema = buildSchema(`
    type Product {
        _id: String,
        code: Int,
        title: String,
        price: String,
        thumbnail: String,
        timestamp: String,
        description: String,
        stock: Int
    }
    
    input ProductInput {
        code: Int,
        title: String,
        price: String,
        thumbnail: String,
        description: String,
        stock: Int
    }
    
    type Query {
        getProducts: [Product]
        getProductById(id: String): Product
    }
    
    type Mutation {
        createProduct(input: ProductInput): Product
        updateProduct(id: Int, input: ProductInput): Product
        deleteProduct(id: Int): Boolean
    }
`);

const root = {
    getProducts: async () => {
        try {
            const products = await ProductsModel.find();
            return products;
        } catch (error) {
            logger.error(error);
            throw new Error('Error al obtener los productos.');
        }
    },

    getProductById: async ({ id }) => {
        try {
            const product = await ProductsModel.findById(id);
            if (!product) {
            return null;
            } else {
            return product;
            }
        } catch (error) {
            logger.error(error);
            throw new Error(`Error al obtener el producto con ID ${id}.`);
        }
    },

    createProduct: async ({ input }) => {
        try {
            const newProduct = await ProductsModel.create(input);
            return newProduct;
        } catch (error) {
            logger.error(error);
            throw new Error('Error al crear el producto.');
        }
    },

    updateProduct: async ({ id, input }) => {
        try {
            const updatedProduct = await ProductsModel.findByIdAndUpdate(id, input, { new: true });
            if (!updatedProduct) {
            return null;
            } else {
            return updatedProduct;
            }
        } catch (error) {
            logger.error(error);
            throw new Error(`Error al actualizar el producto con ID ${id}.`);
        }
    },

    deleteProduct: async ({ id }) => {
        try {
            const deletedProduct = await ProductsModel.findByIdAndDelete(id);
            if (!deletedProduct) {
            return false;
            } else {
            return true;
            }
        } catch (error) {
            logger.error(error);
            throw new Error(`Error al eliminar el producto con ID ${id}.`);
        }
    }
};

export const graphqlController = ()=>{
    return graphqlHTTP({
        schema:graphqlSchema,
        rootValue:root,
        graphiql:true
    });
};