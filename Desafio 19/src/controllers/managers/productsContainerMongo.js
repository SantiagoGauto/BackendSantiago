import { logger } from "../logger/log4js.js";

class productsContainerMongo{
    constructor(model){
        this.model = model
    }

    async getAll(){
        try{
            let elements = await this.model.find()
            if(elements.length > 0){
                return elements
            } else{
                elements = []
                return elements
            }
        } catch(error){
            logger.error(`Error al leer el archivo: ${error}`)
        }
    }

    async saveMany(items){
        try{
            await this.model.insertMany(items);
            logger.info("Correcto");
        } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }

    async save(item){
        try{
            await this.model.create(item);
            logger.info("Correcto");
        } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const product = await this.model.find({code : id})
            return product
        }catch (error){
            logger.error(`Error al obtener producto: ${error}`)
        }
    }

    async updateByID(id, producto){
        try{
            this.model.updateOne({code : id}, {$set: {"title": producto.title, "thumbnail": producto.thumbnail, "price": producto.price, "code": producto.code, "description": producto.description, "stock": producto.stock}});
            logger.info("Producto actualizado")
        }catch (error){
            logger.error(`Error al actualizar producto ${error}`)
        }
    }

    async deleteById(id){
        try{
            await this.model.deleteOne({code : id})
            logger.info("Stock actualizado")
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

export {productsContainerMongo};