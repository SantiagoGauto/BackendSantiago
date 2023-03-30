import Koa from 'koa';
import Router from 'koa-router';
import mongo from 'koa-mongo';
import {koaBody} from 'koa-body';
import { productsRouter } from './routes/productos.routes.js';
import { logger } from './controllers/logger/log4js.js';


const app = new Koa();
const router = new Router();

app.use(koaBody());

app.use(mongo({
    uri: 'mongodb+srv://Santidd11:coder.backend@cluster0.kc4fhea.mongodb.net/CoderDB?retryWrites=true&w=majority',
    max: 100,
    min: 1,
    timeout: 30000,
    log: false
}));


app.use(productsRouter.routes());
app.use(productsRouter.allowedMethods());

app.listen(3000);
logger.info('Servidor corriendo en http://localhost:3000/');
