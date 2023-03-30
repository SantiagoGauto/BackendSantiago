import Router from "koa-router";
import { ContenedorDaoProductos } from "../dbOperations/daos/fabric.js";


const router = new Router({
    prefix:"/productos" 
});

const productosService = ContenedorDaoProductos;

const newDate = () => {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = mm + '-' + dd + '-' + yyyy;
    return today;
};

router.get('/', async (ctx) => {
    const productos = await productosService.getAll();
    ctx.body = {
        productos: productos
    };
});

router.get('/:id', async (ctx) => {
    const id = parseInt(ctx.params.id);
    let productos = [];
    const producto = await productosService.getById(id);
    productos.push(producto);
    ctx.body = {
        producto: productos
    };
});

router.post('/', async (ctx) => {
    const newProduct = await ctx.request.body;
    await productosService.save(newProduct);
    const productos = await productosService.getAll();
    ctx.body = {
        productos
    };
});

router.put('/:id', async (ctx) => {
    const id = parseInt(ctx.params.id);
    const newProduct = await ctx.request.body;
    newProduct.timestamp = newDate();
    await productosService.updateByID(id, newProduct);
    ctx.body = {
        producto_nuevo: newProduct
    };
});

router.delete('/:id', async (ctx) => {
    const id = parseInt(ctx.params.id);
    const producto = await productosService.getById(id);
    await productosService.deleteById(id);
    ctx.body = {
        producto_eliminado: producto
    };
});

export {router as productsRouter};
