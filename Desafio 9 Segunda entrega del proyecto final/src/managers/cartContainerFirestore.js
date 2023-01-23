import admin from "firebase-admin";
import { historialFS } from "./historialFs.js"

const historial = new historialFS("historial.txt")
const db = admin.firestore();

class cartContainerFirestore{
    constructor(collection){
        this.collection = db.collection(collection)
    }

    async getAll(){
        try{
            const snapshot = await this.collection.get();
            const docs = snapshot.docs;
            let cart = docs.map(doc=>{
                return{
                    id: doc.id,
                    timestamp: doc.data().timestamp,
                    productos: doc.data().productos,
                }
            });
            await historial.save({movimiento: "Lectura de la colección carritos", DB: "Firestore"});
            return cart;
        } catch(error){
            await historial.save({movimiento: "Lectura de la colección carritos", DB: "Firestore"})
            console.log(`Error al leer el archivo: ${error}`)
        }
    }

    async save(carrito){
        try{
            const doc = this.collection.doc();
            await doc.create(carrito);
            await historial.save({movimiento: "Guardado de carrito", DB: "Firestore"})
            } catch(error){
            await historial.save({movimiento: "ERROR al guardar carrito", DB: "Firestore"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async saveProduct(id, product){
        try{
            const cart = this.getById(id)
            let newProducts = cart.productos
            newProducts.push(product)
            const doc = this.collection.doc(id);
            await doc.update({productos:newProducts})
            this.model.updateOne({_id : ObjectId(id)}, {$set: {"producto": newProducts}});;
            await historial.save({movimiento: "Guardado de producto", DB: "Firestore"})
            } catch(error){
            await historial.save({movimiento: "ERROR en guardado de producto", DB: "Firestore"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async updateByID(id, carrito){
        try{
            const doc = this.collection.doc(id);
            await doc.update(carrito);
            await historial.save({movimiento: "Documento actualizado", DB: "Firestore"});
            console.log("Carrito actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Documento actualizado", DB: "Firestore"});
            console.log(`Error al actualizar Carrito ${error}`)
        }
    }

    async getById(id){
        try{
            const stock = await this.getAll();
            const cart = stock.find(element=>element.id === id)
            await historial.save({movimiento: "Lectura de carrito", DB: "Firestore"})
            return cart
        }catch (error){
            await historial.save({movimiento: "ERROR Lectura de carrito", DB: "Firestore"});
            console.log(`Error al obtener producto: ${error}`)
        }
    }

    async deleteById(id){
        try{
            const doc = this.collection.doc(id);
            await doc.delete();
            await historial.save({movimiento: "Carrito eliminado", DB: "Firestore"});
            console.log("Carrito Eliminado")
        }catch (error){
            await historial.save({movimiento: "ERROR Carrito eliminado", DB: "Firestore"});
            console.log(`Error al eliminar carrito: ${error}`)
        }
    }
};

export {cartContainerFirestore};