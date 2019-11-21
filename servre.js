const express = require('express')
const app = express()

//引入数据库相关的model文件
 const PostModel = require('./models/post')

//req.body 中间件的设置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api/posts', async (req,res) => {
    //1. 获得前端传来的参数 req.body
    //2. 写入数据库中

    // const post = new PostModel({
    //     title:req.body.title,
    //     body: req.body.body
    // })

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

app.listen(8080)
