import { cartContainerFirestore } from "../../managers/cartContainerFirestore.js";

class CartDAOFirestore extends cartContainerFirestore{
    constructor(collection){
        super(collection);
    }
}

export {CartDAOFirestore};