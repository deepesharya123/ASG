const mongoose = require('mongoose')
// mongodb://127.0.0.1:27017/task-manager-api
// MONGO_URI = mongodb://127.0.0.1:27017

// conn =conn+'/asgTeaching'
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(()=>console.log("CONNCETEED TO THE DB")).catch((e)=> console.log(e))


// MONGODB_URL=mongodb://127.0.0.1:27017/task-manager-api

// './config/dev'