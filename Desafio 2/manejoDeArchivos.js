const fs = require('fs');

class Container{
    constructor(fileName){
        this.fileName=fileName
    }

    //Methods

    async getAll(){
        try{
            let elements = await fs.promises.readFile(this.fileName,"utf-8")
            if(elements.length > 0){
                elements = JSON.parse(elements)
                return elements
            } else{
                elements = []
                return elements
            }
        } catch(error){
            console.log(`Error al leer el archivo: ${error}`)
        }
    }


    async save(product){
        try{
            if(fs.existsSync(this.fileName)){
                const items = await this.getAll()
                if(items.length > 0){
                    product.id = items.length
                    items.push(product)
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(items,null,2));
                }else{
                    product.id = 0;
                    await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([product],null,2));
                }
            }else{
                product.id = 0;
                await fs.promises.writeFile(`${this.fileName}`,JSON.stringify([product],null,2));
            }
        } catch(error){
            console.log(`Error al escribir el archivo: ${error}`)
        }
    }

    async getById(id){
        try{
            const stock = await this.getAll();
            const product = stock.find(element=>element.id === id)
            return product
        }catch (error){
            console.log(`Error al obtener producto: ${error}`)
        }
    }

    async deleteById(id){
        try{
            const stock = await this.getAll();
            const newStock = stock.filter(element=> element.id !== id)
            await fs.promises.writeFile(`${this.fileName}`,JSON.stringify(newStock,null,2));
            console.log("Stock actualizado")
        }catch (error){
            console.log(`Error al eliminar producto: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(`${this.fileName}`,"");
            console.log("Stock vaciado");
        }catch (error){
            console.log(`Error al eliminar stock: ${error}`);
        }
    }


}

const product1={
    title: "Mouse",
    price: 3999,
    thumbnail: "https://mexx-img-2019.s3.amazonaws.com/mouse-logitech-gamer-rgb-lila_38560_5.jpeg?v187",
}

const administrator = new Container("items.txt");
const getData = async() =>{
    await administrator.save(product1);
    const myItems = await administrator.getAll();
    console.log(myItems);
    const id1 = await administrator.getById(1);
    console.log(id1);
    await administrator.deleteById(2);
    await administrator.deleteAll();
}
getData();
