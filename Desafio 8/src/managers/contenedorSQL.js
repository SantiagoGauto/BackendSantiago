const knex = require("knex");


class contenedorSQL{
    constructor(options, table){
        this.database = knex(options);
        this.table = table;
    }

    async getAll(){
        try {
            const response = await this.database.from(this.table).select("*");
            return response;
        } catch (error) {
            return `Hubo un error ${error}`;
        }
    }
    async save(object){
        try {
            const [id] = await this.database.from(this.table).insert(object);
            return `Guardado correctamente con el ID ${id}`;
        } catch (error) {
            return `Hubo un error ${error}`;
        }
    }
}

module.exports = {contenedorSQL};