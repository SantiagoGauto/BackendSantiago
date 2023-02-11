import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';
import { logger } from "../logger/winston.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class contenedorChatFileSystem{
    constructor(fileName){
        this.fileName = path.join(__dirname,"..",`files/${fileName}`);
    }

    async getAll(){
        try{
            let elements = await fs.promises.readFile(this.fileName,"utf-8")
            if(elements.length > 0){
                elements = JSON.parse(elements)
                return elements
            } else{
                elements = []
                return elements
            }
        } catch(error){
            logger.error(`Error al leer el archivo: ${error}`)
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
                }else{
                    product.id = 1;
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([product],null,2));
                }
            }else{
                product.id = 1;
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([product],null,2));
            }
        } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }
}

export {contenedorChatFileSystem};