const fs = require('fs');
class Cart {
    constructor(archivo) {
        this.archivo = archivo;
    }
    async createCart(cart) {
        try {
            if(fs.existsSync(this.archivo)) {
                const carritos = await this.getAll();
                if(carritos.length>0) {
                 //agregar producto adicional
                 const lastId = carritos [carritos.length-1].id+1;
                 cart.id = lastId;
                 let date = new Date();
                 let fecha = date.getDate() +'/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                 cart.timestamp = fecha;
                 carritos.push(cart);
                 await fs.promises.writeFile(this.archivo,JSON.stringify(carritos,null,2));
                } else{
                 // entonces primer producto
                 cart.id = 1;
                 fs.promises.writeFile(this.archivo,JSON.stringify([cart],null,2));
                }
            } else {
                cart.id = 1;
                fs.promises.writeFile(this.archivo,JSON.stringify([cart],null,2));
            }
           
        } catch (error) {
            console.log("No se pudo crear el carrito");
        }
    }
    async getById(id) {
        try {
            const productosCarrito = await fs.promises.readFile(this.archivo, "utf-8");
            const cartRes = await JSON.parse(productosCarrito);
            const findCart = cartRes.find(cart => cart.id === id);
            return findCart;
        } catch (error) {
            console.log("El carrito no esta disponible")
        }
    }
    async getAll() {
        try {
        const content = await fs.promises.readFile(this.archivo, "utf-8");
        const contentJson = await JSON.parse(content);
        /* console.log(content); */
        return contentJson;
        } catch (error) {
            console.log("error al obtener los productos del carrito")
        }
    }
    async deleteById(id) {
        try {
            const carritos = await this.getAll();
            const deleteCarrito = carritos.filter(carrito => carrito.id !== id);
            await fs.promises.writeFile(this.filename, JSON.stringify(deleteCarrito, null, 2));
        } catch (error) {
            console.log("No se pudo borrar el carrito")
        }
    }
    async save(carrito){
        try {
            if(fs.existsSync(this.archivo)) {
                const carritos = await this.getAll();
                if(carritos.length>0) {
                 //agregar producto adicional
                 const lastId = carritos [carritos.length-1].id+1;
                 carrito.id = lastId;
                 carritos.push(carrito);
                 await fs.promises.writeFile(this.archivo,JSON.stringify(carritos,null,2));
                } else{
                 // entonces primer producto
                 carrito.id = 1;
                 fs.promises.writeFile(this.archivo,JSON.stringify([carrito],null,2));
                }
            } else {
                carrito.id = 1;
                fs.promises.writeFile(this.archivo,JSON.stringify([carrito],null,2));
            }
           
        } catch (error) {
            console.log("El producto no se guardo");
        }
    }
    async updateCart(id, object){
        try{
            const objects = await this.getAll();
            let index = objects.findIndex((element) => element.id == id)
            if(index == -1) {
                return null
            }
            object.id = id;
            objects[index] = object
            await fs.promises.writeFile(this.archivo, JSON.stringify(objects, null, 2));
            return objects;

            } catch (err){
                console.log(err);
            }
    }
    async deleteById(id) {
        try {
            const carritos = await this.getAll();
            const deleteProducto = carritos.filter(carrito => carrito.id !== id);
            await fs.promises.writeFile(this.archivo, JSON.stringify(deleteProducto, null, 2));
        } catch (error) {
            console.log("No se pudo borrar el producto")
        }
    }
}

module.exports = Cart;