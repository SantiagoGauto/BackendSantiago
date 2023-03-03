import { productsContainerFirestore } from "../../../controllers/managers/productsContainerFirestore.js";

class ProductsDAOFirestore extends productsContainerFirestore{
    constructor(collection){
        super(collection);
    }
}

export {ProductsDAOFirestore};