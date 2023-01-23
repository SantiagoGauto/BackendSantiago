const express = require('express');
const { Router } = require('express');
const Contenedor = require("./managers/claseProductos");
const EnableAdmin = require("./managers/claseAdmin");
const Carrito = require("./managers/claseCarrito");
const path = require("path");
const bodyParser = require('body-parser');

const PORT = 8080;
const productosService = new Contenedor("productos.txt");
const adminService = new EnableAdmin("admin.txt");
const carritoService = new Carrito("carrito.txt");

const viewsFolder = path.join(__dirname,"views")

const app = express();
app.listen(PORT, ()=>console.log(`Servidor escuchando el puerto: ${PORT}`));

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

app.get('*', (req,res) => {
    res.send("Error 404, ruta y/o metodo no implementado")
})

//Main
app.post("/",async(req,res)=>{
    const adminRes = await req.body;
    if(adminRes["admin"] === "S"){
        adminService.save(true)
    }else{
        adminService.save(false)
    }
    res.redirect("/productos");
})

//Productos
routerProductos.get('/', async (req, res) =>{
    const productos = await productosService.getAll();
    res.render("productos", {
        productos:productos
    })
})

routerProductos.get('/:id', async (req, res) =>{
    const id = parseInt(req.params.id);
    let productos = []
    const producto = await productosService.getById(id);
    productos.push(producto)
    res.render("productos", {
        productos:productos
    })
})

routerProductos.post('/', async (req, res) =>{
    admin = await adminService.get();
    if (admin === true){
        res.render("postProducto")
        const newProduct = await req.body;
        newProduct.timestamp = newDate()
        productosService.save(newProduct)
    }
})

routerProductos.put('/:id', async (req, res) =>{
    admin = await adminService.get();
    if (admin === true){
        const id = parseInt(req.params.id)
        const newProduct = await req.body;
        newProduct.timestamp = newDate()
        productosService.updateByID(id, newProduct)
        res.redirect("/productos");
    }
})

routerProductos.delete('/:id', async (req, res) =>{
    admin = await adminService.get();
    if (admin === true){
        const id = parseInt(req.params.id)
        productosService.deleteById(id)
        res.redirect("/productos");
    }
})

//Carrito
routerCarrito.post('/', async (req, res) =>{
    const newCarrito = {};
    const newProduct = await req.body;
    newCarrito.timestamp = newDate()
    newCarrito.productos = [newProduct]
    await carritoService.save(newCarrito)
    console.log("Carrito agregado");
    const carrito = await carritoService.getAll();
    res.json({
        carrito: carrito
    })
})

routerCarrito.delete('/:id', async (req, res) =>{
    const id = parseInt(req.params.id);
    console.log(id)
    carritoService.deleteById(id);
    console.log("Carrito eliminado")
    const carrito = await carritoService.getAll();
    res.json({
        carrito: carrito
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
    const carrito = await carritoService.getById(id);
    res.json({
        productos:carrito
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

app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);

