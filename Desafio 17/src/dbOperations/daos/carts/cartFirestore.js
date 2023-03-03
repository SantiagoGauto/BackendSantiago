import { cartContainerFirestore } from "../../../controllers/managers/cartContainerFirestore.js";

class CartDAOFirestore extends cartContainerFirestore{
    constructor(collection){
        super(collection);
    }
}

export {CartDAOFirestore};