const mongoose = require('mongoose')
const uniqueVaidator = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer,
    }
},{
    timestamps:true
})

UserSchema.methods.generateAuthToken = async function(){
    const  user = this
const token = jwt.sign({ _id:user._id.toString() },process.env.SECRET_KEY)

user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

UserSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email})
    if(!user) 
    {   return user
        // throw new Error('Unable to login , this email is not registered ')
    }
    const isMatch =  await bcrypt.compare(password,user.password)  
    
    if(!isMatch) {
        return new Error('Unable to login')
        // user = null
    }       
        return user

    
}


UserSchema.pre('save',async function (next){
    const user = this
    // user.password = await bcrypt.hash(user.password,8)
    
    if(user.isModified('password')){     
        
    user.password = await bcrypt.hash(user.password,8)
    // user.password = await bcrypt.hash(user.password,bcrypt.genSaltSync(9))
    }
    next()
})

UserSchema.plugin(uniqueVaidator)

const User = mongoose.model('User',UserSchema)

module.exports =User