import mongoose from "mongoose";
import { logger } from "../controllers/logger/log4js.js";

export const connectMongoDB = ()=>{
    mongoose.set("strictQuery", false);
    mongoose.connect("mongodb+srv://Santidd11:coder.backend@cluster0.kc4fhea.mongodb.net/CoderDB?retryWrites=true&w=majority",{
        useNewUrlParser:true,
        useUnifiedTopology: true
    },(error)=>{
        if(error){logger.error("Conexion fallida")};
        logger.info("Base de datos conectada correctamente")
    });
};