import express from "express"
import { ContenedorDaoCarts } from '../../dbOperations/daos/fabric.js';
import {UserModel} from "../../dbOperations/models/user.js"
import { twilioClient, twilioWhatsappPhone, adminWhatsappPhone } from '../../services/messages/whatsapp.js';
import { transporter, testMail } from '../../services/messages/mail.js';

const router = express.Router();
const carritoService = ContenedorDaoCarts;

router.post("/:idUser", async(req,res)=>{
    const idUser = req.params.idUser
    const loginUser = await UserModel.findOne({_id: idUser});
    const cart = await carritoService.getById(idUser);
    let productos = cart[0].productos;
    let productosText = "";

    
    for (const element of productos) {
        productosText += `Codigo: ${element.code}, Producto: ${element.title}, Precio: ${element.price} \n`
    }
    try{
        await transporter.sendMail({
            from: loginUser.email,
            to: testMail,
            subject: `Nuevo pedido de ${loginUser.name}, mail: ${loginUser.email}`,
            text: `Id: ${cart[0].id}, TimeStamp: ${cart[0].timestamp}\n Productos:\n ${productosText}`
        })
        await twilioClient.messages.create({
            from: twilioWhatsappPhone,
            to: adminWhatsappPhone,
            body: `Id: ${cart[0].id}, TimeStamp: ${cart[0].timestamp}\n Productos:\n ${productosText}`
        })
        await twilioClient.messages.create({
            from: twilioWhatsappPhone,
            to: `whatsapp:+549${loginUser.tel}`,
            body: `Compra realizada con exito`
        })
        await carritoService.deleteById(idUser)
        res.redirect("/")
    }catch (error){
        res.send(error)
    }
})

export {router as routerEnvio};