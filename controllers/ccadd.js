'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        dbConModel = require("../models/dbcon"),
        Helper = require('../lib/helper');

var ccAdd = {
                process: function(req,res,next){
                              console.log("CONTROLLER CC ADD");
                               req.model = {
                                                                viewName : "ccadd",
                                                                data : {}
                                                };
                               next();
                },

                pushTravelData: function(req,res,next){
                     var dbconnection = new dbConModel();
                                console.log("CONTROLLER TRAVEL ADD :: PUSH");
                              //  var oTable = "tbl_travel";
                                var oParams={
                                        params:ccAdd.getParam(req),
                                        oTable:'tbl_cc'
                                    }
                                console.log ("oParams" + JSON.stringify(oParams));

                                dbconnection.getInsertFields(oParams,
                                function (model) {
                                                var  serviceResponse = (model) ? model : {};
                                                req.model = {
                                                                viewName : "ccadd",
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
                                                "cc_date":body.cc_date,
                                                "cc_amount":body.cc_amount,
                                                "cc_item":body.cc_item,
                                                "cc_fourdigit":body.cc_fourdigit,
                                                "cc_provider":body.cc_provider,
                                                "cc_type":body.cc_type,
                                                "cc_status":body.cc_status,
                                                "cc_comment":body.cc_comment,
                                                
                            };
                            console.log('Params' + JSON.stringify(Params));
                            return Params;

                },
                
                routes: function(server){
                                server.get("/ccadd", auth.isAuthenticated(),ccAdd.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                                server.post("/ccadd",ccAdd.pushTravelData,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                }
};
module.exports=ccAdd.routes;




   



