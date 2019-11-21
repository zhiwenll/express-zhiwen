const express = require('express')
const app = express()
const path = require('path')
//引入数据库相关的model文件
const PostModel = require('./models/post')

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

app.listen(8080)
