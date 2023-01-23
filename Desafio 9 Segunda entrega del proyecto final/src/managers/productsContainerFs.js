import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';
import { historialFS } from "./historialFs.js";

const historial = new historialFS("historial.txt")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class productsContainerFs{
    constructor(fileName){
        this.fileName = path.join(__dirname,"..",`files/${fileName}`);
    }

    //Methods

    async getAll(){
        try{
            let elements = await fs.promises.readFile(this.fileName,"utf-8")
            if(elements.length > 0){
                elements = JSON.parse(elements)
                await historial.save({movimiento: "Lectura de la colección productos", DB: "FileSistem"});
                return elements
            } else{
                elements = []
                await historial.save({movimiento: "Lectura de la colección productos", DB: "FileSistem"});
                return elements
            }
        } catch(error){
            await historial.save({movimiento: "ERROR Lectura de la colección productos", DB: "FileSistem"});
            console.log(`Error al leer el archivo: ${error}`)
        }
    }


    async save(product){
        try{
            if(fs.existsSync(this.fileName)){
                const items = await this.getAll()
                if(items.length > 0){
                    product.id = items.length + 1
                    items.push(product)
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(items,null,2));
                    await historial.save({movimiento: "Guardado de producto", DB: "FileSistem"})
                }else{
                    product.id = 1;
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([product],null,2));
                    await historial.save({movimiento: "Guardado de producto", DB: "FileSistem"})
                }
            }else{
                product.id = 1;
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([product],null,2));
                await historial.save({movimiento: "Guardado de producto", DB: "FileSistem"})
            }
        } catch(error){
            await historial.save({movimiento: "ERROR Guardado de producto", DB: "FileSistem"})
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const stock = await this.getAll();
            const product = stock.find(element=>element.id === id)
            await historial.save({movimiento: "Lectura de producto", DB: "FileSistem"});
            return product
        }catch (error){
            await historial.save({movimiento: "ERROR Lectura de producto", DB: "FileSistem"})
            console.log(`Error al obtener producto: ${error}`)
        }
    }

    async updateByID(id, producto){
        try{
            const stock = await this.getAll();
            for(var n =0; n < stock.length; n++){
                if(stock[n].id === id){
                    stock[n].title = producto.title,
                    stock[n].thumbnail = producto.thumbnail,
                    stock[n].price = producto.price
                }
            }
            this.deleteAll();
            await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(stock,null,2));
            await historial.save({movimiento: "Producto actualizado", DB: "FileSistem"});
            console.log("Producto actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Producto actualizado", DB: "FileSistem"});
            console.log(`Error al actualizar producto ${error}`)
        }
    }

    async deleteById(id){
        try{
            const stock = await this.getAll();
            const newStock = stock.filter(element=> element.id !== id)
            await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(newStock,null,2));
            await historial.save({movimiento: "Producto eliminado", DB: "FileSistem"});
            console.log("Stock actualizado")
        }catch (error){
            await historial.save({movimiento: "ERROR Producto eliminado", DB: "FileSistem"});
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(`${this.fileName}`,"");
            await historial.save({movimiento: "Productos eliminados", DB: "FileSistem"});
            console.log("Stock vaciado");
        }catch (error){
            await historial.save({movimiento: "ERROR Productos eliminados", DB: "FileSistem"});
            console.log(`Error al eliminar stock: ${error}`);
        }
    }
}

export {productsContainerFs};