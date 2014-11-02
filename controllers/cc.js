'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        Helper = require('../lib/helper'),
        helper=new Helper();

var CreditCard = {
                process: function(req,res,next){
                              helper.sConsole("REACHED TO TRAVEL VIEW");
                              CreditCard.getCCTransactionData(req,next);
                },
                 getCCTransactionData: function(req,next){
                                 var dbconnection = new dbConModel();
                                helper.sConsole("SESSION START", req.session.messageType);
                                var oParams = {
                                                oTable:'tbl_cc'
                                };
                                
                                dbconnection.getRowFields(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                       var locality='IN',
                                                                culture = 'en_IN',
                                                                currency='INR';
                                                        helper.cFormatter(locality,culture,serviceResponse,currency,'cc_amount','cc_formated_amount');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'cc_date','D');

                                                        var total_amount = helper.cTotalAmount(serviceResponse,'cc_amount')
                                                        var formatted_Total_Amount=helper.cFormatter(locality,culture,'NA',currency,total_amount,'NA');
                                                        

                                                        helper.sConsole("CC RESPONSE DATA", JSON.stringify(serviceResponse));
                                                    req.model = {
                                                                viewName : "cc",
                                                                data : {
                                                                                viewModel:serviceResponse,
                                                                                messageType:req.session.messageType,
                                                                                messageContent:req.session.messageContent,
                                                                                totalAmount:formatted_Total_Amount
                                                                }
                                                };
                                                helper.sConsole("SESSION", req.session.messageType);
                                                req.session.messageType=null;
                                                 req.session.messageContent=null;
                                              next();

                                });
                                  
    },

                routes: function(server){
                                server.get("/cc", auth.isAuthenticated(),CreditCard.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                                server.post("/cc",CreditCard.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });

                },
              
};
module.exports=CreditCard.routes;




   



