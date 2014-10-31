'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        dbConModel = require("../models/dbcon"),
        Helper = require('../lib/helper'),
        helper=new Helper();
/*
        var nodemailer = require("nodemailer");

        var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "bijeshkumar1979@gmail.com",
       pass: "Gateway123$"
   }
});

        smtpTransport.sendMail({
   from: "My Name <bijeshkumar1979@gmail.com>", // sender address
   to: "Your Name <bijesh@example.com>", // comma separated list of receivers
   subject: "Hello ✔", // Subject line
   text: "Hello world ✔" // plaintext body
}, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
});

*/
var travelAdd = {
                process: function(req,res,next){
                              helper.sConsole("CONTROLLER TRAVEL ADD");
                               req.model = {
                                                                viewName : "traveladd",
                                                                data : {
                                                                  viewModel:{
                                                                    "droplist": {
                                                                                                                                    "optionList" : [
                                                                                                                                        {optionValue : "Credit Card", optionId : "CC"},
                                                                                                                                        {optionValue : "PayPal EC Checkout", optionId : "PECC"}
                                                                                                                                    ]
                                                                                                                                },
                                                                                                                              }
                                                                }
                                                };
                               next();
                },

                pushTravelData: function(req,res,next){
                     var dbconnection = new dbConModel();
                                helper.sConsole("CONTROLLER TRAVEL ADD :: PUSH");
                                var oParams={
                                        params:travelAdd.getParam(req),
                                        oTable:'tbl_travel'
                                    }
                                    helper.sConsole("oPARAM", JSON.stringify(oParams));

                                dbconnection.getInsertFields(oParams,
                                function (model) {
                                                var  serviceResponse = (model) ? model : {};
                                                req.model = {
                                                                viewName : "traveladd",
                                                                data : {
                                                                                viewModel:serviceResponse
                                                                }
                                                };
                                                console.log(req.model.data);
                                              next();
                                });
                },

                getParam:function(req){
                    var body    =   req.body,
                            Params={
                                                "travel_bookeddate":body.travel_bookeddate,
                                                "travel_date":body.travel_date,
                                                "travel_from":body.travel_from,
                                                "travel_to":body.travel_to,
                                                "travel_mode":body.travel_mode,
                                                "travel_status":body.travel_status,
                                                "travel_pnr":body.travel_pnr,
                                                "travel_amount":body.travel_amount,
                                                "travel_count":body.travel_count,
                                                "travel_comment":body.travel_comment
                            };
                            return Params;

                },
                
                routes: function(server){
                                server.get("/traveladd", auth.isAuthenticated(),travelAdd.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                                server.post("/traveladd",travelAdd.pushTravelData,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                }
};
module.exports=travelAdd.routes;




   



