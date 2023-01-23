import express from 'express';
import handlebars from 'express-handlebars'
import path from 'path';
import {fileURLToPath} from 'url';
import { ContenedorDaoChat } from './daos/fabric.js';
import { Server } from 'socket.io';
import { normalize, schema } from 'normalizr';
import { faker } from '@faker-js/faker';
faker.locale="es";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { options } from './config/DBConfig.js';


const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mensajesDB = ContenedorDaoChat;
const viewsFolder = path.join(__dirname,"views");
const {commerce, image} = faker;

//Servidor express
const app = express();
const server = app.listen(PORT, ()=>console.log(`Servidor escuchando el puerto: ${PORT}`));
app.use(express.static(__dirname+"/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Handlebars
app.engine("handlebars",handlebars.engine());
app.set("views", viewsFolder);
app.set("view engine", "handlebars");

//Cokkies
app.use(cookieParser());

//Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: options.mongoAtlasSessions.url,
    }),
    secret:"secreto",
    cookie: { maxAge: 600000},
    resave:false,
    rolling:true,
    saveUninitialized:false
}))

//Normalizacion
const authorSchema = new schema.Entity("authors",{},{idAttribute:"email"});
const messageSchema = new schema.Entity("messages",
    {
        author:authorSchema
    }
);
const chatSchema = new schema.Entity("chat",
    {
        messages:[messageSchema]
    }
);
const normalizadorDatos = (data) =>{
    const dataNormalizada = normalize({id:"chatHistory", messages:data}, chatSchema);
    return dataNormalizada;
};

const normalizadorMensajes = async () =>{
    const messages = await mensajesDB.getAll();
    const normalizedMessages = normalizadorDatos(messages);
    return normalizedMessages;
};

//Faker
let products =[];
    for(let i =0;i<5;i++){
        products.push(
            {
                title: commerce.product(),
                price: commerce.price(),
                thumbnail: image.technics(200, 200, true)
            }
        )
    }

//Socket
const io = new Server(server);
io.on("connection", async(socket)=>{
    console.log("nueva Conexion")
    socket.emit("productsArray", products);

    socket.on("enableChat", async()=>{
        socket.emit("chatArray", await normalizadorMensajes());
    })
    socket.on("newMessage", async(data)=>{
        await mensajesDB.save(data);
        io.sockets.emit("chatArray", await normalizadorMensajes())
    })
})



app.get("/",(req,res)=>{
    if (req.session.user){
        res.render("index",{name: req.session.user})
    } else{
        res.redirect("/login")
    }
})

app.get('/productos', async(req, res) =>{
    res.render("productos", {
        productos:products
    })
})

app.get("/login", async(req, res) =>{
    res.render("login");
})

app.post("/login", async(req, res) =>{
    const {name} = req.body;
    req.session.user = name
    res.redirect("/")
})

app.get("/logout", async(req, res) =>{
    const nombre = await req.session.user;
    req.session.destroy(err =>{
        if(err){
            return res.redirect("/")
        }else{
            res.render("logout", {name: nombre});
        }
    });
})