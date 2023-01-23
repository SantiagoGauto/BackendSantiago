import { contenedorChatFirebase } from "../../managers/contenedorChatFirebase.js";

class ChatDAOFirebase extends contenedorChatFirebase{
    constructor(collection){
        super(collection);
    }
}

export {ChatDAOFirebase};