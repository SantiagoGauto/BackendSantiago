import { productsContainerFs } from "../../../controllers/managers/productsContainerFs.js";

class ProductsDAOFileSystem extends productsContainerFs{
    constructor(path){
        super(path);
    }
}

export {ProductsDAOFileSystem};