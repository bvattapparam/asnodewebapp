'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        Helper = require('../lib/helper'),
        helper=new Helper();

var Rent = {
                process: function(req,res,next){
                              helper.sConsole("REACHED TO RENT VIEW");
                              Rent.getRentData(req,next);
                },
                 getRentData: function(req,next){
                                 var dbconnection = new dbConModel();
                                helper.sConsole("SESSION START FOR RENT", req.session.messageType);
                                var oParams = {
                                                oTable:'tbl_rent'
                                };
                                
                                dbconnection.getRowFields(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                       var locality='IN',
                                                                culture = 'en_IN',
                                                                currency='INR';
                                                        helper.cFormatter(locality,culture,serviceResponse,currency,'rent_amount','rent_formated_amount');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'rent_month','Y');

                                                        var total_amount = helper.cTotalAmount(serviceResponse,'rent_amount')
                                                        var formatted_Total_Amount=helper.cFormatter(locality,culture,'NA',currency,total_amount,'NA');
                                                        

                                                        helper.sConsole("RENT RESPONSE DATA", JSON.stringify(serviceResponse));
                                                    req.model = {
                                                                viewName : "rent",
                                                                data : {
                                                                                viewModel:serviceResponse,
                                                                                messageType:req.session.messageType,
                                                                                messageContent:req.session.messageContent,
                                                                                totalAmount:formatted_Total_Amount
                                                                }
                                                };
                                                req.session.messageType=null;
                                                 req.session.messageContent=null;
                                              next();

                                });
                                  
    },

                routes: function(server){
                                server.get("/rent", auth.isAuthenticated(),Rent.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                                server.post("/rent",Rent.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });

                },
              
};
module.exports=Rent.routes;




   



