var user = require("../models/user.js");
var Student=require('../models/db.js');
var Leibie=require('../models/leibie.js');
var Qiche=require('../models/qiche.js');
var yizu=require('../models/yizu.js');
var guihuan=require('../models/guihuan.js');
var url=require("url");
var formidable = require("formidable");
var crypto = require('crypto');

//注册页
exports.showReg=function (req, res) {
    res.render("reg");
}
exports.checkuserexist=function (req, res, next) {
    var queryobj = url.parse(req.url,true).query;
    if(!queryobj.yonghuming){
        res.send("请提供参数");
        return;
    }
    user.findUserByName(queryobj.yonghuming,function (err, doc) {
        if(doc){
            res.json({"result":-1});
        }else{
            res.json({"result":0})
        }
    })
}//检测用户名是否存在
exports.doreg=function (req, res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
        var yonghuming=fields.yonghuming;
        var mima=fields.mima;
        user.findUserByName(yonghuming,function (err, doc) {
            if(doc){
                res.json({"result":-1})
                return
            }
            user.adduser(yonghuming,mima,function (err, doc) {
                if(err){
                    res.json({"result":-2})
                    return
                }
                req.session.login=1;
                req.session.yonghuming=yonghuming;
                res.json({"result":1})
            })
        })
    })
}

//登录页
exports.showLogin=function (req, res) {
    res.render("login");
}
exports.checklogin=function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
        var yonghuming=fields.yonghuming;
        var mima=fields.mima;
        user.findUserByName(yonghuming,function (err, doc) {
            if(!doc){
                res.json({"result":-1});
                return;
            }
            if(crypto.createHmac("sha256",mima).digest("hex")===doc.mima){
                // req.session.login=1;
                req.session.yonghuming=yonghuming;
                res.json({"result":1});
                return;
            }else {
                res.json({"result":-2});
                return;
            }
        })
    })
}


//客户信息
exports.showIndex=function (req, res) {
    res.render("index");
}
exports.getAll=function (req, res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    Student.count({},function(err,count){
        Student.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
exports.doAddStudent = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Student.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
exports.check = function(req,res){
    var sid = req.params.sid;

    Student.checkSid(sid,function(torf){
        res.json({"result" : torf});
    });
}
exports.delete=function(req,res){
    var sid= req.params.sid;

    Student.find({'sid':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }

        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }

            res.json({'result':1})
        })
    })
}
exports.updateStudent = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        Student.update({"sid":sid},{$set:{"name":fields.names,"phone":fields.phones,"address":fields.addresss,"shen":fields.shens,"jiazhao":fields.jiazhaos}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}
exports.showUpdate = function(req,res){
    var sid = req.params.sid;
    Student.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }else{
            res.json({"result" : results[0]});
        }
    });
}


//归还页面
exports.showGuihuan=function (req, res) {
    res.render("guihuan");
}
exports.getAllGui=function (req, res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    yizu.count({},function(err,count){
        yizu.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
exports.showGui = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        console.log(fields.zhuangtai);
        Qiche.update({"sid":sid},{$set:{"zhuangtai":fields.zhuangtai}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}
exports.guidelete=function(req,res){
    var sid= req.params.sid;
    yizu.find({'sid':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }
        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }
            res.json({'result':1})
        })
    })
}
exports.guiAddStudent = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        guihuan.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}




//租赁页面
exports.showZulin=function (req, res) {
    res.render("zulin");
}
exports.ZugetAll=function (req, res) {
        Leibie.count({},function(err,count){
            Leibie.find({}).exec(function(err,results){
                res.json({"result":results});
            });
        });
}
exports.Zupeople=function (req, res) {
    Student.count({},function(err,count){
        Student.find({}).exec(function(err,results){
            res.json({"result":results});
        });
    });
}



exports.Zucar=function (req, res) {
        Qiche.find({}).exec(function(err,results){
            res.json({"result":results});
        });
}

exports.showChuzu = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        console.log(fields.zhuangtai);
        Qiche.update({"sid":sid},{$set:{"zhuangtai":fields.zhuangtai}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}

exports.zuAddStudent = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        yizu.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}





//统计分析
exports.showTongji=function (req, res) {
    res.render("tongji");
}
exports.TongZucar=function (req, res) {
    yizu.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}
exports.TongHuancar=function (req, res) {
    guihuan.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}





//类别档案页面
exports.showLeibie=function (req, res) {
    res.render("leibie");
}
exports.LeigetAll=function (req, res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    Leibie.count({},function(err,count){
        Leibie.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
exports.LeidoAddStudent = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Leibie.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
exports.Leidelete=function(req,res){
    var sid= req.params.sid;

    Leibie.find({'sid':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }

        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }

            res.json({'result':1})
        })
    })
}


//汽车档案页面
exports.showQiche=function (req, res) {
    res.render("qiche");
}
exports.QigetAll=function (req, res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    Qiche.count({},function(err,count){
        Qiche.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
exports.QidoAddStudent = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Qiche.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
exports.Qicheck = function(req,res){
    var sid = req.params.sid;
    Qiche.checkSid(sid,function(torf){
        res.json({"result" : torf});
    });
}
exports.Qidelete=function(req,res){
    var sid= req.params.sid;

    Qiche.find({'sid':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }

        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }

            res.json({'result':1})
        })
    })
}
exports.QiupdateStudent = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        Qiche.update({"sid":sid},{$set:{"name":fields.names,"leixing":fields.leixings,"jiage":fields.jiages,"danwei":fields.danweis,"zhuangtai":fields.zhuangtais}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}
exports.QishowUpdate = function(req,res){
    var sid = req.params.sid;
    Qiche.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }else{
            res.json({"result" : results[0]});
        }
    });
}




//退出
exports.tui = function(req,res,next){
    var login=req.session.login==0;
    res.render("reg",{
        "login":login,
    })
}







