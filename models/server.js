 const mongoose = require('mongoose')

 const serverSchema = new mongoose.Schema({
    serverVideo:{type:String} 
 })
 
 const Server = mongoose.model('server',serverSchema)

 module.exports = Server