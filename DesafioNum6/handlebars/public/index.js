console.log("index js");
const socketChat = io();

//chat
const chatContainer = document.getElementById("chatContainer");
//2- recibimos msjs y los mostramos
socketChat.on("messagesChat", (data) =>{
    let messages = "";
    data.forEach(element =>{
        messages += `<div class="message"><p class="textEmail">${element.email}</p><p class="textTime">(${element.time}):</p><p class="textMsg">${element.msg}</p></div>`
    })
    chatContainer.innerHTML = messages;
})

//2- capturamos el email del usuario
let email = "";
Swal.fire({
    title: "Bienvenido",
    text: "Ingrese su email",
    input: "text",
    allowOutsideClick: false
}).then (res =>{
    email = res.value;
    document.getElementById("email").innerHTML = `<h4>Bienvenido ${email}</h4>`
})



//3-  enviamos un mensaje al servidor desde el frontend (form)
const chatForm = document.getElementById("chatForm");
let date = new Date();
let fecha = date.getDate() +'/' + (date.getMonth() + 1) + '/' + date.getFullYear();
let hora = date.getHours() + ':' + date.getMinutes();
chatForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    const message = {
        email: email,
        time: fecha+' : '+hora,
        msg: document.getElementById("messageChat").value
    }
    socketChat.emit("newMessage", message)
})
