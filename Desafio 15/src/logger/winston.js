import log4js from "log4js";
import { envConfig } from "../config/envConfig.js";

log4js.configure({
    appenders:{
        consola:{type:"console"},
        errores:{type:"file",filename:"./src/logs/error.log"},
        warn:{type:"file",filename:"./src/logs/warn.log"},
        consolaInfo:{type:'logLevelFilter',appender:'consola', level:'info'},
        consolaWarn:{type:'logLevelFilter',appender:'consola', level:'warn'},
        consolaError:{type:'logLevelFilter', appender:'consola', level:'error'},
        archivoWarn:{type:'logLevelFilter',appender:'warn', level:'warn'},
        archivoErrores:{type:'logLevelFilter', appender:'errores', level:'error'}
    },
    categories:{
        default:{appenders:['consolaInfo','archivoWarn','archivoErrores'], level:'all'},
        prod:{appenders:['archivoWarn','archivoErrores'],level:'all'}
    }
});


let logger = log4js.getLogger();

export {logger};