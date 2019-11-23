const express = require('express')
const app = express()
const path = require('path')

// 引入 路由模块
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')

//使用模板引擎，模板页面的存放路径
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './views'))

//req.body 中间件的设置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//静态资源托管设置
app.use(express.static(path.resolve(__dirname, './public')))

app.use(postRouter)
app.use(userRouter)

app.listen(8080)