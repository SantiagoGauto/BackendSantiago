const {options} = require("../config/databaseConfig");
const knex = require("knex")

const databaseMariadb = knex(options.mariaDB);

//crear la base de datos sqlite
const databaseSqlite = knex(options.sqliteDB);


const createTables = async() =>{
    try {
        let productTables = await databaseMariadb.schema.hasTable("productos");
        if(productTables) {
            await databaseMariadb.schema.dropTable("productos")
        } else {
            //creamos la tabla
            await databaseMariadb.schema.createTable("productos", table=>{
                table.increments("id");
                table.string("title",40).nullable(false);   //para que no se le puedan ingresar numeros 
                table.integer("price").nullable(false);
                table.string("thumbnail",200).nullable(false);        
            })
        }
        console.log("tabla creada correctamente");

        let chattable = await databaseSqlite.schema.hasTable("chat");
        if(chattable) {
            await databaseSqlite.schema.dropTable("chat")
        } else {
            await databaseSqlite.schema.createTable("chat", table=>{
                table.increments("id");
                table.string("email",30);
                table.string("time",20);
                table.string("msg",200);
            })
        }
        console.log("chat creado correctamente")
    } catch (error) {
        console.log(error)
    }
    databaseMariadb.destroy();
    databaseSqlite.destroy();
}

createTables();
