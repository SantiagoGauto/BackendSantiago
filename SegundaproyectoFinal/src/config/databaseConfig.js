import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const options = {
    fileSystem: {
        pathProducts: 'productos.txt',
        pathCarrito: 'carrito.json'
    },
    mongo:{
        path: 'mongodb://127.0.0.1:27017/proyectofinal',
    },
    firebase:{

    }
}