# bcryptjs

## 1. hash(md5) 加密

密码编译总是相同  

## 2. 相同的密码处理得到不同的密文 (加盐)

##  使用 bcryptjs

1. 安装
```shell
npm install --save bcryptjs
```

2. 使用
    - bcryptjs.hash(password, 加密强度 (1-12))
    - bcryptjs.compire(password,hashpassword)  
        原密码与编译后密码相比较
