const e = require('express');
const {Sequelize} = require('sequelize')

//LOCAL CONNECTION
const sequelize = new Sequelize('kalm_db','root','thanhvandang58',{
    dialect: 'mysql',
    host:'localhost',
    logging: false
});

const checkConnection = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

    } catch (error) {
        console.error("Unable to connect to the database.")
    }
}
checkConnection()
module.exports = sequelize