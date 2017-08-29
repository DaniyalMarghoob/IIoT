/**
 * Created by margdan on 12.6.2017.
 */
var config=require('../config');

var mqtt=require('mqtt');
var client  = mqtt.connect(config.brokerURL);
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify    = require('./verify');

var Parts=require('../model/serviceParts');

var servicePartsRouter=express.Router();
servicePartsRouter.use(bodyParser.json());

servicePartsRouter.route('/home')

    .get(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req,res,next) {
           Parts.distinct("client")
            //Parts.find()
            .exec(function (err,part) {
                if (err) next(err);
                res.json(part);
                });
         })

    .post(function (req,res,next) {
        console.log("in post");
        /*Parts.create(req.body,function (err,part) {
            if (err) next(err);
            res.json("Part added")
            });*/
            var pubTopic = config.baseURL+req.body.client+"/"+req.body.location+"/"+req.body.name+"/"+req.body.serial;
            console.log(pubTopic);
            client.publish(pubTopic,req.body.status);
            console.log('published');
})

    .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    Parts.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});


//////////////////////Client Specific Query//////////////////////////////////////////////////////////////
servicePartsRouter.route('/client/:client')
        .get(Verify.verifyOrdinaryUser,function (req,res,next) {
            if (req.decoded.admin===true){Parts.find({client:req.params.client}).sort({updatedAt:-1}).exec(function (err,part) { if(err){  console.log("err in name");   };   res.json(part)  });}
            else  { Parts.find({client:req.decoded.username}).sort({updatedAt:-1}).exec(function (err,part) { if(err){  console.log("err in name");   };   res.json(part)  });}
        })

        .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
           Parts.remove({client:req.params.name}, function (err, resp) {if (err) next(err); res.json(resp);}); });


//////////////////////Location Specific Query//////////////////////////////////////////////////////////////

servicePartsRouter.route('/client/:client/:location')

    .get(Verify.verifyOrdinaryUser,function (req,res,next) {
            if(req.decoded.admin===true) Parts.find({client:req.params.client,location:req.params.location}).sort({updatedAt:-1}).exec(function (err,part) {if(err){console.log("err in name");}; res.json(part)});
            else Parts.find({client:req.decoded.username,location:req.params.location}).sort({updatedAt:-1}).exec(function (err,part) {if(err){console.log("err in name");}; res.json(part)});
    })

    .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
            Parts.remove({client:req.params.client,location:req.params.location}, function (err, resp) {if (err) next(err); res.json(resp); });});


//////////////////////Serial Specific Query//////////////////////////////////////////////////////////////

servicePartsRouter.route('/client/:client/:location/:serial')

    .get(Verify.verifyOrdinaryUser,function (req,res,next) {
        if (req.decoded.admin===true) Parts.find({client:req.params.client,location:req.params.location,serial:req.params.serial}).sort({updatedAt:-1}).exec(function (err,part) {if(err){ console.log("err in name"); }; res.json(part)});
        else Parts.find({client:req.decoded.username,location:req.params.location,serial:req.params.serial}).sort({updatedAt:-1}).exec(function (err,part) {if(err){ console.log("err in name"); }; res.json(part)});
   })

    .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
            Parts.remove({client:req.params.client,location:req.params.location,serial:req.params.serial}, function (err, resp) { if (err) next(err);  res.json(resp); }); });

servicePartsRouter.route('/location/maintainance/:client/:location/')

    .get(Verify.verifyOrdinaryUser,function (req,res,next) {
        if (req.decoded.admin===true)Parts.find({client:req.params.client,location:req.params.location,counter:0}).sort({updatedAt:-1}) .exec(function (err,part) { if(err){ console.log("err in name"); }; res.json(part); console.log(part) ;});
        else Parts.find({client:req.decoded.username,location:req.params.location,counter:0}).sort({updatedAt:-1}) .exec(function (err,part) { if(err){ console.log("err in name"); }; res.json(part) });
    });

servicePartsRouter.route('/serial/historyMaintainance/:client/:serial')
    .get(Verify.verifyOrdinaryUser,function (req,res,next) {
        if (req.decoded.admin===true) Parts.find({serial:req.params.serial,counter:0,client:req.params.client}).sort({updatedAt:-1}) .exec(function (err,part) { if (err) { console.log("err in serial"); }  res.json(part); });
        else Parts.find({serial:req.params.serial,counter:0,client:req.decoded.username}).sort({updatedAt:-1}) .exec(function (err,part) { if (err) { console.log("err in serial"); }  res.json(part) });
    });

servicePartsRouter.route('/serial/lastUpdatedCounterValue/:client/:serial')
    .get(Verify.verifyOrdinaryUser,function (req,res,next) {
        if (req.decoded.admin===true)  Parts.findOne({serial:req.params.serial,client:req.params.client}).sort({updatedAt:-1})  .exec(function (err,part) {    if (err) {  console.log("err in serial");   }  res.json(part) });
        else  Parts.findOne({serial:req.params.serial,client:req.decoded.username}).sort({updatedAt:-1})  .exec(function (err,part) {    if (err) {  console.log("err in serial");   }  res.json(part) });
    });

servicePartsRouter.route('/serial/lastMaintainance/:client/:serial')
    .get(Verify.verifyOrdinaryUser,function (req,res,next) {
        if (req.decoded.admin===true) Parts.findOne({serial:req.params.serial,counter:0,client:req.params.client}).sort({updatedAt:-1}) .exec(function (err,part) { if (err) { console.log("err in serial"); } res.json(part) });
        else Parts.findOne({serial:req.params.serial,counter:0,client:req.decoded.username}).sort({updatedAt:-1}) .exec(function (err,part) { if (err) { console.log("err in serial"); } res.json(part) });
    });


servicePartsRouter.route('/:client/serviceCounterHistory/:client/:serial')
    .get(Verify.verifyOrdinaryUser,function (req,res,next) {
            if (req.decoded.admin===true)Parts.find({serial:req.params.serial,counter:0,client:req.params.client}).sort({updatedAt:-1}).exec(function (err,part) {if (err) { console.log("err in serial"); }  res.json(part)});
            else Parts.find({serial:req.params.serial,counter:0,client:req.decoded.username}).sort({updatedAt:-1}).exec(function (err,part) {if (err) { console.log("err in serial"); }  res.json(part)});
    });


module.exports=servicePartsRouter;
