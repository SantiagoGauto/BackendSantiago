class productsContainerMongo{
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

    async saveMany(items){
        try{
            await this.model.insertMany(items);
            console.log("Correcto");
        } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async save(item){
        try{
            await this.model.insert(item);
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

    async updateByID(id, producto){
        try{
            this.model.updateOne({_id : ObjectId(id)}, {$set: {"title": producto.title, "thumbnail": producto.thumbnail, "price": producto.price, "code": producto.code, "description": producto.description, "stock": producto.stock}});
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

    async deleteAll(){
        try{
            await this.model.deleteMany({})
            console.log("Stock vaciado");
        }catch (error){
            console.log(`Error al eliminar stock: ${error}`);
        }
    }
}

export {productsContainerMongo};