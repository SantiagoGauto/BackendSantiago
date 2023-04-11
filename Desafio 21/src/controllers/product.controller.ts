import { Context, helpers, config, MongoClient, ObjectId } from "../../depts.ts";
import {Producto} from "../types/productos.ts";


const client = new MongoClient();
try {
    await client.connect("mongodb+srv://Santidd11:coder.backend@cluster0.kc4fhea.mongodb.net/CoderDB?authMechanism=SCRAM-SHA-1");
    console.log("conexion a la base de datos exitosa!")
} catch (error) {
    console.log(error)
}

const db = client.database("CoderDB");
const productModel = db.collection<Producto>("productos");

export const findProducts = async(ctx:Context)=>{
    try {
        const products = await productModel.find().toArray();
        ctx.response.status = 200;
        ctx.response.body = {status:"success", data:products}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const findProductById = async(ctx:Context)=>{
    try {
        const {id} = helpers.getQuery(ctx,{mergeParams:true});
        const producto = await productModel.findOne({_id: new ObjectId(id)});
        ctx.response.status = 200;
        ctx.response.body = {status:"success", data:producto};
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const createProduct = async(ctx:Context)=>{
    try {
        const body = await ctx.request.body().value;
        const productCreated = await productModel.insertOne(body);
        ctx.response.status = 200;
        ctx.response.body = {status:"success",data:productCreated, message:"product created"}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const updateProduct = async (ctx:Context) => {
    const {id} = helpers.getQuery(ctx,{mergeParams:true});
    const body = await ctx.request.body().value;
    const { code, title, price, thumbnail, timestamp, description, stock  } = await body;
    ctx.response.body = await productModel.updateOne({_id: new ObjectId(id)}, { $set: { code, title, price, thumbnail, timestamp, description, stock  } });
};

export const deleteProduct = async (ctx:Context) => {
    const {id} = helpers.getQuery(ctx,{mergeParams:true});
    ctx.response.body = await productModel.deleteOne({_id: new ObjectId(id)});
};