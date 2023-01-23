const express = require('express');
const handlebars = require("express-handlebars");
const path = require("path");
const Contenedor = require("./managers/claseArchivos");
const {Server} = require("socket.io");

const PORT = 8080;
const productosService = new Contenedor("productos.txt");
const mensajesService = new Contenedor("mensajes.txt");
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
    console.log("Nueva conexion")
    socket.emit("productsArray", await productosService.getAll());

    socket.on("enableChat", async()=>{
        socket.emit("chatArray", await mensajesService.getAll());
    })
    socket.on("newProduct", async(data)=>{
        await productosService.save(data);
        io.sockets.emit("productsArray", await productosService.getAll())
    })
    socket.on("newMessage", async(data)=>{
        await mensajesService.save(data);
        io.sockets.emit("chatArray", await mensajesService.getAll())
    })
})



app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/productos', async(req, res) =>{
    const productos = await productosService.getAll();
    res.render("productos", {
        productos:productos
    })
})



