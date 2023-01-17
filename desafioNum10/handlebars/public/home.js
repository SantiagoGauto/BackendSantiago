console.log("home js");
const socketClient = io();


//enviar producto a traves de socket
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    /* console.log("product", product) */
    socketClient.emit("newProduct", product)
});

const productsContainer = document.getElementById("productsContainer")

socketClient.on("products", async(data) =>{
    const templateTable = await fetch("./templates/template.handlebars");
    const templateFormat = await templateTable.text();

    // declaramos el template con el cdn de handlebars y le pasamos el formato que hicimos en la carpeta templates
    const template = Handlebars.compile(templateFormat);

    // generamos el html con el template+ datos de productos
    const html = template({products: data});
    console.log(html)
    productsContainer.innerHTML = html;
    
})
