const path = require("path");

const options = {
    mariaDB: {
        client:'mysql',
        connection:{
            host:"127.0.0.1",
            user:"root",
            password:"",
            database:"chatdb"
        }
    },
    sqliteDB:{
        client:"sqlite",
        connection:{
            filename:path.join(__dirname, "../DB/ecommerce.sqlite")
        },
        useNullAsDefault:true
    }
}

module.exports = {options};