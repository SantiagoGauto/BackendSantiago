const fs = require('fs');
class Contenedor {
    constructor(archivo){
        this.archivo = archivo;
    }
    async getById(id) {
        try {
            const productos = await fs.promises.readFile(this.archivo, "utf-8");
            const productosRes = await JSON.parse(productos);
            const findProducto = productosRes.find(producto => producto.id === id);
            return findProducto;
        } catch (error) {
            console.log("El producto no esta disponible")
        }
    }
    async getAll() {
        try {
        const content = await fs.promises.readFile(this.archivo, "utf-8");
        const contentJson = await JSON.parse(content);
        /* console.log(content); */
        return contentJson;
        } catch (error) {
            console.log("error al obtener los productos")
        }
    }
    async overwrite(product){
        try{
            const products = await this.getAll();
            products.push(product);
            await fs.promises.writeFile(this.filename, JSON.stringify(products, null, 2));

            } catch (err){
                console.log(err);
            }
    }
    async save(product){
        try {
            if(fs.existsSync(this.archivo)) {
                const products = await this.getAll();
                if(products.length>0) {
                 //agregar producto adicional
                 const lastId = products [products.length-1].id+1;
                 product.id = lastId;
                 products.push(product);
                 fs.promises.writeFile(this.archivo,JSON.stringify([product],null,2));
                } else{
                 // entonces primer producto
                 product.id = 1;
                 fs.promises.writeFile(this.archivo,JSON.stringify([product],null,2));
                }
            } else {
                product.id = 1;
                fs.promises.writeFile(this.archivo,JSON.stringify([product],null,2));
            }
           
        } catch (error) {
            console.log("El producto no se guardo");
        }
    }
    async deleteById(id) {
        try {
            const productos = await this.getAll();
            const deleteProducto = productos.filter(producto => producto.id !== id);
            await fs.promises.writeFile(this.filename, JSON.stringify(deleteProducto, null, 2));
        } catch (error) {
            console.log("No se pudo borrar el producto")
        }
    }
};

module.exports = Contenedor;