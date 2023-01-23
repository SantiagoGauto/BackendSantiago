import { contenedorChatMongo } from "../../managers/contenedorChatMongo.js";

class ChatDAOMongo extends contenedorChatMongo{
    constructor(model){
        super(model);
    }
}

export {ChatDAOMongo};
