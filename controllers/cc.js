'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        Helper = require('../lib/helper');

        console.log("CC" + rootURI);

var CreditCard = {
                process: function(req,res,next){
                              //  Dashboard.getdashboardImages(req,next);
                              console.log("here is travel");
                              CreditCard.getCCTransactionData(req,next);
                                console.log("function called");
                               
                               // next();
                },
                 getCCTransactionData: function(req,next){
                    console.log("getCCTransactionData");
                                var helper = new Helper();
                                 var dbconnection = new dbConModel();
                                // var oTable = "tbl_travel";
                                console.log("sessionstart" + req.session.messageType)
                                var oParams = {
                                                oTable:'tbl_cc'
                                };
                                
                                dbconnection.getRowFields(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                        console.log("CC RESPONSE DATA : " + JSON.stringify(serviceResponse));
                                                    req.model = {
                                                                viewName : "cc",
                                                                data : {
                                                                                viewModel:serviceResponse,
                                                                                messageType:req.session.messageType,
                                                                                messageContent:req.session.messageContent
                                                                }
                                                };
                                                console.log("session" + req.session.messageType)
                                                req.session.messageType=null;
                                                 req.session.messageContent=null;
                                              next();

                                });
                                  
    },

                routes: function(server){
                                server.get("/cc", auth.isAuthenticated(),CreditCard.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                                console.log("reached to CC");
                                });
                                server.post("/cc",CreditCard.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });

                },
              
};
module.exports=CreditCard.routes;




   



