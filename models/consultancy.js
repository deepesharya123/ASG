 const mongoose = require('mongoose')

 const consultancySchema = new mongoose.Schema({
    consultancyVideo:{type:String} 
 })
 
 const Consultancy = mongoose.model('consultancy',consultancySchema)

 module.exports = Consultancy