'use strict';
var config = require('nconf'),
    requestURI = config.get('requestURI'),
    async = require('async'),
      auth = require('../lib/auth'),
    dashboardData = require('../models/dashboard-data'),
      dbConModel = require("../models/dbcon"),
    Helper=require('../lib/helper'),
    helper=new Helper();

    var dbconnection = new dbConModel();

var Dashboard = {
                process: function(req,res,next){
                    Dashboard.setInitialModel(req,next);
                     Dashboard.getSum(req,next);
                     Dashboard.getCount(req,next);
                                Dashboard.getdashboardImages(req,next);
                                helper.sConsole("REACHED TO DASHBOARD VIEW");
                },

                setInitialModel:function(req, next) {
                      req.model = {
                            viewName : 'dashboard',
                            data : {}
                        };
                        next();
                },
                getCount:function(req,next){
                  var oParam='tbl_travel';
                          dbconnection.getEntryCount(oParam,function (model) {
                                                       var  entryCount = (model) ? model : {};
                                                   req.model.data.entryCount=entryCount;
                                                   helper.sConsole("COUNT IN CONTROLLER", JSON.stringify(req.model));
                                                //next(null);
                                });
                },
                getSum:function(req,next){
                        var oParam='tbl_travel';
                                 
                                dbconnection.getSum(oParam,function (model) {
                                                       var  sumTravel = (model) ? model : {};
                                                       var  donutParam={
                                                                donutcol:{
                                                                         d1:{'label':'Travel','value':sumTravel[0].tvalue},
                                                                         d2:{'label':'Credit Card','value':sumTravel[0].cvalue},
                                                                         d3:{'label':'Shopping','value':sumTravel[0].svalue}
                                                                }
                                                            };
                                                   req.model.data.vDonutData=donutParam;
                                                //next(null);
                                });
                },

                getdashboardImages:function(req,next){
                                var dashboarddata = new dashboardData();
                                dashboarddata.fetchImagePath(function (model){
                                                var responseData = (model) ? model : {};
                                                helper.sConsole("DASHBOARD", JSON.stringify(responseData));
                                                req.model.data.viewModel=responseData;
                                            // next(null);
                                });
                                console.log("------" + JSON.stringify(req.model));
                },

                routes: function(server){
                                server.get("/dashboard", auth.isAuthenticated(),Dashboard.process,function(req,res){
                                                res.render('dashboard',req.model);
                                });
                                server.post("/dashboard",Dashboard.process,function(req,res){
                                                res.render('dashboard',req.model);
                                });
                }
};
module.exports=Dashboard.routes;




   



