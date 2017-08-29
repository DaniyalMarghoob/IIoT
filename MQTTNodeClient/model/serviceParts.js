/**
 * Created by margdan on 12.6.2017.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;



var partSchema=new Schema({
    client:{type: String},
    name: {type : String},
    serial:{type: String},
    counter:{type:Number},
    serviceInterval:{type:Number},
    location: {type : String,default:'unknown'},
    cpuTemperature:{type : Number, default:0},
    machineTemperature:{type : Number,default:0},
    envTemperature:{type : Number,default:0}
},{
    timestamps:true
});

var Parts=mongoose.model('Part',partSchema);
module.exports=Parts;
