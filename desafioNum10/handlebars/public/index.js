const { denormalize } = require("normalizr");

console.log("index js");
const socketChat = io();

//chat
/* const chatContainer = document.getElementById("chatContainer"); */
//2- recibimos msjs y los mostramos
socketChat.on("messagesChat", (data) =>{
  console.log(data);
  const dataMsg = normalizr.denormalize(data.result, chatSchema, data.entities);
  console.log("data", dataMsg);
    let messages = "";
    data.messages.forEach(element =>{
        messages += `<div class="message"><p class="textEmail">${element.name}</p><p class="textTime">(${element.timestamp}):</p><p class="textMsg">${element.msg}</p></div>`
    })
    chatContainer.innerHTML = dataMsg.messages;
})

//2- capturamos el email del usuario
let user = ``;

Swal.fire({
  title: 'Formulario',
  html: `<input type="email" id="email" class="swal2-input" placeholder="Correo electronico">
  <input type="text" id="name" class="swal2-input" placeholder="Nombre">
  <input type="text" id="lastname" class="swal2-input" placeholder="Apellido">`,
  confirmButtonText: 'Confirmar',
  focusConfirm: false,
  preConfirm: () => {
    const email = Swal.getPopup().querySelector('#email').value
    const name = Swal.getPopup().querySelector('#name').value
    const lastname = Swal.getPopup().querySelector('#lastname').value
    if (!email || !name || !lastname) {
      Swal.showValidationMessage(`Please complete the form`)
    }
    return { email: email, nombre: name, lastname: lastnaem }
  },
  allowOutsideClick: false,
}).then((result) => {
  Swal.fire(`
    Correo: ${result.value.email}
    Nombre: ${result.value.name}
    Apellido: ${result.value.lastname}
  `.trim())
  user = result.value;
  document.getElementById("email").innerHTML = `<strong>Bienvenido ${user.name} </strong`
})




//3-  enviamos un mensaje al servidor desde el frontend (form)
/* /* const chatForm = document.getElementById("chatForm"); */
let date = new Date();
const chatContainer = document.getElementById("chatContainer");
let fecha = date.getDate() +'/' + (date.getMonth() + 1) + '/' + date.getFullYear();
let hora = date.getHours() + ':' + date.getMinutes();
chatForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    const message = {
        /* email: email,
        time: fecha+' : '+hora,
        msg: document.getElementById("messageChat").value */
        author: user,
        texto: chatContainer.value,
        timestamp: fecha+` : `+hora
        /* timestamp: new Date.toLocaleString() */
    }
    socketChat.emit("newMessage", message)
})
 

//Denormalize
//schemas
const authorSchema = new normalizr.schema.Entity("authors", {}, {idAttribute: "email"}) //id con el valor de "email" //el primer {} es vacio porque el schema que estamos creando no posee propiedades de tipo objeto
const messageSchema = new normalizr.schema.Entity("messages", 
{
    author:authorSchema
} 
);
//schema padre
const chatSchema = new schema.Entity("chats", {
  messages: [messageSchema]
});
