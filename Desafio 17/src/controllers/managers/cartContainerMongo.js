import { logger } from "../logger/log4js.js";

class cartContainerMongo{
    constructor(model){
        this.model = model
    }

    async getAll(){
        try{
            let elements = await this.model.find()
            if(elements.length > 0){
                return elements
            } else{
                elements = null
                return elements
            }
        } catch(error){
            logger.error(`Error al leer el archivo: ${error}`)
        }
    }

    async saveProduct(id, product){
        try{
            let cart = await this.model.findOne({id:id})
            let newProducts = cart.productos;
                    newProducts.push(product[0])
                    await this.model.updateOne({id : id}, {$set: {"productos": newProducts}});
                    logger.info("Correcto");
        } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }

    async save(id, carrito){
        try{
            carrito.id = id
            await this.model.create(carrito);
            logger.info("Correcto");
        } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const product = await this.model.find({id : id})
            return product
        }catch (error){
            logger.error(`Error al obtener producto: ${error}`)
        }
    }

    async updateByID(id, producto){
        try{
            await this.model.updateOne({id : id}, {$set: {"productos": producto}});
            logger.info("Producto actualizado")
        }catch (error){
            logger.error(`Error al actualizar producto ${error}`)
        }
    }

    async deleteById(id){
        try{
            await this.model.deleteOne({id : id})
            logger.info("Stock actualizado")
        }catch (error){
            logger.error(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteProductById(idCarrito, idProduct){
        try{
            let carrito = await this.getById(idCarrito);
            let newStock = [];
            for (const element of carrito) {
                for (const producto of element.productos) {
                        if(producto.code !== idProduct){
                            newStock.push(producto)
                        }
                    }
                }
            carrito.productos = newStock
            await this.updateByID(idCarrito, newStock);
            logger.info("Producto eliminado")
        }catch (error){
            logger.error(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await this.model.deleteMany({})
            logger.info("Stock vaciado");
        }catch (error){
            logger.error(`Error al eliminar stock: ${error}`);
        }
    }
}

export {cartContainerMongo};