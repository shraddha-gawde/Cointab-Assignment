const {DataTypes} = require("sequelize")
const connection = require("../db")

const UserModel = connection.define('users', {
    id:{ type:DataTypes.NUMBER, primaryKey:true },
    name:{ type:DataTypes.STRING, allowNull:false },
    email:{ type:DataTypes.STRING, allowNull:false, unique:true },
    city:{ type:DataTypes.STRING, },
    phone:{ type:DataTypes.STRING(40), allowNull:false },
    website:{ type:DataTypes.STRING },
    company:{ type:DataTypes.STRING }
},{
    timestamps:false,
})

module.exports={ UserModel }