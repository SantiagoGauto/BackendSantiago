import { getRandomInt } from "./scripts/random.js";
process.send("preparado");

process.on("message",(parentMsg)=>{
    if(!isNaN(parentMsg)){
        const resultado = getRandomInt(parentMsg);
        process.send(resultado)
    }
});