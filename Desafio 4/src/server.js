const express = require('express');

const { Router } = require('express');

const PORT = 8080;

const app = express();


try{
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.use(express.static("public"));
    app.listen(PORT, ()=>{
        console.log(`Servidor escuchando el puerto: ${PORT}`);
    })
}catch(error){
    console.log(`error:${error}`)
}


let productos = [
    {
        "title": "Teclado",
        "thumbnail": "https://m.media-amazon.com/images/I/71yGtauB-AL._AC_SY450_.jpg",
        "price": 20000,
    },
    {
        "title": "Mouse",
        "thumbnail": "https://mexx-img-2019.s3.amazonaws.com/mouse-logitech-gamer-rgb-lila_38560_5.jpeg?v187",
        "price": 9000,
    },
    {
        "title": "Monitor",
        "thumbnail": "https://www.lg.com/es/images/monitores/MD06025876/gallery/medium03.jpg",
        "price": 104000,
    },
    {
        "title": "Motherboard",
        "thumbnail": "https://m.media-amazon.com/images/I/51OVWRFJxsL._AC_SY580_.jpg",
        "price": 75000,
    },
    {
        "title": "Procesador",
        "thumbnail": "http://www.karlosperu.com/wp-content/uploads/2017/06/Intel-procesador.jpg",
        "price": 63000,
    },
    {
        "title": "Placa de video",
        "thumbnail": "https://images.fravega.com/f500/02392f4a30189dbbebfd0d9cf5b8de3a.jpg",
        "price": 335499,
    }
];

productos.forEach(elemento => elemento.id = productos.indexOf(elemento) + 1)

const routerProductos = Router();

routerProductos.get('/', (req, res) =>{
    res.json({
        productos
    })
})

routerProductos.get('/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        res.json({
            error: 'El parámetro no es un número.'
        })
    }else{
        const producto = productos.find(elemento => elemento.id == id)
        if (producto == undefined){
            res.json({
                msg: "producto no encontrado"
            })
        }else{
            res.json({
                producto
            })
        }
    }

})

routerProductos.post('/',(req,res)=>{
    let producto = req.body;
    console.log(req.body)
    const newId = productos.length + 1;
    producto.id = newId;
    productos.push(producto);
    res.json({
        msg: `Se agrego el producto: ${producto.title} con el id: ${newId} `
    })
})

routerProductos.delete('/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    console.log(productos.length);
    const producto = productos[id];
    if(isNaN(id)){
        res.json({
            error: 'El parámetro no es un número.'
        })
    }else{
        producto == undefined
        ? res.status(500).json({
            error: 'El parámetro está fuera de rango'
        })
        : 
        productos = productos.filter(elemento => elemento.id !== producto.id )
        res.json({
            msg: `Se eliminó el producto: ${producto.name} con el id: ${id} `
        })
    }

})

app.use('/productos', routerProductos);
