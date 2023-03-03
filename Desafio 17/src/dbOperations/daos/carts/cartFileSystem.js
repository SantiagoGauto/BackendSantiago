import { cartContainerFs } from "../../../controllers/managers/cartContainerFs";

class CartDAOFileSystem extends cartContainerFs{
    constructor(path){
        super(path);
    }
}

export {CartDAOFileSystem};