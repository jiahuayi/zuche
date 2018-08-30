var mongoose=require("mongoose");
var crypto=require("crypto");

var userSchema=mongoose.Schema({
    yonghuming:String,
    mima:String,
    touxiang:String
})

var user=mongoose.model("user",userSchema);

exports.getK=function (yonghuming, k,callback) {
    user.findOne({"yonghuming":yonghuming},function (err, doc) {
        callback(err,doc[k])
    })
}

exports.findUserByName=function (yonghuming,callback) {
    user.findOne({"yonghuming":yonghuming},function (err, doc) {
        callback(err,doc)
    })
}

exports.adduser=function (yonghuming, mima, callback) {
    var jiamidemima=crypto.createHmac('sha256',mima).digest("hex");
    user.create({"yonghuming":yonghuming,"mima":jiamidemima},function (err, doc) {
        callback(err,doc)
    })
}

exports.addShuxing = function(yonghuming,k,v,callback){
    user.findOne({"yonghuming":yonghuming},function(err,doc){
        if(err){
            return;
        }
        if(!doc){
            return;
        }
        doc[k] = v;
        doc.save(callback);
    });
}












