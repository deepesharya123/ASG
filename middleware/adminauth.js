const jwt = require('jsonwebtoken')
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

module.exports =adminAuth