const mongoose = require('mongoose')
const uniqueVaidator = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const AdminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:true,
        trim:true
    },
    adminEmail:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    adminPassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
})

AdminSchema.methods.generateAuthToken = async function(){
    const  admin = this
const token = jwt.sign({ _id:admin._id.toString() },process.env.SECRET_KEY)

admin.tokens = admin.tokens.concat({token})
    await admin.save()
    return token
}

AdminSchema.statics.findByCredentials = async(email,password)=>{
    const admin = await Admin.findOne({adminEmail:email})

    if(!admin) 
    {
        return admin
        // throw new Error('Unable to login , this email is not registered ')
    // daewa@gmail.com
    }
    const isMatch =  await bcrypt.compare(password,admin.adminPassword)  
    if(!isMatch) {
        return res.send("Id is not registered ")
        // user = null
    }       
        return admin

    
}


AdminSchema.pre('save',async function (next){
    const admin = this
    // user.password = await bcrypt.hash(user.password,8)
    
    if(admin.isModified('adminPassword')){     
    admin.adminPassword = await bcrypt.hash(admin.adminPassword,8)
    // user.password = await bcrypt.hash(user.password,bcrypt.genSaltSync(9))
    }
    next()
})

AdminSchema.plugin(uniqueVaidator)

const Admin = mongoose.model('Admin',AdminSchema)

module.exports =Admin