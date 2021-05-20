const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config('./dev.env')

const cookieParser =require('cookie-parser')
const session = require('express-session') 
const ejs = require('ejs')
const path = require('path')
const userRoutes = require('./routes/users')
// require('./db/mongoose')

require('./db/mongoose')

const port = process.env.PORT ||3000

const publicDir = path.join(__dirname,'./public')
const viewsDir = path.join(__dirname,'./templates/views')
const partialsDir = path.join(__dirname,'./templates/partials')

app.set('view engine','ejs')
app.set('views',viewsDir)
// hbs.registerPartials(partialsDir)

app.use(express.static(publicDir))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use(userRoutes)


app.listen(port,()=> console.log("SERVER IS ON PORT "+port))