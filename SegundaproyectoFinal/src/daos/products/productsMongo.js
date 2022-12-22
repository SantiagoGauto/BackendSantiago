import { productsContainerMongo } from "../../managers/ProductosContenedorMongo.js";

class ProductsDAOMongo extends productsContainerMongo{
    constructor(model){
        super(model);
    }
}

export {ProductsDAOMongo};