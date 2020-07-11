const nodemailer = require('nodemailer')
const mailGun = require('nodemailer-mailgun-transport')


const auth = {
    auth:{
        api_key:'5eb447bb2a4203bc0d6803048238ea8f-913a5827-357b4f6a',
        domain:'sandboxef19d78bf6714659a431ca6f559ff428.mailgun.org'
    }
}

const transporter = nodemailer.createTransport(mailGun(auth))
//  name ,email,phonenumber,message
const mailOptions = {
    from: req.body.email,
    to:"moneygupta82246@gmail.com",
    text:req.body.message
}

transporter.sendMail(mailOptions,function(err,data){
    if(err){
        console.log('Error occurs in mailing')
    }
    else{
        console.log("Message sent")
    }
})