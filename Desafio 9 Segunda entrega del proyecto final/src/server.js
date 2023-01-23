import mongoose from 'mongoose';
import { ContenedorDaoCarts, ContenedorDaoProductos } from './daos/fabric.js';


import express from "express";
import { Router } from 'express';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { EnableAdmin } from './managers/claseAdmin.js';
import { historialFS } from './managers/historialFs.js';
import path from 'path';
import bodyParser from 'body-parser';


const PORT = 8080;
const productosService = ContenedorDaoProductos;
const adminService = new EnableAdmin("admin.txt");
const carritoService = ContenedorDaoCarts
const historial = new historialFS("historial.txt");



const viewsFolder = path.join(__dirname,"views")

const app = express();
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando el puerto: ${PORT}`)
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set("views", viewsFolder);
app.set("view engine", "pug");

const routerProductos = Router();
const routerCarrito = Router();

const newDate = () =>{
    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today = mm+'-'+dd+'-'+yyyy;
    return today
}




//Productos
routerProductos.get('/', async (req, res) =>{
    const productos = await productosService.getAll();
    res.json({
        productos:productos
    })
})

routerProductos.get('/:id', async (req, res) =>{
    const id = parseInt(req.params.id);
    let productos = []
    const producto = await productosService.getById(id);
    productos.push(producto)
    res.json({
        producto:productos
    })
})

routerProductos.post('/', async (req, res) =>{
    const admin = await adminService.get();
    if (admin === true){
        res.render("postProducto")
        const newProduct = await req.body;
        newProduct.timestamp = newDate()
        productosService.save(newProduct)
    }
})

routerProductos.put('/:id', async (req, res) =>{
    const admin = await adminService.get();
    if (admin === true){
        const id = parseInt(req.params.id)
        const newProduct = await req.body;
        newProduct.timestamp = newDate()
        productosService.updateByID(id, newProduct)
        res.json({
            producto_nuevo: newProduct
        })
    }
})

routerProductos.delete('/:id', async (req, res) =>{
    const admin = await adminService.get();
    console.log(admin)
    if (admin === true){
        const id = parseInt(req.params.id)
        const producto = await productosService.getById(id)
        await productosService.deleteById(id)
        res.json({
            producto_eliminado: producto 
        });
    }
})

//Carrito
routerCarrito.get('/', async (req, res) =>{
    const carrito = await carritoService.getAll();
    res.json({
        productos:carrito
    })
})

routerCarrito.post('/', async (req, res) =>{
    const newCarrito = {};
    const newProduct = await req.body;
    newCarrito.timestamp = newDate()
    newCarrito.productos = [newProduct]
    await carritoService.save(newCarrito)
    console.log("Carrito agregado");
    const carrito = await carritoService.getAll();
    res.json({
        carritos: carrito
    })
})

routerCarrito.delete('/:id', async (req, res) =>{
    const id = parseInt(req.params.id);
    console.log(id)
    carritoService.deleteById(id);
    console.log("Carrito eliminado")
    const carrito = await carritoService.getById(id)
    res.json({
        carrito_eliminado: carrito
    })
})

routerCarrito.get('/:id/productos', async (req, res) =>{
    const id = parseInt(req.params.id);
    const carrito = await carritoService.getById(id);
    res.json({
        productos:carrito
    })
})

routerCarrito.post('/:id/productos', async (req, res)=>{
    const id = parseInt(req.params.id);
    const idNewProducto = await req.body.id;
    const newProducto = await productosService.getById(idNewProducto)
    await carritoService.saveProduct(id, newProducto);
    console.log("Producto guardado")
    res.json({
        producto_guardado:newProducto
    })
})

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) =>{
    const id = parseInt(req.params.id);
    const id_prod = parseInt(req.params.id_prod);
    await carritoService.deleteProductById(id, id_prod)
    console.log("Producto eliminado")
    const carrito = await carritoService.getById(id);
    res.json({
        productos:carrito
    })
})

app.get('/historial', async (req, res) =>{
    const miHistorial = await historial.getAll();
    console.log(miHistorial)
    res.json({
        Historial:miHistorial
    })
});

app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);

