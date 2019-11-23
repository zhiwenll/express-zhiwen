// 本文件，用于处理文章相关的路由

//1. 引入 express
const express = require('express')

//2. 创建一个 router 对象
const router = express.Router()

//引入相关的model文件
const PostModel = require('../models/post')

//3. 在 router 对象上处理路由的请求

//新增文章
router.post('/api/posts', async (req,res) => {
    
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
router.get('/api/posts', async (req,res) => {
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
router.delete('/api/posts/:id', async (req,res) => {
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
router.put('/api/posts/:id/update', async (req,res) => {
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

//文章列表页面
router.get('/posts', async (req,res) => {
    // 获取分页的参数
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 3

    // 获取数据
    const posts = await PostModel.find().skip((pageNum - 1) * pageSize).limit(pageSize).sort({ _id: -1 })
    // console.log(posts)

    //获取总条数
    const count = await PostModel.find().countDocuments()
    
    // 根据总条数算出总页数
    const totalPages = Math.ceil(count / pageSize)

    //传到前端的数据
    res.render('post/index',{ posts, totalPages, pageNum})
})      

//文章新增页面
router.get('/posts/create', async (req,res) => {
    res.render('post/create')
})

// 文章新增处理
router.post('/posts/store', async (req,res) => {
    //1. 获取参数
    // console.log(req.body)
    //2. 写入数据库
    const post = new PostModel(req.body)
    await post.save()

    //3. 新增成功之后回到文章列表页
    // res.send('文章新增成功')
    res.redirect('/posts')
})

//文章详情页面
router.get('/posts/:id', async (req,res) => {
    //1. 获取文章id
    let id = req.params.id

    //2. 查询数据
    const post = await PostModel.findOne({ _id: id })
    // console.log(post)

    res.render('post/show', { post })
})    




// 将 router 对象暴露出去
module.exports = router