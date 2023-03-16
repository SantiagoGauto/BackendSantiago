import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';
import { logger } from "../logger/log4js.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class cartContainerFs{
    constructor(fileName){
        this.fileName = path.join(__dirname,"..",`files/${fileName}`);
    }

    //Methods

    async getAll(){
        try{
            let elements = await fs.promises.readFile(this.fileName,"utf-8")
            elements = JSON.parse(elements)
            return elements
        } catch(error){
            logger.error(`Error al leer el archivo: ${error}`)
        }
    }


    async save(id, newCarrito){
        try{
            if(fs.existsSync(this.fileName)){
                const items = await this.getAll()
                if(items.length > 0){
                    newCarrito.id = id
                    items.push(newCarrito)
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(items,null,2));
                    logger.info(`Carrito creado con el ID: ${newCarrito.id}`)
                }else{
                    newCarrito.id = 1;
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([newCarrito],null,2));
                    logger.info(`Carrito creado con el ID: ${newCarrito.id}`)
                }
            }else{
                newCarrito.id = 1;
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([newCarrito],null,2));
                logger.info(`Carrito creado con el ID: ${newCarrito.id}`)
            }
        } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }

    async saveProduct(id, product){
        try{
            if(fs.existsSync(this.fileName)){
                const array = await this.getAll()
                let carrito = await this.getById(id)
                carrito.push(product);
                for(var n =0; n < array.length; n++){
                    if(array[n].id === id){
                        array[n].productos = carrito
                    }
                }
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(array,null,2));
            }else{
                carrito.producto.push(product)
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(carrito,null,2));
            }
        } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const stock = await this.getAll();
            const product = stock.find(element=>element.id === id)
            return product.productos
        }catch (error){
            logger.error(`Error al obtener producto: ${error}`)
        }
    }

    async updateByID(id, producto){
        try{
            const stock = await this.getAll();
            for(var n =0; n < stock.length; n++){
                if(stock[n].id === id){
                    stock[n].timestamp = producto.timestamp,
                    stock[n].productos = producto.productos
                }
            }
            this.deleteAll();
            await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(stock,null,2));
            logger.info("Producto actualizado")
        }catch (error){
            logger.error(`Error al actualizar producto ${error}`)
        }
    }

    async deleteById(id){
        try{
            const stock = await this.getAll();
            const newStock = stock.filter(element=> element.id !== id)
            await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(newStock,null,2));
            logger.info("Stock actualizado")
        }catch (error){
            logger.error(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteProductById(idCarrito, idProduct){
        try{
            let carrito = await this.getById(idCarrito);
            const newStock = carrito.filter(element=> element.id !== idProduct)
            carrito.productos = newStock
            await this.updateByID(idCarrito, carrito);
            logger.info("Producto eliminado")
        }catch (error){
            logger.error(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(`${this.fileName}`,"");
            logger.info("Stock vaciado");
        }catch (error){
            logger.error(`Error al eliminar stock: ${error}`);
        }
    }
}

export {cartContainerFs};