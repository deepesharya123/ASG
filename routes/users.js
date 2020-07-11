const express = require('express')
const router = new express.Router()
const User  =require('../models/users')
const bodyParser = require('body-parser')
const {auth,adminAuth} = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const mongodb = require('mongodb')
const Netwroking = require('../models/networking')
const Security = require('../models/security')
const Server = require('../models/server')
const Language = require('../models/languages')
const Live = require('../models/live')
const Consultancy = require('../models/consultancy')
// const databaseName = 'asgwork'
const databaseName = 'asgTeaching'
const connectionUrl=  process.env.MONGO_URI
// const connectionUrl=  'mongodb://127.0.0.1:27017'

// const connectionUrl= 'mongodb://127.0.0.1:27017'
// const connectionUrl=  'mongodb+srv://asgadmin:NTAvXg85WqIP8pj3@cluster0.yxjne.mongodb.net/asgTeaching?retryWrites=true&w=majority' 


// const adminAuth = require('../middleware/adminauth')
const  Image = require('../models/admin') 
const Admin = require('../models/admin')
// var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/',(req,res)=>{
    res.render('index')
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.get('/welcome',async(req,res)=>{
    res.redirect('/')
})

router.get('/users/register',async(req,res)=>{
    res.render('register')
})

router.get('/login',async(req,res)=>{
    res.render('login')
})

router.get('/contact',async(req,res)=>{
    
    res.render('contact')

})
const nodemailer = require('nodemailer')
const mailGun = require('nodemailer-mailgun-transport')


router.post('/contact',async(req,res)=>{
    // console.log(req.body)
    const {name,email,phonenumber,message} = req.body
    if(name.length === 0 || email.length === 0 || phonenumber.length ===0 || message.length === 0){
        res.send("Please make sure you have filled your details and message correctly.")
    }



    const auth = {
        auth:{
            // api_key:'5eb447bb2a4203bc0d6803048238ea8f',
            api_key:'5eb447bb2a4203bc0d6803048238ea8f-913a5827-357b4f6a',
            domain:'sandboxef19d78bf6714659a431ca6f559ff428.mailgun.org'
        }
    }
    
    const transporter = nodemailer.createTransport(mailGun(auth))
    //  name ,email,phonenumber,message
    const mailOptions = {
        from: req.body.email,
        to:"deepesharya82246@gmail.com, deepesh.1822it1048@kiet.edu",
        subject:'Message',
        text:req.body.message
    }
    
    transporter.sendMail(mailOptions,function(err,data){
        if(err){
           res.send("<h1>Please make sure you entered correct entries.</h1>")
        }
        else{
            // res.send('<center><h1>We got your message.<br> We will reach you soon.</h1><center>')
            res.redirect('/')
        }
    })

})

router.post('/users/register',urlencodedParser,async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        // const token = await user.generateAuthToken()
        // res.cookie('auth_token', token)
        res.redirect('/login')
        
    }
    catch(e){
        res.render('error',{
            re:"can not register"
        })
    }
})
router.get('/users/login',(req,res)=>{    res.render('login')     })

router.post('/users/login',async (req,res)=>{
    
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        if(!user){
            res.send(" You cannot Login")
        }

    
        const name = user.name
        const token = await user.generateAuthToken()        // we are using user instead of User because we are creating a token for a indiviual user for logging and doing edit as well
        res.cookie('auth_token', token)

        res.render('dashboard',{
            name
        })

    }
    catch(e){
        console.log(e)
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token) 
        await req.user.save()
        res.redirect('/')
   
    }catch(e){  
        res.status(500).send(e)
    }
})

const storage = multer.diskStorage({
    destination:'./public/upload',          // destinantion where the 
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-'+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(!file.originalname.match(/\.(mp4)$/)){
            return cb("Please upload iage only")
        }
        cb(undefined,true)
    }
    
}).single('videoLearn',10)


