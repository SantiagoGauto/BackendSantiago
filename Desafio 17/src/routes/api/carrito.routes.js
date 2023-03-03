import express from "express"
import { ContenedorDaoProductos, ContenedorDaoCarts } from '../../dbOperations/daos/fabric.js';


const router = express.Router();
const productosService = ContenedorDaoProductos;
const carritoService = ContenedorDaoCarts;

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

router.get('/', async (req, res) =>{
    const carrito = await carritoService.getAll();
    res.json({
        productos:carrito
    })
})

router.post('/', async (req, res) =>{
    const newCarrito = {};
    const newProduct = await req.body;
    newCarrito.timestamp = newDate()
    newCarrito.productos = [newProduct]
    await carritoService.save(newCarrito)
    const carrito = await carritoService.getAll();
    res.json({
        carritos: carrito
    })
})

router.get('/:id', async (req, res) =>{
    const id = req.params.id
    const carrito = await carritoService.getById(id);
    let productos = [];
    for (const element of carrito) {
        productos.push(element.productos)
    }
    res.render("cart",{
        products: productos[0],
        carrito:carrito,
        id:id
    })
})

router.delete('/:id', async (req, res) =>{
    const id = parseInt(req.params.id);
    carritoService.deleteById(id);
    const carrito = await carritoService.getById(id)
    res.json({
        carrito_eliminado: carrito
    })
})

router.get('/:id/productos', async (req, res) =>{
    const id = parseInt(req.params.id);
    const carrito = await carritoService.getById(id);
    res.json({
        productos:carrito
    })
})


router.post('/:id/:id_prod', async (req, res)=>{
    const id = req.params.id;
    const idNewProducto = parseInt(req.params.id_prod);
    let carrito = {};
    const newProduct = await productosService.getById(idNewProducto);
    try{
        carrito = await carritoService.getById(id);
    }catch{
        carrito = null
    }
    if(carrito.length > 0){
        await carritoService.saveProduct(id, newProduct);
    }else{
        const newCarrito = {};
        newCarrito.timestamp = newDate()
        newCarrito.productos = newProduct
        await carritoService.save(id, newCarrito)
    }
    res.redirect(`/carrito/${id}`)
})

router.get('/:id/:id_prod', async (req, res) =>{
    const id = req.params.id;
    const id_prod = parseInt(req.params.id_prod);
    await carritoService.deleteProductById(id, id_prod)
    res.redirect(`/carrito/${id}`)
})

export {router as routerCarrito};