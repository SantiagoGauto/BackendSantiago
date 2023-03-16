import express from "express"
import {UserModel} from "../../dbOperations/models/user.js"
import { logger } from "../../controllers/logger/log4js.js";
import { transporter, testMail } from '../../services/messages/mail.js';
import { routerCarrito } from "./carrito.routes.js";
import { routerProductos } from "./productos.routes.js";
import { routerEnvio } from "./envio.routes.js";
import passport from "passport";

const router = express.Router();

const isAuthenticated =  (req, res, next) => {
    if (req.isAuthenticated())
	    return next();
    res.redirect('/login');
}

router.get("/", isAuthenticated, (req,res)=>{
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
router.get("/login", async(req, res) =>{
    logger.info("Ruta '/login' en metodo get")
    res.render("login", {message: req.flash('message')});
})

router.post('/login', passport.authenticate('LoginStrategy', {
    failureRedirect: '/',
    failureFlash:true
}), (req, res)=>{
    logger.info("Ruta '/login' en metodo post")
    const {email} = req.body
    req.session.usuario = email
    res.redirect("/")
});

router.get("/signup", async(req, res) =>{
    logger.info("Ruta '/signup' en metodo get")
    res.render("signup",{message: req.flash('message')});
})

router.post('/signup', passport.authenticate('SignUpStrategy', {
    failureRedirect: '/signup',
    failureFlash: true
}), async (req, res)=>{
    const {email} = req.body
    const {password} = req.body
    const {name} = req.body
    const {dir} = req.body
    const {age} = req.body
    const {tel} = req.body
    const {thumbnail} = req.body
    try{
        await transporter.sendMail({
            from: "Server",
            to: testMail,
            subject: `Nuevo Registro`,
            text: `Datos de registro:\n Email: ${email}\n Password: ${password}\n Name: ${name}\n Dir: ${dir}\n Age: ${age}\n Tel: ${tel}\n Thumbnail: ${thumbnail}`
        })
    }catch (error){
        logger.error(error)
    }
    res.redirect("/login")
});

router.get("/logout", async(req, res) =>{
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

router.use("/productos", routerProductos);
router.use("/carrito", routerCarrito);
router.use("/envio", routerEnvio);

export {router}