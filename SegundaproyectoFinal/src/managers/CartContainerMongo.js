class cartContainerMongo{
    constructor(model){
        this.model = model
    }

    async getAll(){
        try{
            let elements = await this.model.find()
            if(elements.length > 0){
                return elements
            } else{
                elements = []
                return elements
            }
        } catch(error){
            console.log(`Error al leer el archivo: ${error}`)
        }
    }

    async saveProduct(id, product){
        try{
            const cart = await this.model.find({_id : ObjectId(id)});
            let newProducts = cart.productos;
            newProducts.push(product)
            this.model.updateOne({_id : ObjectId(id)}, {$set: {"producto": newProducts}});
            console.log("Correcto");
        } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async save(carrito){
        try{
            await this.model.insert(carrito);
            console.log("Correcto");
        } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const product = await this.model.find({_id : ObjectId(id)})
            return product
        }catch (error){
            console.log(`Error al obtener producto: ${error}`)
        }
    }

    async updateById(id, producto){
        try{
            this.model.updateOne({_id : ObjectId(id)}, {$set: {"producto": producto}});
            console.log("Producto actualizado")
        }catch (error){
            console.log(`Error al actualizar producto ${error}`)
        }
    }

    async deleteById(id){
        try{
            await this.model.deleteOne({_id : ObjectId(id)})
            console.log("Stock actualizado")
        }catch (error){
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteProductById(idCarrito, idProduct){
        try{
            let carrito = await this.getById(idCarrito);
            const newStock = carrito.filter(element=> element.id !== idProduct)
            carrito.productos = newStock
            await this.updateByID(idCarrito, carrito.productos);
            console.log("Producto eliminado")
        }catch (error){
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await this.model.deleteMany({})
            console.log("Stock vaciado");
        }catch (error){
            console.log(`Error al eliminar stock: ${error}`);
        }
    }
}

export {cartContainerMongo};