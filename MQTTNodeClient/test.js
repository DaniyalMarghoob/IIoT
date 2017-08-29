
var config=require('./config');
var mqtt = require('mqtt');
var mongoose=require('mongoose');
var parts=require('./model/serviceParts');


var client  = mqtt.connect(config.brokerURL);


client.on('connect', function () {
    client.subscribe('jot/iot/web/#');
    console.log('subscribed to #');
    client.publish('dummyString', 'This Device is connected with Node Server');
    console.log("Published")
});


client.on('message', function (topic, message) {
    // message is Buffer
    console.log(topic);
    console.log(message.toString());
    data=JSON.parse(message);

    if (data.counter<=1 ){parts.create(data,function (err,part) {if (err) throw err; });console.log("data coming");
    }

        else
        {try{parts.deleteMany({ "client": data.client,"name": data.name,"serial":data.serial,"location": data.location,"counter": {$gt : 0}},function (err,part) {if (err) console.log(err);
        parts.create(data,function (err,part) {if (err) throw err; }); })
        ;

            console.log("data continuos");}
            catch(e){ console.log(e); }
        }


    if(data.counter> (data.serviceInterval*0.8)){
        console.log("in alert")
        var pubTopic= config.baseURL+data.client+"/"+data.location+"/"+data.name+"/"+data.serial;
        client.publish(pubTopic,'alert')
            }
});
