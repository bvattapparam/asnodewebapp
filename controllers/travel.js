'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        locale = require('../lib/locale'),
        Helper = require('../lib/helper');
        var helper = new Helper();
        // add below line to get the todo items
   
var Travel = {
                process: function(req,res,next){
                              Travel.getTravelTransactionData(req,next);
                            
                },
              
                 getTravelTransactionData: function(req,next){

                                var dbconnection = new dbConModel();
                                var oParams = {
                                                oTable:'tbl_travel'
                                };
                                
                                dbconnection.getRowFields(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};

                                                       var locality='IN',
                                                                culture = 'en_IN',
                                                                currency='INR';
                                                        helper.cFormatter(locality,culture,serviceResponse,currency,'travel_amount','travel_formated_amount');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'travel_date','D');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'travel_bookeddate','d');
                                                       
                                                        var total_amount = helper.cTotalAmount(serviceResponse,'travel_amount')
                                                        var formatted_Total_Amount=helper.cFormatter(locality,culture,'NA',currency,total_amount,'NA');
                                                       
                                                        helper.sConsole("TRAVEL DATA",JSON.stringify(serviceResponse));
                                                        req.model = {
                                                                    viewName : "travel",
                                                                    data : {
                                                                                    viewModel:serviceResponse,
                                                                                    messageType:req.session.messageType,
                                                                                    messageContent:req.session.messageContent,
                                                                                    totalAmount:formatted_Total_Amount
                                                                    }
                                                        };
                                                helper.sConsole("SESSION",req.session.messageType);
                                                req.session.messageType=null;
                                                 req.session.messageContent=null;
                                              next();

                                });
                                  
    },

                routes: function(server){
                                server.get("/travel", auth.isAuthenticated(),Travel.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                                helper.sConsole("REACHED TO TRAVEL VIEW");
                                });
                                server.post("/travel",Travel.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });

                },
              
};
module.exports=Travel.routes;




   



