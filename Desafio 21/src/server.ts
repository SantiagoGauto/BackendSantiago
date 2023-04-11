import { Application, config } from "../depts.ts";
import { productRouter } from "./routes/productos.routes.ts";


const port = 8080;


const app = new Application();

app.use(async (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    await next();
});

app.use(productRouter.routes());

app.listen({port});
console.log(`Server listening on port ${port}`);