var mongoose = require('mongoose');


var guihuanSchema = new mongoose.Schema({
    sid  : Number ,
    carname : String,
    proname : String,
    payall : Number,
    paysum : Number,
    riqi : Number,
    caozuoyuan:String
});


guihuanSchema.statics.addStudent = function(json,callback){
    guihuan.checkSid(json.sid,function(torf){
        if(torf){
            var s = new guihuan(json);
            s.save(function(err){
                if(err){
                    callback(-2);
                    return;
                }
                callback(1);
            });
        }else{
            callback(-1);
        }
    });
}


guihuanSchema.statics.checkSid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        callback(results.length == 0);
    });
}


var guihuan = mongoose.model("guihuan",guihuanSchema);
module.exports = guihuan;