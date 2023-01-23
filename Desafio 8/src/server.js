const express = require('express');
const handlebars = require("express-handlebars");
const path = require("path");
const {options} = require("./config/databaseConfig")
const {contenedorSQL} = require("./managers/contenedorSQL");
const {Server} = require("socket.io");

const PORT = 8080;
const productosDB = new contenedorSQL(options.mariaDB, "productos");
const mensajesDB = new contenedorSQL(options.sqliteDB, "chat");
const viewsFolder = path.join(__dirname,"views");

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

//Socket
const io = new Server(server);
io.on("connection", async(socket)=>{
    console.log("nueva Conexion")
    socket.emit("productsArray", await productosDB.getAll());

    socket.on("enableChat", async()=>{
        socket.emit("chatArray", await mensajesDB.getAll());
    })
    socket.on("newProduct", async(data)=>{
        await productosDB.save(data);
        io.sockets.emit("productsArray", await productosDB.getAll())
    })
    socket.on("newMessage", async(data)=>{
        await mensajesDB.save(data);
        io.sockets.emit("chatArray", await mensajesDB.getAll())
    })
})



app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/productos', async(req, res) =>{
    const productos = await productosDB.getAll();
    res.render("productos", {
        productos:productos
    })
})



