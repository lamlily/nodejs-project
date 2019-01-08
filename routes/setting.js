var express = require('express');
var router = express.Router();
var {
    connect,
    insert,
    find,
    ObjectId
} = require("../libs/mongo.js");


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


// 查询用户信息
router.post('/findUser', async (req, res, next) => {
    let {
        name
    } = req.body
    let data = await find(`users`, name ? {
        name
    } : {})
    if(data.length == 0 ){
        res.send('success');

    }else{
        res.send("fail");
    }
});


// 插入注册用户信息
router.post('/addUser', async (req, res, next) => {
 
    let {
        name,
        pass
    } = req.body
    // 判断是否已有该用户名
    let data = await find(`users`, name ? {
        name
    } : {})
    console.log(data);
    if(data.length == 0 ){
        let data = await insert("users",[{name,pass}])
        res.send('success');

    }else{
        res.send("fail");
    }
    
});

// 显示全部商品列表
router.get('/showList',async (req,res,next)=>{
    let name;
    let data = await find(`goods`, name ? {
        name
    } : {})
    console.log(data);
    res.send(data);
})

// 搜索商品列表
router.post('/searchdata',async (req,res,next)=>{
    let {
        type
    } = req.body
    let data = await find(`goods`, type ? {
        type
    } : {})
    console.log(data);
    res.send(data);
})



















module.exports = router;