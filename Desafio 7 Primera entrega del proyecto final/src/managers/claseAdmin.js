const fs = require('fs');
const path = require("path");

class Contenedor{
    constructor(fileName){
        this.fileName = path.join(__dirname,"..",`files/${fileName}`);
    }

    //Methods

    async get(){
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


    async save(response){
        try{
            await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(response,null,2));
        } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

}

module.exports = Contenedor;