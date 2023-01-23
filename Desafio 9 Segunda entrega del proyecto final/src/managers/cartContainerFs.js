import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';
import { historialFS } from "./historialFs.js"

const historial = new historialFS("historial.txt")
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
            await historial.save({movimiento: "Lectura de la colección carritos", DB: "FileSistem"});
            return elements
        } catch(error){
            await historial.save({movimiento: "ERROR Lectura de la colección carritos", DB: "FileSistem"})
            console.log(`Error al leer el archivo: ${error}`)
        }
    }


    async save(newCarrito){
        try{
            if(fs.existsSync(this.fileName)){
                const items = await this.getAll()
                if(items.length > 0){
                    newCarrito.id = items.length + 1
                    items.push(newCarrito)
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(items,null,2));
                    await historial.save({movimiento: "Guardado de carrito", DB: "FileSistem"})
                    console.log(`Carrito creado con el ID: ${newCarrito.id}`)
                }else{
                    newCarrito.id = 1;
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([newCarrito],null,2));
                    await historial.save({movimiento: "Guardado de carrito", DB: "FileSistem"})
                    console.log(`Carrito creado con el ID: ${newCarrito.id}`)
                }
            }else{
                newCarrito.id = 1;
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([newCarrito],null,2));
                await historial.save({movimiento: "Guardado de carrito", DB: "FileSistem"})
                console.log(`Carrito creado con el ID: ${newCarrito.id}`)
            }
        } catch(error){
            await historial.save({movimiento: "ERROR al guardar carrito", DB: "FileSistem"})
            console.log(`Error al escribir el archivo: ${error}`)
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
                await historial.save({movimiento: "Guardado de producto", DB: "FileSistem"})
            }else{
                carrito.producto.push(product)
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(carrito,null,2));
                await historial.save({movimiento: "Guardado de producto", DB: "FileSistem"})
            }
        } catch(error){
            await historial.save({movimiento: "ERROR en guardado de producto", DB: "FileSistem"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const stock = await this.getAll();
            const product = stock.find(element=>element.id === id)
            await historial.save({movimiento: "Lectura de carrito", DB: "FileSistem"})
            return product.productos
        }catch (error){
            await historial.save({movimiento: "ERROR Lectura de carrito", DB: "FileSistem"});
            console.log(`Error al obtener producto: ${error}`)
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
            await historial.save({movimiento: "Documento actualizado", DB: "FileSistem"});
            console.log("Producto actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Documento actualizado", DB: "FileSistem"});
            console.log(`Error al actualizar producto ${error}`)
        }
    }

    async deleteById(id){
        try{
            const stock = await this.getAll();
            console.log(stock);
            const newStock = stock.filter(element=> element.id !== id)
            await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(newStock,null,2));
            await historial.save({movimiento: "Carrito eliminado", DB: "FileSistem"});
            console.log("Stock actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Carrito eliminado", DB: "FileSistem"});
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteProductById(idCarrito, idProduct){
        try{
            let carrito = await this.getById(idCarrito);
            const newStock = carrito.filter(element=> element.id !== idProduct)
            carrito.productos = newStock
            await this.updateByID(idCarrito, carrito);
            await historial.save({movimiento: "Producto eliminado del carrito", DB: "FileSistem"});
            console.log("Producto eliminado")
        }catch (error){
            await historial.save({movimiento: "ERROR Producto eliminado del carrito", DB: "FileSistem"});
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(`${this.fileName}`,"");
            await historial.save({movimiento: "Vaciar coleccion Carritos", DB: "FileSistem"});
            console.log("Stock vaciado");
        }catch (error){
            await historial.save({movimiento: "ERROR Vaciar coleccion Carritos", DB: "FileSistem"});
            console.log(`Error al eliminar stock: ${error}`);
        }
    }
}

export {cartContainerFs};