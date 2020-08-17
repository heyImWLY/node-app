const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport') // passport
const app = express()

// 引入user.js
const user = require('./routers/api/user')
const profile = require('./routers/api/profile')

// DB config
const db = require('./config/key').mongoURI

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Connect to mongodb 连接至数据库
mongoose.connect(db, { useNewUrlParser: true })
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.log(err))

// 使用中间件实现允许跨域
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','Content-Type')
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS')
    next()
})

// passport 初始化
app.use(passport.initialize())
require('./config/passport')(passport)

// 使用routes
app.use('/api/user', user)
app.use('/api/profile', profile)


app.get('/',(req, res) => {
    res.send('hello world')
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Server is running on port ' + port);
    
})