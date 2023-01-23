const express = require("express");
const fs = require("fs");

class Container{
    constructor(fileName){
        this.fileName=fileName
    }
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
}

const client = new Container("productos.txt");


const app = express();

const PORT = 8080;

app.listen(PORT,()=>console.log("server listening on port 8080"));


app.get("/productos",(request, response)=>{
    const getProducts = async () =>{
        const stock = await client.getAll()
        response.send(stock)
    };
    getProducts();
})

app.get("/productosRandom",(request, response)=>{
    const getProductsRandom = async () =>{
        const stock = await client.getAll()
        const i = Math.floor(Math.random()*stock.length);
        response.send(stock[i])
    };
    getProductsRandom()
})