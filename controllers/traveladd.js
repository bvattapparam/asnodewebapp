'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        dbConModel = require("../models/dbcon"),
        Helper = require('../lib/helper');

var travelAdd = {
                process: function(req,res,next){
                              console.log("CONTROLLER TRAVEL ADD");
                               req.model = {
                                                                viewName : "traveladd",
                                                                data : {}
                                                };
                               next();
                },

                pushTravelData: function(req,res,next){
                     var dbconnection = new dbConModel();
                                console.log("CONTROLLER TRAVEL ADD :: PUSH");
                              //  var oTable = "tbl_travel";
                                var oParams={
                                        params:travelAdd.getParam(req),
                                        oTable:'tbl_travel'
                                    }
                                console.log ("oParams" + JSON.stringify(oParams));

                                dbconnection.getInsertFields(oParams,
                                function (model,message) {
                                                var  serviceResponse = (model) ? model : {};
                                                req.model = {
                                                                viewName : "traveladd",
                                                                data : {
                                                                                viewModel:serviceResponse,
                                                                                message:message
                                                                }
                                                };
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
                                    "travel_amount":body.travel_amount
                                    //"travel_count":body.travel_count
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




   



