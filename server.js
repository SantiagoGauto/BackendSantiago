const express = require('express');
const port = 8080;
const app = express();
const Contenedor = require('./public/Container')
const data = new Contenedor('./public/productos.txt');

const routerExpress = express.Router();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.listen(port, ()=>{
    console.log(`Server running in port ${port}`);
})

let error = {
    error: false,
    code: 200,
    msg: ''
}

routerExpress.get("/", async (req, res)=>{
    const products = await data.getAll()
    res.json({
        products
    })
});

routerExpress.get('/:id', async (req,res) =>{
    const idp = parseInt(req.params.id);
    const productId = await data.getById(idp);
    if(isNaN(idp)) {
        error = {
            error: true,
            code: 502,
            msg: 'The parameter entered is not a number'
        }
        res.json({
            error
        })
    } else {
        error = {
            error: true,
            code: 502,
            msg: 'The parameter is out of range'
        }
        productId == undefined ? res.json({error}) : res.json({productId});
    }
});

routerExpress.post('/', async(req,res) =>{
    let product = req.body;
    await data.save(product);

    res.json({
        product
    })

})

routerExpress.put('/:id', async(req,res) =>{
   let { title, price} = req.body;
   const id = parseInt(req.params.id);

   let product = await data.getById(id);
   product["title"] = title;
   product["price"] = price;

   const newProduct = {
    "title" : title,
    "price" : price,
    ...product
   }

   await data.deleteById(product.id);
   await data.overwrite(newProduct)

   if(isNaN(id)) {
    error = {
        error: true,
        code: 502,
        msg: 'The parameter is out of range'
    }
    res.json({error})
} else {
    product == undefined ? res.json({error}) : res.json({newProduct});
}
})

routerExpress.delete('/:id', async(req,res) => {
    const id = parseInt(req.params.id);
    const product = await data.deleteById(id);

    if(isNaN(id)){
        error = {
            error: true,
            code: 502,
            msg: 'The parameter entered is not a number'
        }
        res.json({error})
    } else {
        product == undefined && res.json({msg: "Product has been deleted"});
    }

})



app.use("/api/productos", routerExpress);