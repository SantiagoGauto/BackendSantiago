import { cartContainerMongo } from "../../managers/CartContainerMongo.js";

class CartDAOMongo extends cartContainerMongo{
    constructor(model){
        super(model);
    }
}

export {CartDAOMongo};