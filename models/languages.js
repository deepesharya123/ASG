 const mongoose = require('mongoose')

 const languageSchema = new mongoose.Schema({
    languageVideo:{type:String} 
 })
 
 const Language = mongoose.model('language',languageSchema)

 module.exports = Language