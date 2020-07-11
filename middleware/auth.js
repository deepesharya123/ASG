const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req,res,next)=>{
    
    try{
    // const token = req.header('Authorization')        //this line is used when i was working with postman 
    const token = req.cookies['auth_token']             // this line is used when i was working with good well looking front-end

    const decoded = jwt.verify(token,'THISisTHEsecretKEY')

    const user = await User.findOne({_id:decoded._id,'tokens.token':token})

    if(!user){
        throw new Error("User do not exist in authorisation")
    }

    console.log("I AM HERE in the auth")
    req.token = token
    req.user = user

    console.log(user)
    next()
    
    }
    catch(e){
        res.send(e)
    }
}

// "name": "JsonWebTokenError",
// "message": "jwt must be provided"
const Admin = require('../models/admin')

const adminAuth = async (req,res,next)=>{
    
    try{
    // const token = req.header('Authorization')        //this line is used when i was working with postman 
    const token = req.cookies['auth_token']             // this line is used when i was working with good well looking front-end
        console.log(token)
    const decoded = jwt.verify(token,'THISisTHEsecretKEY')
        console.log(decoded)
    const admin = await Admin.findOne({_id:decoded._id,'tokens.token':token})
        // console.log(admin)
    if(!admin){
       res.send("You are not authenticated")
    }

    console.log("I AM HERE in the admin auth")
    req.token = token
    req.admin = admin

    next()
    }
    catch(e){
        res.send(e)
    }
}

// "name": "JsonWebTokenError",
// "message": "jwt must be provided"
// const adminAuth = auth

module.exports ={auth,
    adminAuth
}