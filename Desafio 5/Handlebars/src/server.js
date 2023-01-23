const express = require('express');
const handlebars = require("express-handlebars");
const path = require("path");
const Contenedor = require("./managers/claseProductos");

const PORT = 8080;
const productosService = new Contenedor("productos.txt");
const viewsFolder = path.join(__dirname,"views")

const app = express();
app.listen(PORT, ()=>console.log(`Servidor escuchando el puerto: ${PORT}`));

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine("handlebars",handlebars.engine());

app.set("views", viewsFolder);
app.set("view engine", "handlebars");

app.post("/",async(req,res)=>{
    const newProduct = req.body;
    await productosService.save(newProduct);
    res.redirect("/productos");
})

app.get('/productos', async(req, res) =>{
    const productos = await productosService.getAll();
    res.render("productos", {
        productos:productos
    })
})



