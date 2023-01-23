import { contenedorChatFileSystem } from "../../managers/contenedorChatFileSystem.js";

class ChatDAOFileSystem extends contenedorChatFileSystem{
    constructor(path){
        super(path);
    }
}

export {ChatDAOFileSystem};