router.post('/admin/networking/upload',async(req,res)=>{
    console.log(" in the posting route")
    upload(req,res,async(err)=>{
        // image is accessed by req.file.fielname

        const videoUpload = new Netwroking({
            networkingVideo:req.file.filename    
        })
        
        await videoUpload.save()
        const MongoCLient =  mongodb.MongoClient
        
        var dataAll = ''

        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('networkings').find().count((error,count)=>{
                if(error) return console.log("the error")

                imageTotalCount = count
                console.log(count+" is the count ")
              
            let file= `/upload/${req.file.filename}`
            if(!file){
                res.render('acontent')
            }

            res.render('acontent',{
                // file: `/upload/${req.file.filename}`
                file,
                imageTotalCount
                })
  
            })
        })

        // if(!file){
        //     res.render('acontent',{
        //         file: null                // file: req.file.filename
        //     })
    
        // }


    })
})


router.post('/admin/consultancy/upload',async(req,res)=>{
    console.log(" in the posting route of consultancy")
    upload(req,res,async(err)=>{
        // image is accessed by req.file.fielname

        const videoUpload = new Consultancy({
            consultancyVideo:req.file.filename    
        })
        
        await videoUpload.save()
        const MongoCLient =  mongodb.MongoClient
        
        var dataAll = ''

        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('consultancies').find().count((error,count)=>{
                if(error) return console.log("the error")

                imageTotalCount = count
                console.log(count+" is the count ")
              
            let file= `/upload/${req.file.filename}`
            if(!file){
                res.render('aconsultancy')
            }

            res.render('aconsultancy',{
                // file: `/upload/${req.file.filename}`
                file,
                imageTotalCount
                })
  
            })
        })

    })
})


router.post('/admin/live/upload',async(req,res)=>{
    console.log(" in the posting route")
    upload(req,res,async(err)=>{
        // image is accessed by req.file.fielname

        const videoUpload = new Live({
            liveVideo:req.file.filename    
        })
        
        await videoUpload.save()
        const MongoCLient =  mongodb.MongoClient
        
        var dataAll = ''

        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('lives').find().count((error,count)=>{
                if(error) return console.log("the error")

                imageTotalCount = count
                console.log(count+" is the count of live ")
              
            let file= `/upload/${req.file.filename}`
            if(!file){
                res.render('alive')
            }

            res.render('alive',{
                // file: `/upload/${req.file.filename}`
                file,
                imageTotalCount
                })
  
            })
        })

    })
})




router.post('/admin/language/upload',async(req,res)=>{
    console.log(" in the posting route og language")
    upload(req,res,async(err)=>{
        // image is accessed by req.file.fielname

        const videoUpload = new Language({
            languageVideo:req.file.filename  
            // languageVideo  
        })
        
        await videoUpload.save()
        const MongoCLient =  mongodb.MongoClient
        
        var dataAll = ''

        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log(error)
            const db = client.db(databaseName)
             db.collection('languages').find().count((error,count)=>{
                if(error) return console.log("the error")

                imageTotalCount = count
                console.log(count+" is the count ")
              
            let file= `/upload/${req.file.filename}`
            if(!file){
                res.render('alan')
            }

            res.render('alan',{
                // file: `/upload/${req.file.filename}`
                file,
                imageTotalCount
                })
  
            })
        })

        // if(!file){
        //     res.render('acontent',{
        //         file: null                // file: req.file.filename
        //     })
    
        // }


    })
})



router.post('/admin/server/upload',async(req,res)=>{
    console.log(" in the posting route of server")
    upload(req,res,async(err)=>{
        // image is accessed by req.file.fielname

        const videoUpload = new Server({
            serverVideo:req.file.filename    
        })
        
        await videoUpload.save()
        const MongoCLient =  mongodb.MongoClient
        
        var dataAll = ''

        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('servers').find().count((error,count)=>{
                if(error) return console.log("the error")

                imageTotalCount = count
                console.log(count+" is the count ")
              
            let file= `/upload/${req.file.filename}`
            if(!file){
                res.render('aserver')
            }

            res.render('aserver',{
                // file: `/upload/${req.file.filename}`
                file,
                imageTotalCount
                })
  
            })
        })

    })
})


