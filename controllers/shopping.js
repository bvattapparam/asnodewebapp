'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        Helper = require('../lib/helper'),
        helper=new Helper();

var Shopping = {
                process: function(req,res,next){
                              Shopping.getShoppingTransactionData(req,next);
                },
                 getShoppingTransactionData: function(req,next){
                                 var dbconnection = new dbConModel();
                                helper.sConsole("SESSION START" + req.session.messageType)
                                var oParams = {
                                                oTable:'tbl_shopping'
                                };
                                
                                dbconnection.getRowFields(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                       var locality='IN',
                                                                culture = 'en_IN',
                                                                currency='INR';
                                                        helper.cFormatter(locality,culture,serviceResponse,currency,'shopping_amount','shopping_formated_amount');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'shopping_date','D');

                                                        var total_amount = helper.cTotalAmount(serviceResponse,'shopping_amount')
                                                        var formatted_Total_Amount=helper.cFormatter(locality,culture,'NA',currency,total_amount,'NA');
                                                        

                                                        helper.sConsole("SHOPPING RESPONSE DATA",  JSON.stringify(serviceResponse));
                                                    req.model = {
                                                                viewName : "shopping",
                                                                data : {
                                                                                viewModel:serviceResponse,
                                                                                messageType:req.session.messageType,
                                                                                messageContent:req.session.messageContent,
                                                                                totalAmount:formatted_Total_Amount
                                                                }
                                                };
                                                helper.sConsole("SESSION",  req.session.messageType);
                                                req.session.messageType=null;
                                                 req.session.messageContent=null;
                                              next();

                                });
                                  
    },

                routes: function(server){
                                server.get("/shopping", auth.isAuthenticated(),Shopping.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                                helper.sConsole("REACHED TO SHOPPING VIEW");
                                });
                                server.post("/shopping",Shopping.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });

                },
              
};
module.exports=Shopping.routes;




   



