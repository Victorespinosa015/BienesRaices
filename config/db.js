import Sequelize  from 'sequelize'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS,{
    host: process.env.DB_HOST,
    port: '3306',
    dialect: 'mysql',
    define: {
        timestamps:true //Cuando un usuario se registra agrega dos columnas extras a la tabla de usuarios una es cuando se crea y otra cuando se actualiza
    },
    poool: { //Reutiliza las conexiones que esten funcionando para ahorrar recursos de la db
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
}) 

export default db