router.post('/admin/security/upload',async(req,res)=>{
    console.log(" in the posting route of security")
    upload(req,res,async(err)=>{
        // image is accessed by req.file.fielname

        const videoUpload = new Security({
            securityVideo:req.file.filename    
        })
        
        await videoUpload.save()
        const MongoCLient =  mongodb.MongoClient
        
        var dataAll = ''

        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('securities').find().count((error,count)=>{
                if(error) return console.log("the error")

                imageTotalCount = count
                console.log(count+" is the count")
              
            let file= `/upload/${req.file.filename}`
            if(!file){
                res.render('asecurity')
            }
            // securityVideo
            res.render('asecurity',{
                // file: `/upload/${req.file.filename}`
                file,
                imageTotalCount
                })
  
            })
        })

        // if(!file){
        //     res.render('acontent',{
        //         file: null                // file: req.file.filename
        //     })
    
        // }


    })
})



router.post('/users/web',async(req,res)=>{
    
        // const databaseName = 'Practice-check1'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        let imageTotalCount = ''
        var  reqData = ''
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
        db.collection('images').find().count((error,count)=>{
        if(error) return console.log("the error")

        imageTotalCount = count
    
        res.render('web',{
            totalNumberOfDocuments:imageTotalCount,
        })     
        console.log(imageTotalCount)       
    })
    
    })
})

router.get('/users/webMaterial/:id',auth,async(req,res)=>{

    // res.send("HGELOO")
    console.log("req.body")
    // console.log(req.params.id)
    const VidNum = req.params.id

    console.log(VidNum+"is the vidnum")

    let i =0 ;
    const ReqId = await Image.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // console.log("Following ins the vidmun")
    // console.log(VidNum)         // givs fuill object

    res.render('showWeb',{
        file:'/upload/'+ReqId[VidNum].image
        
    })
    
    
})


// <% if(records.length > 0) { %>
//     <%records.forEach(function(row) {%>
//     <img src="./upload/<%= row.image %>" alt=""> 
//     <% })  }  %>
// <%let array = totalNumberOfDocuments%>
// <% for( let i = 0; i < array.length; i++ ) { %>
//     <button>hello</button>
// <% } %>



//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin
//   admin

router.get('/admin/register',async(req,res)=>{
    res.render('registeradmin')
})

router.post('/admin/register',async(req,res)=>{
    const admin = new Admin(req.body)
    console.log(admin) 
    try{
        const email  = req.body.adminEmail
        console.log(email)
        const canSave = await Admin.findOne({adminEmail:email})
        if(canSave){
            return res.send("<center><h1>This id is already registerred</h1><center>")
        }
        await admin.save()
        // const token = await admin.generateAuthToken()
        // res.cookie('auth_token', token)
        // res.redirect('/admin/login')
        res.render('adminlogin')

    }
    catch(e){
    //    res.send("<center><h1 style='color:skyblue '>Cannot register,Check Your fields<h1><center>")
        res.send(e)  
        console.log(e)  
    }
})

router.get('/admin/login',async(req,res)=>{
    res.render('adminlogin')
})

router.post('/admin/login',async(req,res)=>{
    // res.send("HELLO")

    try{
        const email = req.body.adminEmail
        const password = req.body.adminPassword
        const admin = await Admin.findByCredentials(email,password)
        if(!admin) return res.send("<center style=margin-top:20% ><h1>No user found</h1><center>")
        
        const token = await admin.generateAuthToken()        // we are using user instead of User because we are creating a token for a indiviual user for logging and doing edit as well
        res.cookie('auth_token', token)
        
        res.render("admindashboard",{
            name:admin.adminName
        })

        // const ImageData = await Image.find({})
        
        // if(ImageData === undefined || !ImageData || ImageData.length === 0 ){
        //     console.log(admin)
        //     res.render('adminlogin',{      
        //         adminName:name       
        //     })

        // }
        // else{
        //     console.log("ImageData")
        //     res.render('adminlogin',{
        //         file:ImageData[0].image
        //     })
        // }
        // <%= file%>


    }
    catch(e){
        console.log(e)
      res.send(e)
    }

})

router.post('/admin/logout',adminAuth,async(req,res)=>{
    try{
        req.admin.tokens = req.admin.tokens.filter((token)=> token.token !== req.token) 
        await req.admin.save()
        res.redirect('/')
    }catch(e){  
        // res.status(500).send(e)
        console.log(e)
    }

    // res.send("you are in logout section ")
})

