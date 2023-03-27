import {expect} from "chai";
import { app } from "../server.js";
import supertest from "supertest";

const request = supertest(app);

describe("api productos andpoints", ()=>{
  let responseCreate;
  it("Obtener todos los productos", async()=>{
    const responseProduct = await request.get("/productos");
    const largo = responseProduct.body
    expect(largo.productos.length).equal(5)
  })

  it("Cargar un producto"), async()=>{

    const newProduct = {
      code: 1111,
      title: 'Test',
      price: 1111,
      thumbnail: 'test',
      timestamp: 'xx-xx-xxx',
      description: 'Test New Product',
      stock: 11,
  }

  const response = await request.post("/productos").send(newProduct);
  expect(response.status).to.equal(200);
  expect(response.body.code).to.equal(1111);

  const responseProduct = await request.get("/productos");
  const productos = responseProduct.body.productos;
  const ultimoProducto = productos[productos.length - 1];

  expect(ultimoProducto.code).to.equal(1111);
  }
})