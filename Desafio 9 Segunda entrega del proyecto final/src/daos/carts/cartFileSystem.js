import { cartContainerFs } from "../../managers/cartContainerFs.js";

class CartDAOFileSystem extends cartContainerFs{
    constructor(path){
        super(path);
    }
}

export {CartDAOFileSystem};