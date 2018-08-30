var mongoose = require('mongoose');


var leibieSchema = new mongoose.Schema({
    sid  : Number ,
    name : String,
});


leibieSchema.statics.addStudent = function(json,callback){
    Leibie.checkSid(json.sid,function(torf){
        if(torf){
            var s = new Leibie(json);
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


leibieSchema.statics.checkSid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        callback(results.length == 0);
    });
}
leibieSchema.statics.addall = function(name,callback){
    this.find({"name" : name} , function(err,results){
        callback(results);
    });
}




var Leibie = mongoose.model("Leibie",leibieSchema);



module.exports = Leibie;