// acontent => asecurity

router.post('/networkingupload',async(req,res)=>{
    try{  
    // console.log(req.admin)
    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
   

    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('networkings').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")
          
            console.log(imageTotalCount)

            console.log("networking")
            let file = "https://youtu.be/EHouLUpsmqU"
            res.render('acontent',{file,imageTotalCount})


        })
    })

    // res.render('acontent',{file:req.body.filename,
    
    // })
    }
    catch(e){
        res.send(e)
    }

})
// securityupload


router.post('/consultancyupload',async(req,res)=>{
    try{  
    // console.log(req.admin)
    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
   

    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('consultancies').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")
          
            console.log(imageTotalCount)

            console.log("consultancies")
            let file = "https://youtu.be/EHouLUpsmqU"
            res.render('aconsultancy',{file,imageTotalCount})


        })
    })

    // res.render('acontent',{file:req.body.filename,
    
    // })
    }
    catch(e){
        res.send(e)
    }

})



router.post('/liveupload',async(req,res)=>{
    try{  
    // console.log(req.admin)
    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
   

    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('lives').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count of alive")
          
            console.log(imageTotalCount)

            console.log("alive ")
            let file = "https://youtu.be/EHouLUpsmqU"
            res.render('alive',{file,imageTotalCount})


        })
    })

    // res.render('acontent',{file:req.body.filename,
    
    // })
    }
    catch(e){
        res.send(e)
    }

})




router.post('/languageupload',async(req,res)=>{
    try{  
    // console.log(req.admin)
    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
   

    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('languages').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")
          
            console.log(imageTotalCount)

            console.log("languages")
            let file = "https://youtu.be/EHouLUpsmqU"
            res.render('alan',{file,imageTotalCount})


        })
    })

    // res.render('acontent',{file:req.body.filename,
    
    // })
    }
    catch(e){
        res.send(e)
    }

})


router.post('/securityupload',async(req,res)=>{
    try{  
    // console.log(req.admin)
    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
   

    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('securities').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count of security")
          
            console.log(imageTotalCount)

            console.log("security")
            let file = "https://youtu.be/EHouLUpsmqU"
            res.render('asecurity',{file,imageTotalCount})


        })
    })

    }
    catch(e){
        res.send(e)
    }

})


router.post('/serverupload',async(req,res)=>{
    try{  
    // console.log(req.admin)
    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
   

    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('servers').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")
          
            console.log(imageTotalCount)

            console.log("servers")
            let file = "https://youtu.be/EHouLUpsmqU"
            res.render('aserver',{file,imageTotalCount})


        })
    })

    // res.render('acontent',{file:req.body.filename,
    
    // })
    }
    catch(e){
        res.send(e)
    }

})

router.post('/Networking/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of networking")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Netwroking.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // console.log("Following ins the vidmun")
    // console.log(VidNum)         // givs fuill object


    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('networkings').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('acontent',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].networkingVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})


router.post('/consultancy/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of networking")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Consultancy.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // console.log("Following ins the vidmun")
    // console.log(VidNum)         // givs fuill object


    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('consultancies').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('aconsultancy',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].consultancyVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})




router.post('/live/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of networking")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Live.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // console.log("Following ins the vidmun")
    // console.log(VidNum)         // givs fuill object


    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('lives').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('alive',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].liveVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})




router.post('/language/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of networking")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Language.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // console.log("Following ins the vidmun")
    // console.log(VidNum)         // givs fuill object


    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('languages').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('alan',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].languageVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})





router.post('/server/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of server")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Server.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // console.log("Following ins the vidmun")
    // console.log(VidNum)         // givs fuill object


    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('servers').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('aserver',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].serverVideo  
    })

    console.log("AT THE END of server ")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})



router.post('/Security/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of security")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Security.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // console.log("Following ins the vidmun")
    // console.log(VidNum)         // givs fuill object


    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('securities').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count of security")

    res.render('asecurity',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].securityVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})








