// post表相关的 model 文件 

// 1. 引入之前已经链接到 mongodb 数据库的 mongoose 模块
const mongoose = require('../conf/db')

// 2. 实例化一个 schema (描述 表的结构)
const schema = new mongoose.Schema({
    //键值对， key -> 表的字段名 value -> 这个字段的类型

    title: String,  //文章标题

    body: String    //文章正文
})

// 3. 通过 mongoose.model() 生成当前 post 的 model
//  第一个参数，是我们的表名的单数形式
const model = mongoose.model('post', schema)

// 4. 暴露出去
module.exports()