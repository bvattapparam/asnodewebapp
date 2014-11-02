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

var shoppingAdd = {
                process: function(req,res,next){
                              helper.sConsole("CONTROLLER SHOPPING ADD");
                               req.model = {
                                                                viewName : "shoppingadd",
                                                                data : {}
                                                };
                               next();
                },

                pushTravelData: function(req,res,next){
                     var dbconnection = new dbConModel();
                                helper.sConsole("CONTROLLER SHOPPING ADD :: PUSH");
                              //  var oTable = "tbl_travel";
                                var oParams={
                                        params:shoppingAdd.getParam(req),
                                        oTable:'tbl_shopping'
                                    }
                                helper.sConsole("oParams" + JSON.stringify(oParams));

                                dbconnection.getInsertFields(oParams,
                                function (model) {
                                                var  serviceResponse = (model) ? model : {};
                                                req.model = {
                                                                viewName : "shoppingadd",
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
                                                "shopping_date":body.shopping_date,
                                                "shopping_amount":body.shopping_amount,
                                                "shopping_item":body.shopping_item,
                                                "shopping_cart":body.shopping_cart,
                                                "shopping_status":body.shopping_status,
                                                "shopping_comment":body.shopping_comment,
                                                
                            };
                            helper.sConsole('Params' + JSON.stringify(Params));
                            return Params;

                },
                
                routes: function(server){
                                server.get("/shoppingadd", auth.isAuthenticated(),shoppingAdd.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                                server.post("/shoppingadd",shoppingAdd.pushTravelData,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                }
};
module.exports=shoppingAdd.routes;




   



