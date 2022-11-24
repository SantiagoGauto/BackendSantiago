
const express = require('express');
const app = express();

//Container y products.txt
const Contenedor = require('./public/Container');
const data = new Contenedor('./public/productos.txt');

//Carrito y cart
const CartProducts = require('./public/Cart');
const carrito = new CartProducts('./public/carrito.json');

//routes

const routerProducts = express.Router();
const routerCart = express.Router();

//port
const port = process.env.port || 8080;

app.listen(port, ()=>{
    console.log(`Server running in port ${port}`);
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

//errores
let noproductos = 'There are no products avaible'
let errorId = 'The parameter entered is not a number';
let errorOutOfRange = 'The parameter entered is out of range'

// admin
const admin = true;

//middleware
function validateAdmin(req, res, next) {
	if (admin == true) {
		next()
	} else {
		res.json({ error: "No tienes los permisos para realizar esta accion" })
	}
}

//productos
routerProducts.get('/', async (req,res) =>{
    const productos = await data.getAll();
   
    if(productos.length < 1) {
        res.json({noproductos})
    } else {
        res.json({
            productos
        })
    }
});

routerProducts.get('/:id', async(req,res) =>{
    const id = parseInt(req.params.id);
    const idProducto = await data.getById(id);
    if(isNaN(id)) {
       res.json({errorId})
    } else {
        idProducto == undefined ? res.json({errorOutOfRange}) : res.json({idProducto});
    }

});

routerProducts.post('/', validateAdmin ,async(req,res) =>{
    let product = req.body;
        await data.save(product);
        res.json({
            product
        })

})

routerProducts.put('/:id', validateAdmin, async(req,res) =>{
    let { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const id = parseInt(req.params.id);

   let product = await data.getById(id);
   product["nombre"] = nombre;
   product["descripcion"] = descripcion;
   product["codigo"] = codigo;
   product["foto"] = foto;
   product["precio"] = precio;
   product["stock"] = stock;
   
   const newProduct = {
    "nombre" : nombre,
    "descripcion" : descripcion,
    "codigo" : codigo,
    "foto" : foto,
    "precio" : precio,
    "stock" : stock,
    ...product
   }

   await data.deleteById(product.id);
   await data.overwrite(newProduct);

   if(isNaN(id)) {
    res.json({errorId})
} else {
    product == undefined ? res.json({errorOutOfRange}) : res.json({newProduct});
}
})

routerProducts.delete('/:id', validateAdmin, async(req,res) =>{
    const id = parseInt(req.params.id);
    const idProducto = await data.deleteById(id);
    if(isNaN(id)) {
        res.json({errorId})
     } else {
         idProducto == undefined && res.json({msg: "Product has been deleted"});
     }
})

//carrito
routerCart.post('/', async(req,res) =>{
    const cart = req.body;
    await carrito.createCart(cart)
    res.send({cart})
    return cart.id
})

routerCart.delete('/:id', async(req,res) =>{
    const id = parseInt(req.params.id);
    const idCart = await carrito.deleteById(id);
    if(isNaN(id)) {
        res.json({errorId})
     } else {
         idCart == undefined && res.json({msg: "Cart has been deleted"});
     }
})

routerCart.get('/:id/productos', async(req,res) =>{
    const id = parseInt(req.params.id);
    const productos = await carrito.getById(id);
    console.log(productos)
    if(isNaN(id)) {
        res.json({errorId})
     } else {
         productos == undefined ? res.json({errorOutOfRange}) : res.json(productos.products);
     }
})

routerCart.post('/:id/productos', async(req,res) =>{
    const idCart = parseInt(req.params.id);
    const carritoProductos = await carrito.getById(idCart);
    console.log(carritoProductos)
    if(carritoProductos == null) {
        res.json({msg: `El carrito ${idCart} no existe`})
        return
    }
    const idProduct = parseInt(req.body.id);
    const producto = await data.getById(idProduct);
    if (producto == null) {
        res.json({msg: `El producto ${idProduct} no existe`})
        return
    }
    carritoProductos.products.push(producto);
    await carrito.updateCart(idCart, carritoProductos);
    res.json({
        msg:"Se agrego el producto"
    })
})

routerCart.delete('/:id/productos/:id_prod', async(req,res) =>{
    const id = parseInt(req.params.id);
    const cartproducts = await carrito.getById(id);
    if(isNaN(req.params.id)) {
        res.json({errorId})
        return
    } 
    const idProducto = cartproducts.products.findIndex((element) => element.id == req.params.id_prod);
    if(idProducto == -1) {
        res.json({
            error: `Producto ${req.params.id_prod} no se encuentra en el carrito.`
        })
        return
    }
    cartproducts.products.splice(idProducto, 1)
    await carrito.updateCart(id, cartproducts);
    res.json({msg:"Se eliminó el producto del carrito"})
})




app.use("/api/productos", routerProducts);
app.use("/api/carrito", routerCart);