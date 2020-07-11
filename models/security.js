 const mongoose = require('mongoose')

 const securitySchema = new mongoose.Schema({
    securityVideo:{type:String} 
 })
 
 const Security = mongoose.model('Security',securitySchema)

 module.exports = Security