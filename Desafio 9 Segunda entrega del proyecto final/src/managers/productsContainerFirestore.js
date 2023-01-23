import admin from "firebase-admin";
import { historialFS } from "./historialFs.js"

const historial = new historialFS("historial.txt")
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
            await historial.save({movimiento: "Lectura de la colección productos", DB: "Firestore"});
            return products;
        } catch(error){
            await historial.save({movimiento: "ERROR Lectura de la colección productos", DB: "Firestore"});
            console.log(`Error al leer el archivo: ${error}`)
        }
    }

    async save(product){
        try{
            const doc = this.collection.doc();
            await doc.create(product);
            await historial.save({movimiento: "Guardado de producto", DB: "Firestore"})
            } catch(error){
            await historial.save({movimiento: "ERROR Guardado de producto", DB: "Firestore"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async updateByID(id, producto){
        try{
            const doc = this.collection.doc(id);
            await doc.update(producto);
            await historial.save({movimiento: "Producto actualizado", DB: "Firestore"});
            console.log("Producto actualizado")
        }catch (error){
            await historial.save({movimiento: "Producto actualizado", DB: "Firestore"});
            console.log(`Error al actualizar producto ${error}`)
        }
    }

    async getById(id){
        try{
            const stock = await this.getAll();
            const product = stock.find(element=>element.id === id)
            await historial.save({movimiento: "Lectura de producto", DB: "Firestore"})
            return product
        }catch (error){
            await historial.save({movimiento: "ERROR Lectura de producto", DB: "Firestore"})
            console.log(`Error al obtener producto: ${error}`)
        }
    }

    async deleteById(id){
        try{
            const doc = this.collection.doc(id);
            await doc.delete();
            await historial.save({movimiento: "Producto eliminado", DB: "Firestore"});
            console.log("Producto Eliminado")
        }catch (error){
            await historial.save({movimiento: "ERROR Producto eliminado", DB: "Firestore"});
            console.log(`Error al eliminar producto: ${error}`)
        }
    }
};

export {productsContainerFirestore};