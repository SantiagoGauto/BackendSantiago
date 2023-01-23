const {options} = require("../config/databaseConfig");
const knex = require("knex");

const dataMariaDB = knex(options.mariaDB);

const databaseSqlite = knex(options.sqliteDB);


const createTable = async() =>{
    try{
        let productosTable = await dataMariaDB.schema.hasTable("productos");
        if(productosTable){
            await dataMariaDB.schema.dropTable("productos");
        }
        await dataMariaDB.schema.createTable("productos", table=>{
            table.increments("id");
            table.string("title", 45).nullable(false);
            table.integer("price").nullable(false);
            table.string("thumbnail", 300).nullable(false);
        });
        console.log("tabla productos creada");

        let chatTable = await databaseSqlite.schema.hasTable("chat");
        if(chatTable){
            await databaseSqlite.schema.dropTable("chat");
        }
        await databaseSqlite.schema.createTable("chat", table =>{
            table.increments("id");
            table.string("name", 45).nullable(false);
            table.string("message", 300).nullable(false);
        });
        console.log("tabla chat creada");
    }catch(error){
        console.log(error)
    }
    dataMariaDB.destroy();
    databaseSqlite.destroy();
}

createTable();