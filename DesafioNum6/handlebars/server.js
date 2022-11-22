const express = require('express');
const app = express();
const port = 8080;
const server = app.listen(port,() =>{ console.log("Servidor corriendo en el puerto 8080")});
const path = require('path');
const handlebars = require('express-handlebars');
const {Server} = require('socket.io');

//api
const Container = require('./public/Container');
const data = new Container('./public/productos.txt')


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

