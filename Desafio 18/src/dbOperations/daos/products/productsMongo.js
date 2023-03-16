import { productsContainerMongo } from "../../../controllers/managers/productsContainerMongo.js";

class ProductsDAOMongo extends productsContainerMongo{
    constructor(model){
        super(model);
    }
}

export {ProductsDAOMongo};