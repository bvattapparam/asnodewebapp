'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        Helper = require('../lib/helper');

        console.log("TRAVEL" + rootURI);

var Travel = {
                process: function(req,res,next){
                              //  Dashboard.getdashboardImages(req,next);
                              console.log("here is travel");
                              Travel.getTravelTransactionData(req,next);
                                console.log("function called");
                               
                               // next();
                },
                 getTravelTransactionData: function(req,next){
                    console.log("getTravelTransactionData");
                                var helper = new Helper();
                                 var dbconnection = new dbConModel();
                                 var oTable = "tbl_travel";

                                var oParams = {
                                                "username": "USPS_Domestic",
                                                "password": "US"
                                };
                                
                                dbconnection.showRowFields(oTable,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                        console.log("TRAVEL RESPONSE DATA : " + JSON.stringify(serviceResponse));
                                                    req.model = {
                                                                viewName : "travel",
                                                                data : {
                                                                                viewModel:serviceResponse
                                                                }
                                                };
                                              next();

                                });
                                  
    },

                routes: function(server){
                                server.get("/travel", auth.isAuthenticated(),Travel.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                                console.log("reached to travel");
                                });
                                server.post("/travel",Travel.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });

                },
              
};
module.exports=Travel.routes;




   



