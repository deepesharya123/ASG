 const mongoose = require('mongoose')

 const liveSchema = new mongoose.Schema({
    liveVideo:{type:String} 
 })
 
 const Live = mongoose.model('live',liveSchema)

 module.exports = Live