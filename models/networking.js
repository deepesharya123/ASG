 const mongoose = require('mongoose')

 const networkingSchema = new mongoose.Schema({
    networkingVideo:{type:String} 
 })
 
 const Netwroking = mongoose.model('networking',networkingSchema)

 module.exports = Netwroking