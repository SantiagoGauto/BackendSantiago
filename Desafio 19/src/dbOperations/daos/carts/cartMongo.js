import { cartContainerMongo } from "../../../controllers/managers/cartContainerMongo.js";

class CartDAOMongo extends cartContainerMongo{
    constructor(model){
        super(model);
    }
}

export {CartDAOMongo};