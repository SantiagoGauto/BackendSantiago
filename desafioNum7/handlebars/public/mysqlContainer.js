const knex = require("knex");


class mysqlContainer {
    constructor(options, tableName) {
        this.database = knex(options);
        this.table = tableName;
    }

    async getAll() {
        try {
            //obtenemos los registros de la tabla
            const response = await this.database.from(this.table).select("*");
            return response;
        } catch (error) {
            console.log(error)
        }
    }


    async save(object) {
        try {
            const [id] = await this.database.from(this.table).insert(object);
            console.log(`producto guardado con el id ${id}`);
        } catch (error) {
            console.log(error)
        }
    }
    
}

module.exports = {mysqlContainer};