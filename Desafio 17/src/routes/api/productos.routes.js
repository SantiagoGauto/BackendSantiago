import express from "express"
import { ContenedorDaoProductos } from '../../dbOperations/daos/fabric.js';
import {UserModel} from "../../dbOperations/models/user.js"


const router = express.Router();
const productosService = ContenedorDaoProductos;

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
    const productos = await productosService.getAll();
    if(req.session.usuario){
        UserModel.findOne({email:req.session.usuario}, (err, usuario)=>{
            if(err){
                logger.error(err)
            }else{
                const id = usuario._id;
                res.render("products",{
                    productos:productos,
                    idUser: id.valueOf()
                })
            }
        })
    }else{
        res.render("products",{
            productos:productos
        })
    }
})

router.get('/:id', async (req, res) =>{
    const id = parseInt(req.params.id);
    let productos = []
    const producto = await productosService.getById(id);
    productos.push(producto)
    res.json({
        producto:productos
    })
})

router.post('/', async (req, res) =>{
    res.render("postProducto")
    const newProduct = await req.body;
    newProduct.timestamp = newDate()
    productosService.save(newProduct)
})

router.put('/:id', async (req, res) =>{
    const id = parseInt(req.params.id)
    const newProduct = await req.body;
    newProduct.timestamp = newDate()
    productosService.updateByID(id, newProduct)
    res.json({
        producto_nuevo: newProduct
    })
})

router.delete('/:id', async (req, res) =>{
    const id = parseInt(req.params.id)
    const producto = await productosService.getById(id)
    await productosService.deleteById(id)
    res.json({
        producto_eliminado: producto 
    });
})

export {router as routerProductos};