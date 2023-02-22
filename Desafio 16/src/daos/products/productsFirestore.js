import { productsContainerFirestore } from "../../managers/productsContainerFirestore.js";

class ProductsDAOFirestore extends productsContainerFirestore{
    constructor(collection){
        super(collection);
    }
}

export {ProductsDAOFirestore};