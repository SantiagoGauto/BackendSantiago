console.log("cliente");
const socketClient = io();

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const product = {
        title: document.getElementById("title").value,
        thumbnail: document.getElementById("thumbnail").value,
        price: document.getElementById("price").value
    }
    socketClient.emit("newProduct", product);
    productForm.reset();
});

const productsShow = document.getElementById("productsShow");
socketClient.on("productsArray", async(data)=>{
    let templateTable = await fetch("./templates/table.handlebars");
    templateTable = await templateTable.text();
    const template = Handlebars.compile(templateTable);
    const html = template({products:data});
    productsShow.innerHTML = html;
})

let user = "";
const buttonChat = document.getElementById("buttonChat");


let temForm = document.getElementById("tempForm");
temForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    Swal.fire({
        title:"Bienvenido",
        text:"Ingresa tu email",
        input:"text",
        allowOutsideClick: false
    }).then(response=>{
        user = response.value;
        messagesForm.className = "form-floating row align-items-center";
        socketClient.emit("enableChat", true);
    })
})

let messagesShow = document.getElementById("messagesShow");

socketClient.on("chatArray", async(data)=>{
    let templateChat = await fetch("./templates/chat.handlebars");
    templateChat = await templateChat.text();
    const template = Handlebars.compile(templateChat);
    const htmlchat = template({chats:data});
    messagesShow.innerHTML = htmlchat;
})

const messagesContainer = document.getElementById("messagesContainer");
const messagesForm = document.getElementById("messagesForm");

messagesForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const chat = {
        name: user,
        message: document.getElementById("textAreaMessage").value
    }
    socketClient.emit("newMessage", chat);

})