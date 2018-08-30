var mongoose = require('mongoose');


var qicheSchema = new mongoose.Schema({
    sid  : Number ,
    name : String,
    leixing : String,
    jiage : Number,
    danwei : String,
    zhuangtai:String
});

qicheSchema.statics.addStudent = function(json,callback){
    Qiche.checkSid(json.sid,function(torf){
        if(torf){
            var s = new Qiche(json);
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


qicheSchema.statics.checkSid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        callback(results.length == 0);
    });
}


var Qiche = mongoose.model("Qiche",qicheSchema);
module.exports = Qiche;