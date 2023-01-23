class contenedorChatMongo{
    constructor(model){
        this.model = model
    }

    async getAll(){
        try{
            let elements = await this.model.find()
            console.log(elements);
            if(elements.length > 0){
                const chat = elements.map(doc=>{
                    return {
                        id: doc._id,
                        author: doc.author,
                        text: doc.text,
                    }
                });
                console.log(chat)
                return chat
            } else{
                elements = []
                return elements
            }
        } catch(error){
            console.log(`Error al leer el archivo: ${error}`)
        }
    }

    async save(mensaje){
        try{
            await this.model.insertMany(mensaje);
            console.log("Correcto");
        } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }
}
export {contenedorChatMongo}