router.post('/user/networking',async(req,res)=>{
    try{  
        // console.log(req.admin)
        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
       
    
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('networkings').find().count((error,count)=>{
                if(error) return console.log("the error")
    
                imageTotalCount = count
                console.log(count+" is the count")
              
                console.log(imageTotalCount)
    
                console.log("networking")
                let file = "https://youtu.be/EHouLUpsmqU"
                res.render('snetworking',{file,imageTotalCount})
    
    
            })
        })
        console.log(" EVERYThing is goo")
        }
        catch(e){
            res.send(e)
        }
    
})



router.post('/user/consultancy',async(req,res)=>{
    try{  
        // console.log(req.admin)
        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
       
    
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('consultancies').find().count((error,count)=>{
                if(error) return console.log("the error")
    
                imageTotalCount = count
                console.log(count+" is the count")
              
                console.log(imageTotalCount)
    
                console.log("networking")
                let file = "https://youtu.be/EHouLUpsmqU"
                res.render('sconsultancy',{file,imageTotalCount})
    
    
            })
        })
        console.log(" EVERYThing is goo")
        }
        catch(e){
            res.send(e)
        }
    
})




router.post('/user/live',async(req,res)=>{
    try{  
        // console.log(req.admin)
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
       
    
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('lives').find().count((error,count)=>{
                if(error) return console.log("the error")
    
                imageTotalCount = count
                console.log(count+" is the count")
              
                console.log(imageTotalCount)
    
                console.log("language is the good thing to learn")
                let file = "https://youtu.be/EHouLUpsmqU"
                res.render('slive',{file,imageTotalCount})
    
    
            })
        })
        console.log(" EVERYThing is goo")
        }
        catch(e){
            res.send(e)
        }
    
})




router.post('/user/language',async(req,res)=>{
    try{  
        // console.log(req.admin)
        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
       
    
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('languages').find().count((error,count)=>{
                if(error) return console.log("the error")
    
                imageTotalCount = count
                console.log(count+" is the count")
              
                console.log(imageTotalCount)
    
                console.log("language is the good thing to learn")
                let file = "https://youtu.be/EHouLUpsmqU"
                res.render('slan',{file,imageTotalCount})
    
    
            })
        })
        console.log(" EVERYThing is goo")
        }
        catch(e){
            res.send(e)
        }
    
})



router.post('/user/security',async(req,res)=>{
    try{  
        // console.log(req.admin)
        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
       
    
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('securities').find().count((error,count)=>{
                if(error) return console.log("the error")
    
                imageTotalCount = count
                console.log(count+" is the count")
              
                console.log(imageTotalCount)
    
                console.log("security is the good thing to learn")
                let file = "https://youtu.be/EHouLUpsmqU"
                res.render('ssecurity',{file,imageTotalCount})
    
    
            })
        })
        console.log(" EVERYThing is goo")
        }
        catch(e){
            res.send(e)
        }
    
})

router.post('/user/server',async(req,res)=>{
    try{  
        // console.log(req.admin)
        // const databaseName = 'just-check'
        // const connectionUrl= 'mongodb://127.0.0.1:27017'
        var imageTotalCount = 0;
        var  reqData = ''
        const ObjectID =  mongodb.ObjectID
        const id = ObjectID
       
    
        mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
            if(error) return console.log("This is the error")
            const db = client.db(databaseName)
             db.collection('securities').find().count((error,count)=>{
                if(error) return console.log("the error")
    
                imageTotalCount = count
                console.log(count+" is the count")
              
                console.log(imageTotalCount)
    
                console.log("server is the good thing to learn")
                let file = "https://youtu.be/EHouLUpsmqU"
                res.render('sserver',{file,imageTotalCount})
    
    
            })
        })
        console.log(" EVERYThing is goo")
        }
        catch(e){
            res.send(e)
        }
    
})





