const express = require('express')
const app = express()
const bcryptjs = require('bcryptjs')
const path = require('path')
//引入数据库相关的model文件
const PostModel = require('./models/post')
const UserModel = require('./models/user')

//req.body 中间件的设置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//新增文章
app.post('/api/posts', async (req,res) => {
    
    // const post = new PostModel({
        //     title:req.body.title,
        //     body: req.body.body
        // })
        
        //1. 获得前端传来的参数 req.body
        //2. 写入数据库中
const post = new PostModel(req.body)

try{
    const data = await post.save()
    console.log(data)
    res.send({
        code:0,
        msg:'OK'
    })
} catch(error){
    console.log(error)
    res.send({
        code: -1,
        msg: 'NO'
    })
}

post.save().then(() => {
    console.log('写入成功')
    res.send({
        code: 0,
        msg: 'OK'
    })
}).catch(error => {
    console.log(error)
    console.log('写入失败')
    res.send({
        code: -1,
        msg:'NO'
    })
})
})

//查询文章
app.get('/api/posts', async (req,res) => {
    let pageNum = parseInt(req.query.pageNum) || 1    //第几页
    let pageSize = parseInt(req.query.pageSize) || 5  //每页条数
    let title = req.query.title

    try {
        //查询数据总条数
        const count = await PostModel.find({ title: new RegExp(title) }).count()

        //数据库查询
        const posts = await PostModel.find({ title: new RegExp(title) })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)

        // console.log(posts)
        // 响应给前端
        res.send({
            code: 0,
            msg: 'ok',
            data: {
                list: posts,
                count: count    //输出总条数
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            code: -1,
            msg:'no'
        })
    }
})

//删除文章
app.delete('/api/posts/:id', async (req,res) => {
    //1. 去除需要删除的文章id
    let id = req.params.id

    // 2. 删除
    await PostModel.deleteOne({ _id: id })

    // 3. 响应
    res.send({
        code: 0,
        msg: 'ok'
    })

})

//修改文章
app.put('/api/posts/:id/update', async (req,res) => {
    //1. 取出需要删除的文章id
    let id = req.params.id

    //2. 取出要修改的内容
    let title = req.body.title

    // 3. 找到对应的文章并修改
    await PostModel.updateOne({ _id: id }, { title: title})

    // 4. 响应
    res.send({
        code: 0,
        msg: 'ok'
    })

})

//注册
app.post('/api/users', async (req,res) => {
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
app.post('/api/login', async (req,res) =>{
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
app.listen(8080)


