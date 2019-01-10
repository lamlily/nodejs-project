
var express = require('express');
var router = express.Router();
const multer=require('multer');//解析图片的插件
const fs=  require('fs');
const path=require('path');

var {
    connect,
    insert,
    find,
    ObjectId,
    del
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

// 5.-增加商品信息（上传图片文件）
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



// 6. 修改商品信息
// router.post('/updateGood', async (req, res, next) => {
//     let {
//         name,
//         type,
//         price,
//         imgpath   
//     } = req.body
//     // 判断是否已有该商品
//     let data = await find(`goods`, name ? {
//         name
//     } : {})
//     console.log(data);
 
//     let data = await insert("goods",[{name,type,price,imgpath}])
//     res.send('success');

    
// });


// 6.修改商品信息（根据id查询）
//根据id查询
router.post('/getIdGood',(req,res)=>{
    let {id} = req.body;
    Goods.find({_id:id})
    .then((data)=>{
      res.send({err:0,msg:'查询成功',data:data})
    })
    .catch((err)=>{
      console.log(err)
      res.send({err:-1,msg:'查询错误',data:null})
    })
  
  });

//   6.修改商品
router.post('/updateGood',(req,res)=>{
    //获取商品的唯一索引 主键（_id）
    // 获取修改的值
    // 执行修改
    let id=req.body.id;
    let {name,type,price,imgpath}=req.body
    Goods.updateMany({_id:id},{name,type,price,imgpath})
    .then((data)=>{
        res.send({err:0,msg:'修改成功',data:null})
  
    })
    .catch((err)=>{
        console.log(err)
        res.send({err:-1,msg:'修改no成功',data:null})
    })
  
  });





// 7.删除商品
router.post('/delGood',async(req,res)=>{
    //获取商品的唯一索引 主键（_id）
    // 获取修改的值
    // 执行修改
    let _id=req.body.id;
    onsole.log('--------------------------------------------------')
    console.clog(_id);
    _id=ObjectId(_id);
    // Goods.remove({_id:id})//正常的删除
    //let array=['5bdfe8b6b907c6a31b5aac37','5bdfe10748ecfa1380d368f0']
    //Goods.remove({_id:{$in:array}})//批量删除
    let data = await del(`goods`, {
        _id
    });

    res.send(data.result);
  
  });


// 8.批量删除
router.post('/delAllGood',async(req,res)=>{
    //获取商品的唯一索引 主键（_id）数组
    // 获取修改的值
    // 执行修改

    let _id=req.body.id;
    _id=ObjectId(_id);
    // Goods.remove({_id:id})//正常的删除
    //let array=['5bdfe8b6b907c6a31b5aac37','5bdfe10748ecfa1380d368f0']
    // Goods.deleteMany({_id:{$in:id["id[]"]}})//批量删除
    // Goods.deleteMany({_id:id})

    let data = await del(`goods`, {
        _id:{$in:id["id[]"]}
    });

    res.send(data.result);

  })












module.exports = router;