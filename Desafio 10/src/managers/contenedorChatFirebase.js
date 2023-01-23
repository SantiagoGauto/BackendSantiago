import admin from "firebase-admin";

const db = admin.firestore();

class contenedorChatFirebase{
    constructor(collection){
        this.collection = db.collection(collection)
    }

    async getAll(){
        try{
            const snapshot = await this.collection.get();
            const docs = snapshot.docs;
            let chats = docs.map(doc=>{
                return{
                    id: doc.id,
                    author: doc.data().author,
                    text: doc.data().text,
                }
            });
            console.log(chats)
            return chats;
        } catch(error){
            console.log(`Error al leer el archivo: ${error}`)
        }
    }

    async save(mensaje){
        try{
            const doc = this.collection.doc();
            await doc.create(mensaje);
            } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }
}
export {contenedorChatFirebase};