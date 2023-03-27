import admin from "firebase-admin";
import { logger } from "../logger/log4js.js";

const db = admin.firestore();

class productsContainerFirestore{
    constructor(collection){
        this.collection = db.collection(collection)
    }

    async getAll(){
        try{
            const snapshot = await this.collection.get();
            const docs = snapshot.docs;
            let products = docs.map(doc=>{
                return{
                    id: doc.id,
                    code: doc.data().code,
                    title: doc.data().title,
                    price: doc.data().price,
                    thumbnail: doc.data().thumbnail,
                    timestamp: doc.data().timestamp,
                    description: doc.data().description,
                    stock: doc.data().stock

                }
            });
            return products;
        } catch(error){
            logger.error(`Error al leer el archivo: ${error}`)
        }
    }

    async save(product){
        try{
            const doc = this.collection.doc();
            await doc.create(product);
            } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }

    async updateByID(id, producto){
        try{
            const doc = this.collection.doc(id);
            await doc.update(producto);
            logger.info("Producto actualizado")
        }catch (error){
            logger.error(`Error al actualizar producto ${error}`)
        }
    }

    async getById(id){
        try{
            const stock = await this.getAll();
            const product = stock.find(element=>element.id === id)
            return product
        }catch (error){
            logger.error(`Error al obtener producto: ${error}`)
        }
    }

    async deleteById(id){
        try{
            const doc = this.collection.doc(id);
            await doc.delete();
            logger.info("Producto Eliminado")
        }catch (error){
            logger.error(`Error al eliminar producto: ${error}`)
        }
    }
};

export {productsContainerFirestore};