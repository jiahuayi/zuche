var express=require("express");
var router=require("./router/router.js");
var session=require("express-session");
var mongoosse=require("mongoose");
mongoosse.connect("mongodb://localhost/car");

var app=express();
app.set("view engine","ejs");
app.use(express.static("static"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//注册页
app.get("/",router.showReg);
app.get("/checkuserexist",router.checkuserexist);
app.post("/doreg",router.doreg);

//登录页
app.get("/login",router.showLogin);
app.post("/checklogin",router.checklogin);

//客人查询页面
app.get("/index",router.showIndex);
app.get('/doadd', router.getAll);
app.post('/doadd', router.doAddStudent);
app.propfind('/student/:sid',router.check);
app.delete('/doadd/:sid', router.delete);
app.post    ('/student/:sid'	, router.updateStudent);
app.get     ('/student/:sid'	, router.showUpdate);

//归还页面
app.get("/guihuan",router.showGuihuan);
app.get('/guidoadd', router.getAllGui);
app.post     ('/guihuan/:sid'	, router.showGui);
app.delete('/gui/:sid', router.guidelete);
app.post('/guiadd', router.guiAddStudent);


//租赁页面
app.get("/zulin",router.showZulin);
app.get('/zudoadd', router.ZugetAll);
app.get("/zucar",router.Zucar);
app.post     ('/chuzu/:sid'	, router.showChuzu);
app.post('/zuadd', router.zuAddStudent);
app.get('/people', router.Zupeople);

//租赁统计
app.get("/tongji",router.showTongji);
app.get("/tongzu",router.TongZucar);
app.get("/tonghuan",router.TongHuancar);

//类别档案
app.get("/leibie",router.showLeibie);
app.get('/leidoadd', router.LeigetAll);
app.post('/leidoadd', router.LeidoAddStudent);
app.delete('/leidoadd/:sid', router.Leidelete);


//汽车档案页面
app.get("/qiche",router.showQiche);
app.get('/qidoadd', router.QigetAll);
app.post('/qidoadd', router.QidoAddStudent);
app.propfind('/qistudent/:sid',router.Qicheck);
app.delete('/qidoadd/:sid', router.Qidelete);
app.post    ('/qistudent/:sid'	, router.QiupdateStudent);
app.get     ('/qistudent/:sid'	, router.QishowUpdate);



//退出
app.get("/tui",router.tui);


app.listen(3500);

























