var mongoose = require('mongoose');


var studentSchema = new mongoose.Schema({
    sid  : Number ,
    name : String,
    phone : Number,
    address : String,
    shen : Number,
    jiazhao : Number
});


studentSchema.statics.addStudent = function(json,callback){
    Student.checkSid(json.sid,function(torf){
        if(torf){
            var s = new Student(json);
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


studentSchema.statics.checkSid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        callback(results.length == 0);
    });
}


var Student = mongoose.model("Student",studentSchema);
module.exports = Student;