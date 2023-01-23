const fs = require('fs');
const path = require("path");

class Contenedor{
    constructor(fileName){
        this.fileName = path.join(__dirname,"..",`files/${fileName}`);
    }

    //Methods

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
                }else{
                    product.id = 1;
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([product],null,2));
                }
            }else{
                product.id = 1;
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([product],null,2));
            }
        } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const stock = await this.getAll();
            const product = stock.find(element=>element.id === id)
            return product
        }catch (error){
            console.log(`Error al obtener producto: ${error}`)
        }
    }

    async deleteById(id){
        try{
            const stock = await this.getAll();
            const newStock = stock.filter(element=> element.id !== id)
            await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(newStock,null,2));
            console.log("Stock actualizado")
        }catch (error){
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(`${this.fileName}`,"");
            console.log("Stock vaciado");
        }catch (error){
            console.log(`Error al eliminar stock: ${error}`);
        }
    }
}

module.exports = Contenedor;