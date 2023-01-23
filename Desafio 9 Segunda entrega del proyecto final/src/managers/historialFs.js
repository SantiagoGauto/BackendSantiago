import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class historialFS{
    constructor(fileName){
        this.fileName = path.join(__dirname,"..",`files/${fileName}`);
    }

    //Methods

    async getAll(){
        try{
            let movimientos = await fs.promises.readFile(this.fileName,"utf-8")
            if(movimientos.length > 0){
                movimientos = JSON.parse(movimientos)
                return movimientos
            } else{
                movimientos = []
                return movimientos
            }
        } catch(error){
            console.log(`Error al leer el archivo: ${error}`)
        }
    }


    async save(newMovimiento){
        try{
            if(fs.existsSync(this.fileName)){
                const movimientos = await this.getAll()
                if(movimientos.length > 0){
                    newMovimiento.id = movimientos.length + 1
                    movimientos.push(newMovimiento)
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(movimientos,null,2));
                }else{
                    newMovimiento.id = 1;
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([newMovimiento],null,2));
                }
            }else{
                newMovimiento.id = 1;
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([newMovimiento],null,2));
            }
        } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const historial = await this.getAll();
            const movimiento = historial.find(element=>element.id === id)
            return movimiento
        }catch (error){
            console.log(`Error al obtener historial: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(`${this.fileName}`,"");
            console.log("Historial vaciado");
        }catch (error){
            console.log(`Error al eliminar historial: ${error}`);
        }
    }
}

export {historialFS};