const express = require('express');
const app = express();
const port = 8080;
const server = app.listen(port,() =>{ console.log("Servidor corriendo en el puerto 8080")});
const path = require('path');
const handlebars = require('express-handlebars');
const {Server} = require('socket.io');
const {options} = require('./config/databaseConfig');
import { normalize, schema } from 'normalizr';

//api
const Container = require('./public/Container');
const {mysqlContainer} = require('./public/mysqlContainer');
const { CLIENT_RENEG_LIMIT } = require('tls');
/* const data = new Container('./public/productos.txt') */
const data = new mysqlContainer(options.mariaDB, "productos");
const chat = new mysqlContainer(options.sqliteDB, "chat");


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

//handlebars
const viewFolder = path.join(__dirname, "views");

app.engine("handlebars", handlebars.engine());
app.set("views", viewFolder);
app.set("view engine", "handlebars");

//websocket
const messages = [
    {email:"mdiannibelli@gmail.com", time:"17/11/2022 : 11:34", msg:"Hola buen día"}
]
const io = new Server(server);

io.on("connection", async(socket) =>{
    console.log("nuevo cliente conectado")
    //1- enviar mensajes al cliente
    socket.emit("messagesChat", messages)
    //4- recibir msjs del form
    socket.on("newMessage", (data) =>{
        messages.push(data);

        //5- enviamos los mensajes a todos los clientes conectados
        io.sockets.emit("messagesChat", messages)
    })


    //cada vez que un cliente se conecte recibira los productos actuales
    socket.emit("products", await data.getAll());
    socket.on("newProduct", async(product) =>{
        //recibimos y guardamos el producto que cargo el cliente
        await data.save(product);

        // mandamos los productos actualizados
        io.sockets.emit("products", await data.getAll())
    })
}); // estamos pendiente de la conexion del cliente

//rutas

app.get("/", async(req,res) =>{
    const productos = await data.getAll();
    res.render("home", {
        productos: productos
    })
});

app.get("/productos", async(req,res) =>{
    const products = await data.getAll();
    if(products.length === 0) {
        res.json("No hay productos disponibles")
    } else {
        res.render("productos", {
            products
        })
    }
})

app.post("/productos", async(req,res) =>{
    const newProduct = req.body;
    await data.save(newProduct);
    res.redirect("/");
})

//chat
io.on("connection", async(socket) =>{
    io.sockets.emit("messages", await normalizarMsgs());


    
    socket.on("newMessage", async(newMessage) =>{
        await chat.save(newMessage);
        io.sockets.emit("messages", await normalizarMsgs())
    });
})

socket.on("newMessage", async(newMessage) =>{
    console.log("newMessage", newMessage);
    await chat.save(newMessage);
    io.sockets.emit("messages", await normalizarMsgs());
});

//NORMALIZACION con normalizr
//schemas
const authorSchema = new schema.Entity("authors", {}, {idAttribute: "email"}) //id con el valor de "email" //el primer {} es vacio porque el schema que estamos creando no posee propiedades de tipo objeto
const messageSchema = new schema.Entity("messages", 
{
    author:authorSchema
} 
);
//esquema padre
/* const chatSChema = {
    id: "chatHistory",
    messages: [],/* <informacion del archivo chat.txtx> */

const chatSchema = new schema.Entity("chats", {
    messages: [messageSchema]
});

//aplicar normalizacion
const normalizarData = (data) =>{
    const dataNormalizada = normalize({id:"chatHistory", messages:data}, chatSchema);
    return dataNormalizada;
}

//funcion para normalizar los mensajes
const normalizarMsgs = async() => {
    const msgs = await chat.getAll();
    const normalizedMessages = normalizarData(msgs);
    return normalizedMessages;
}