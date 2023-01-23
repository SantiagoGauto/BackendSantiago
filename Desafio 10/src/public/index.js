console.log("cliente");
const socketClient = io();

//Denormalizacion
const authorSchema = new normalizr.schema.Entity("authors",{},{idAttribute:"email"});
const messageSchema = new normalizr.schema.Entity("messages",
    {
        author:authorSchema
    }
);
const chatSchema = new normalizr.schema.Entity("chat",
    {
        messages:[messageSchema]
    }
);


const productForm = document.getElementById("productForm");


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
        title: 'Perfil formulario',
        html: `<input type="email" id="email" class="swal2-input" placeholder="Correo electronico">
        <input type="text" id="name" class="swal2-input" placeholder="Nombre">
        <input type="text" id="lastname" class="swal2-input" placeholder="Apellido">
        <input type="number" id="age" class="swal2-input" placeholder="Edad">
        <input type="text" id="nickname" class="swal2-input" placeholder="Alias">
        <input type="text" id="avatar" class="swal2-input" placeholder="Avatar">`,
        confirmButtonText: 'Confirmar',
        focusConfirm: false,
        preConfirm: () => {
            const email = Swal.getPopup().querySelector('#email').value;
            const name = Swal.getPopup().querySelector('#name').value;
            const lastname = Swal.getPopup().querySelector('#lastname').value;
            const age = Swal.getPopup().querySelector('#age').value;
            const nickname = Swal.getPopup().querySelector('#nickname').value;
            const avatar = Swal.getPopup().querySelector('#avatar').value;
            if (!email || !name || !lastname || !age || !nickname || !avatar) {
                Swal.showValidationMessage(`Por favor completa todos los campos`)
            }
            return { email, name,lastname, age, nickname, avatar }
        },
        allowOutsideClick: false,
    }).then((result) => {
        Swal.fire(`
            Correo: ${result.value.email}
            Nombre: ${result.value.name}
            Apellido: ${result.value.lastname}
            Edad: ${result.value.age}
            Alias: ${result.value.nickname}
            Avatar: ${result.value.avatar}
        `.trim())
        user = result.value;
        messagesForm.className = "form-floating row align-items-center";
        socketClient.emit("enableChat", true);
    });
})

let messagesShow = document.getElementById("messagesShow");
let messagesPorcentaje = document.getElementById("messagesPorcentaje");

socketClient.on("chatArray", async(data)=>{
    const dataLength = JSON.stringify(data, null, "\t").length;
    const dataDenormalized = normalizr.denormalize(data.result, chatSchema, data.entities);
    const dataDenLength = JSON.stringify(dataDenormalized, null, "\t").length;
    const porcentaje = parseInt(100 - dataDenLength/dataLength * 100)
    let templateChat = await fetch("./templates/chat.handlebars");
    templateChat = await templateChat.text();
    const template = Handlebars.compile(templateChat);
    const htmlchat = template({chats:dataDenormalized.messages});
    messagesShow.innerHTML = htmlchat;
    messagesPorcentaje.innerHTML = `<p>Compresión %${porcentaje} </p>`
})

const messagesContainer = document.getElementById("messagesContainer");
const messagesForm = document.getElementById("messagesForm");

messagesForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const chat = {
        author: user,
        text: document.getElementById("textAreaMessage").value
    }
    socketClient.emit("newMessage", chat);
    messagesForm.reset();
})