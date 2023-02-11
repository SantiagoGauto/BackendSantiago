import { logger } from "../logger/winston.js";

class contenedorChatMongo{
    constructor(model){
        this.model = model
    }

    async getAll(){
        try{
            let elements = await this.model.find()
            if(elements.length > 0){
                const chat = elements.map(doc=>{
                    return {
                        id: doc._id,
                        author: doc.author,
                        text: doc.text,
                    }
                });
                return chat
            } else{
                elements = []
                return elements
            }
        } catch(error){
            logger.error(`Error al leer el archivo: ${error}`)
        }
    }

    async save(mensaje){
        try{
            await this.model.insertMany(mensaje);
        } catch(error){
            logger.error(`Error al escribir el archivo: ${error}`)
        }
    }
}
export {contenedorChatMongo}