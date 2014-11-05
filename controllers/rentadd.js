'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        Helper = require('../lib/helper'),
        helper=new Helper();

var rentAdd = {
                process: function(req,res,next){
                              helper.sConsole("CONTROLLER RENT ADD MODEL");
                               req.model = {
                                                                viewName : "rentadd",
                                                                data : {}
                                                };
                               next();
                },

                pushRentData: function(req,res,next){
                     var dbconnection = new dbConModel();
                                helper.sConsole("CONTROLLER RENT ADD :: PUSH");
                                var oParams={
                                        params:rentAdd.getParam(req),
                                        oTable:'tbl_rent'
                                    }
                                helper.sConsole ("oParams", JSON.stringify(oParams));

                                dbconnection.getInsertFields(oParams,
                                function (model) {
                                                var  serviceResponse = (model) ? model : {};
                                                req.model = {
                                                                viewName : "rentadd",
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
                                                "rent_month":body.rent_month,
                                                "rent_amount":body.rent_amount,
                                                "rent_owner":body.rent_owner,
                                                "rent_comment":body.rent_comment,
                                                
                            };
                            helper.sConsole('Params', JSON.stringify(Params));
                           // var ParamsO=$('#frm').serializeArray();
                   // console.log("Serialized" + ParamsO);
                            return Params;

                },
                
                routes: function(server){
                                server.get("/rentadd", auth.isAuthenticated(),rentAdd.process,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                                server.post("/rentadd",rentAdd.pushRentData,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });
                }
};
module.exports=rentAdd.routes;




   



