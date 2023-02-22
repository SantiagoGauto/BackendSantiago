import { ContenedorDaoCarts, ContenedorDaoProductos } from './daos/fabric.js';
import express from "express";
import handlebars from 'express-handlebars'
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { Router } from 'express';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { EnableAdmin } from './managers/claseAdmin.js';
import path from 'path';
import bodyParser from 'body-parser';
import { logger } from './logger/log4js.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import InitPassport from './passport/initPassport.js';
import { UserModel } from './models/user.js';
import { transporter, testMail } from './messages/mail.js';

const PORT = 8080;
const productosService = ContenedorDaoProductos;
const adminService = new EnableAdmin("admin.txt");
const carritoService = ContenedorDaoCarts
const viewsFolder = path.join(__dirname,"views")


const app = express();
app.listen(PORT, ()=>{
    logger.info(`Servidor escuchando el puerto: ${PORT}`)
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Handlebars
app.engine("handlebars",handlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("views", viewsFolder);
app.set("view engine", "handlebars");

//Mongo
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://Santidd11:coder.backend@cluster0.kc4fhea.mongodb.net/CoderDB?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology: true
},(error)=>{
    if(error){logger.error("Conexion fallida")};
    logger.info("Base de datos conectada correctamente")
});

//Cokkies
app.use(cookieParser());

//Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://Santidd11:coder.backend@cluster0.kc4fhea.mongodb.net/CoderDB?retryWrites=true&w=majority",
    }),
    secret: "secreto",
    cookie: { maxAge: 600000},
    resave:false,
    rolling:true,
    saveUninitialized:false
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash())

//Passport
InitPassport(passport);

//Serializacion y deserializacion
passport.serializeUser((user,done)=>{
    return done(null, user._id)
});
passport.deserializeUser((id,done)=>{
    UserModel.findById(id,(error,userFound)=>{
        return done(error,userFound)
    })
});

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

const isAuthenticated =  (req, res, next) => {
    if (req.isAuthenticated())
	    return next();
    res.redirect('/login');
}

//Home
app.get("/", isAuthenticated, (req,res)=>{
    logger.info("Ruta '/' en metodo get")
    UserModel.findOne({email:req.session.usuario}, (err, usuario)=>{
        if(err){
            logger.error(err)
        }else{
            const loginUser = usuario
            res.render("index",{
                usuario: loginUser,
                idUser: usuario._id.valueOf()
            })
        }
    })
})

//Authenticacion
app.get("/login", async(req, res) =>{
    logger.info("Ruta '/login' en metodo get")
    res.render("login", {message: req.flash('message')});
})

app.post('/login', passport.authenticate('LoginStrategy', {
    failureRedirect: '/',
    failureFlash:true
}), (req, res)=>{
    logger.info("Ruta '/login' en metodo post")
    const {email} = req.body
    req.session.usuario = email
    res.redirect("/")
});

app.get("/signup", async(req, res) =>{
    logger.info("Ruta '/signup' en metodo get")
    res.render("signup",{message: req.flash('message')});
})

app.post('/signup', passport.authenticate('SignUpStrategy', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
}));

app.get("/logout", async(req, res) =>{
    logger.info("Ruta '/logout' en metodo get")
    const nombre = await req.session.usuario;
    req.session.destroy(err =>{
        if(err){
            return res.redirect("/")
        }else{
            req.logout()
            res.render("logout", {name: nombre});
        }
    });
})

//Productos
routerProductos.get('/', async (req, res) =>{
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
    const carrito = await carritoService.getAll();
    res.json({
        carritos: carrito
    })
})

routerCarrito.get('/:id', async (req, res) =>{
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

routerCarrito.delete('/:id', async (req, res) =>{
    const id = parseInt(req.params.id);
    carritoService.deleteById(id);
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


routerCarrito.post('/:id/:id_prod', async (req, res)=>{
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

routerCarrito.get('/:id/:id_prod', async (req, res) =>{
    const id = req.params.id;
    const id_prod = parseInt(req.params.id_prod);
    await carritoService.deleteProductById(id, id_prod)
    res.redirect(`/carrito/${id}`)
})

//Correo

app.post("/envio/:idUser", async(req,res)=>{
    const idUser = req.params.idUser
    const usuario = UserModel.findOne({})
    try{
        await transporter.sendMail({
            from: correoUser,
            to: testMail,
            subject:
        })
    }catch (error){
        res.send(error)
    }
})


app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);

