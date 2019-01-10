
var express = require('express');
var router = express.Router();
const multer=require('multer');//解析图片的插件
const fs=  require('fs');
const path=require('path');

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


// 1.查询用户信息
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

// 2.插入注册用户信息
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

// 3.显示全部商品列表
router.get('/showList',async (req,res,next)=>{
    let name;
    let data = await find(`goods`, name ? {
        name
    } : {})
    console.log(data);
    res.send(data);
})

// 4.搜索商品列表
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

// 5.增加商品信息
router.post('/addGood', async (req, res, next) => {
 
    let {
        name,
        type,
        desc,
        price,
        stock,
        imgpath   
    } = req.body
    // 判断是否已有该商品
    let data = await find(`goods`, name ? {
        name
    } : {})
    console.log(data);
    if(data.length == 0 ){
        let data = await insert("goods",[{name,type,desc,price,stock,imgpath}])
        res.send('success');

    }else{
        res.send("fail");
    } 
});





let upload = multer({ dest: 'uploads/' });//文件在服务器保存的临时路径
//数据模型引入
router.post('/img',upload.single('test'),(req,res)=>{//保存图片的formdata 对象的key值
	// console.log(req.file)
    fs.readFile(req.file.path,(err,data)=>{
    	if (err) { return res.send('上传失败')}
    	//为了保障图片不被覆盖 采用 时间戳+随机方式生成文件名
        let name=new Date().getTime()+parseInt(Math.random(0,1)*10000)+path.extname(req.file.originalname);
        // console.log(name)
    	fs.writeFile(path.join(__dirname,'../public/img/'+name), data, (err)=>{
    		//保存数据库的应该是  相对的图片路径
    		if (err) {console.log(err)}
    		res.send({err:0,msg:'上传ok',data:'/img/'+name})
    	});

    });
});



















module.exports = router;