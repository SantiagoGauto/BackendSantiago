import { cartContainerMongo } from "../../managers/cartContainerMongo.js";

class CartDAOMongo extends cartContainerMongo{
    constructor(model){
        super(model);
    }
}

export {CartDAOMongo};