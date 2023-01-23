import { historialFS } from "./historialFs.js"
const historial = new historialFS("historial.txt")

class cartContainerMongo{
    constructor(model){
        this.model = model
    }

    async getAll(){
        try{
            let elements = await this.model.find()
            if(elements.length > 0){
                await historial.save({movimiento: "Lectura de la colección carritos", DB: "mongo"});
                return elements
            } else{
                elements = []
                await historial.save({movimiento: "Lectura de la colección carritos", DB: "mongo"})
                return elements
            }
        } catch(error){
            await historial.save({movimiento: "ERROR lectura de la colección carritos", DB: "mongo"})
            console.log(`Error al leer el archivo: ${error}`)
        }
    }

    async saveProduct(id, product){
        try{
            const cart = await this.model.find({_id : ObjectId(id)});
            let newProducts = cart.productos;
            newProducts.push(product)
            this.model.updateOne({_id : ObjectId(id)}, {$set: {"producto": newProducts}});
            await historial.save({movimiento: "Guardado de producto", DB: "mongo"})
            console.log("Correcto");
        } catch(error){
            await historial.save({movimiento: "ERROR en guardado de producto", DB: "mongo"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async save(carrito){
        try{
            await this.model.insert(carrito);
            await historial.save({movimiento: "Guardado de carrito", DB: "mongo"})
            console.log("Correcto");
        } catch(error){
            await historial.save({movimiento: "ERROR al guardar carrito", DB: "mongo"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const product = await this.model.find({_id : ObjectId(id)})
            await historial.save({movimiento: "Lectura de carrito", DB: "mongo"})
            return product
        }catch (error){
            await historial.save({movimiento: "ERROR Lectura de carrito", DB: "mongo"});
            console.log(`Error al obtener producto: ${error}`)
        }
    }

    async updateByID(id, producto){
        try{
            this.model.updateOne({_id : ObjectId(id)}, {$set: {"producto": producto}});
            await historial.save({movimiento: "Documento actualizado", DB: "mongo"});
            console.log("Producto actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Documento actualizado", DB: "mongo"});
            console.log(`Error al actualizar producto ${error}`)
        }
    }

    async deleteById(id){
        try{
            await this.model.deleteOne({_id : ObjectId(id)})
            await historial.save({movimiento: "Carrito eliminado", DB: "mongo"});
            console.log("Stock actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Carrito eliminado", DB: "mongo"});
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteProductById(idCarrito, idProduct){
        try{
            let carrito = await this.getById(idCarrito);
            const newStock = carrito.filter(element=> element.id !== idProduct)
            carrito.productos = newStock
            await this.updateByID(idCarrito, carrito.productos);
            await historial.save({movimiento: "Producto eliminado del carrito", DB: "mongo"});
            console.log("Producto eliminado")
        }catch (error){
            await historial.save({movimiento: "ERROR Producto eliminado del carrito", DB: "mongo"});
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await this.model.deleteMany({})
            await historial.save({movimiento: "Vaciar coleccion Carritos", DB: "mongo"});
            console.log("Stock vaciado");
        }catch (error){
            await historial.save({movimiento: "ERROR Vaciar coleccion Carritos", DB: "mongo"});
            console.log(`Error al eliminar stock: ${error}`);
        }
    }
}

export {cartContainerMongo};