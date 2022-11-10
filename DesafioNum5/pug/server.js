const express = require('express');
const app = express();
const path = require('path');


//api
const Container = require('./public/Container');
const data = new Container('./public/productos.txt')

const port = 8080;
app.listen(port, () =>{
    console.log("Servidor corriendo en el puerto 8080")
})

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

//pug

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

//rutas

app.get("/", async(req,res) =>{
    const productos = await data.getAll();
    res.render("home", {
        productos: productos
    })
});

app.get("/productos", async(req,res) =>{
    const products = await data.getAll();
    if(products.length === 0) {
        res.json("No hay productos disponibles")
    } else {
        res.render("productos", {
            products
        })
    }
})

app.post("/productos", async(req,res) =>{
    const newProduct = req.body;
    await data.save(newProduct);
    res.redirect("/");
})