router.post('/user/Networking/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of user")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Netwroking.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('networkings').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('snetworking',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].networkingVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})


router.post('/user/consultancy/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of user")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Consultancy.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('consultancies').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('sconsultancy',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].consultancyVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})





router.post('/user/server/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of user")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Server.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('servers').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('sserver',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].serverVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})


router.post('/user/live/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of language")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Live.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('lives').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('slive',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].liveVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})





router.post('/user/language/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of language")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Language.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('languages').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('slan',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].languageVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})





router.post('/user/security/:id',async(req,res)=>{
    try{    
        console.log("AT THE BEGINING of user")
    console.log(req.body)
    const VidNum = req.params.id
    
    let i =0 ;
    const ReqId = await Security.find({},(VidNum,error,data)=>{
        if(i===VidNum){
            console.log("QWER")
        console.log(data)
        return data[VidNum]
        i=i+1
        }
        else{
            i=i+1;
        }

    })
    console.log("GOOD")
    console.log(ReqId[VidNum])      //undefined

    // const databaseName = 'just-check'
    // const connectionUrl= 'mongodb://127.0.0.1:27017'
    var imageTotalCount = 0;
    var  reqData = ''
    const ObjectID =  mongodb.ObjectID
    const id = ObjectID
  
    mongodb.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
        if(error) return console.log("This is the error")
        const db = client.db(databaseName)
         db.collection('securities').find().count((error,count)=>{
            if(error) return console.log("the error")

            imageTotalCount = count
            console.log(count+" is the count")

    res.render('ssecurity',{
        imageTotalCount,
        file:'/upload/'+ReqId[VidNum].securityVideo  
    })

    console.log("AT THE END")       // g
        
    })

    })     
             }             // mongodb.connect is closing here 
    catch(e){
        console.log(e)
    }


})

router.post('/deleteNetwork',adminAuth,async(req,res)=>{
    
    console.log(req.admin)
    console.log("!@")
    console.log(req.admin.adminName) 
    
    Netwroking.deleteMany({},(err,cor)=>{
        if(err)
        return res.send("CHECK PLEASE")
        else
        res.render('admindashboard',{
            name:req.admin.adminName
        })
    })
})

router.post('/deleteconsultancy',adminAuth,async(req,res)=>{
    
    console.log(req.admin)
    console.log("!@")
    console.log(req.admin.adminName) 
    
    Consultancy.deleteMany({},(err,cor)=>{
        if(err)
        return res.send("CHECK PLEASE")
        else
        res.render('admindashboard',{
            name:req.admin.adminName
        })
    })
})

router.post('/deleteLan',adminAuth,async(req,res)=>{
    
    console.log(req.admin)
    console.log("!@")
    console.log(req.admin.adminName) 
    
    Language.deleteMany({},(err,cor)=>{
        if(err)
        return res.send("CHECK PLEASE")
        else
        res.render('admindashboard',{
            name:req.admin.adminName
        })
    })
})


router.post('/deleteLive',adminAuth,async(req,res)=>{
    
    console.log(req.admin)
    console.log("!@")
    console.log(req.admin.adminName) 
    
Live.deleteMany({},(err,cor)=>{
        if(err)
        return res.send("CHECK PLEASE")
        else
        res.render('admindashboard',{
            name:req.admin.adminName
        })
    })
})


router.post('/deleteSecurity',adminAuth,async(req,res)=>{
    
    console.log(req.admin)
    console.log("!@")
    console.log(req.admin.adminName) 
    
    Security.deleteMany({},(err,cor)=>{
        if(err)
        return res.send("CHECK PLEASE")
        else
        res.render('admindashboard',{
            name:req.admin.adminName
        })
    })
})



router.post('/deleteSecurity',adminAuth,async(req,res)=>{
    
    console.log(req.admin)
    console.log("!@")
    console.log(req.admin.adminName) 
    
    Security.deleteMany({},(err,cor)=>{
        if(err)
        return res.send("CHECK PLEASE")
        else
        res.render('admindashboard',{
            name:req.admin.adminName
        })
    })
})

router.post('/deleteServer',adminAuth,async(req,res)=>{
    
    console.log(req.admin)
    console.log("!@")
    console.log(req.admin.adminName) 
    
    Server.deleteMany({},(err,cor)=>{
        if(err)
        return res.send("CHECK PLEASE")
        else
        res.render('admindashboard',{
            name:req.admin.adminName
        })
    })
})


router.post('/goback',adminAuth,async(req,res)=>{


    res.render('admindashboard',{
        name:req.admin.adminName
    })
})

module.exports =router


