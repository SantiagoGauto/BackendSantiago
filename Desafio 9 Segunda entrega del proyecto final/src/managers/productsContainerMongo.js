import { historialFS } from "./historialFs.js"

const historial = new historialFS("historial.txt")

class productsContainerMongo{
    constructor(model){
        this.model = model
    }

    async getAll(){
        try{
            let elements = await this.model.find()
            if(elements.length > 0){
                await historial.save({movimiento: "Lectura de la colección productos", DB: "Mongo"});
                return elements
            } else{
                elements = []
                await historial.save({movimiento: "Lectura de la colección productos", DB: "Mongo"});
                return elements
            }
        } catch(error){
            await historial.save({movimiento: "ERROR Lectura de la colección productos", DB: "Mongo"});
            console.log(`Error al leer el archivo: ${error}`)
        }
    }

    async saveMany(items){
        try{
            await this.model.insertMany(items);
            await historial.save({movimiento: "Guardado de productos", DB: "Mongo"})
            console.log("Correcto");
        } catch(error){
            await historial.save({movimiento: "ERROR Guardado de productos", DB: "Mongo"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async save(item){
        try{
            await this.model.insert(item);
            await historial.save({movimiento: "Guardado de producto", DB: "Mongo"})
            console.log("Correcto");
        } catch(error){
            await historial.save({movimiento: "ERROR Guardado de producto", DB: "Mongo"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const product = await this.model.find({_id : ObjectId(id)})
            await historial.save({movimiento: "Lectura de producto", DB: "Mongo"})
            return product
        }catch (error){
            await historial.save({movimiento: "ERROR Lectura de producto", DB: "Mongo"})
            console.log(`Error al obtener producto: ${error}`)
        }
    }

    async updateByID(id, producto){
        try{
            this.model.updateOne({_id : ObjectId(id)}, {$set: {"title": producto.title, "thumbnail": producto.thumbnail, "price": producto.price, "code": producto.code, "description": producto.description, "stock": producto.stock}});
            await historial.save({movimiento: "Producto actualizado", DB: "Mongo"});
            console.log("Producto actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Producto actualizado", DB: "Mongo"});
            console.log(`Error al actualizar producto ${error}`)
        }
    }

    async deleteById(id){
        try{
            await this.model.deleteOne({_id : ObjectId(id)})
            await historial.save({movimiento: "Producto eliminado", DB: "Mongo"});
            console.log("Stock actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Producto eliminado", DB: "Mongo"});
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await this.model.deleteMany({})
            await historial.save({movimiento: "Productos eliminados", DB: "Mongo"});
            console.log("Stock vaciado");
        }catch (error){
            await historial.save({movimiento: "ERROR Productos eliminados", DB: "Mongo"});
            console.log(`Error al eliminar stock: ${error}`);
        }
    }
}

export {productsContainerMongo};