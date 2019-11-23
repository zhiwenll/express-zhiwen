// 本文件，用于处理用户

//引入相关模块
const express = require('express')
const bcryptjs = require('bcryptjs') //加密模块

const router = express.Router()

// 引入数据库相关的 model 文件
const UserModel = require('../models/user')

//注册
router.post('/api/users', async (req,res) => {
    let username = req.body.username
    let password = req.body.password

    password = await bcryptjs.hash(password,12)

    const user = new UserModel({
        username,
        password
    })

    // const user = new UserModel(req.body)
    await user.save()
    res.send({
        code: 0,
        msg: 'ok'
    })
})

//登录
router.post('/api/login', async (req,res) =>{
    let username = req.body.username
    let password = req.body.password

    const user = await UserModel.findOne({
        username
    })

    // console.log(user)

let isOk = false

    //  根据用户名查找用户
    // if(!user){
    //     res.send({
    //         code: -1,
    //         msg: '用户名不存在'
    //     })
    //     return
    // }


    if(user){
        // 2. 比较密码是否正确
        isOk = await bcryptjs.compare(password, user.password)    //比较前后密码
    }

    if(isOk){
        res.send({
            code: 0,
            msg: 'ok',
            data:{
                userId: user._id,
                username: user.username
            }
        })
    }else{
        res.send({
            code: -1,
            msg:'用户名或密码不正确'
        })
    }

})

//登录页面
router.get('/login', async (req, res) => {
    res.render('login')
})

// 注册页面 
router.get('/register', async (req, res) => {
    res.render('register')
})

// 注册加密
router.post('/registerAction', async (req,res) =>{
    const user = new UserModel({
        username: req.body.username,
        password: await bcryptjs.hash(req.body.password, 12)  //设置加密
    })
    await user.save()
    res.redirect('/login')
})

//登录验证
router.post('/loginAction', async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let isOk = false
    const user = await UserModel.findOne({ username })
    if(user){
        isOk = await bcryptjs.compare(password, user.password)
    }
    if(isOk){
        res.redirect('/posts')
    }else{
        res.send('用户名或密码不正确')
    }
})


module.exports = router