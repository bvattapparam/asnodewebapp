'use strict';
var config = require('nconf'),
    requestURI = config.get('requestURI'),
    async = require('async'),
      auth = require('../lib/auth'),
    dashboardData = require('../models/dashboard-data');

var Dashboard = {
                process: function(req,res,next){
                                Dashboard.getdashboardImages(req,next);
                },

                getdashboardImages:function(req,next){
                                var dashboarddata = new dashboardData();
                                dashboarddata.fetchImagePath(function(model){
                                                var responseData = (model) ? model : {};
                                                console.log("DASH: " + JSON.stringify(responseData));
                                                req.model={
                                                                viewName : "dashboard",
                                                                data:{
                                                                    viewModel:responseData
                                                                }
                                                };
                                                next();
                                });
                },

                routes: function(server){
                                server.get("/dashboard", auth.isAuthenticated(),Dashboard.process,function(req,res){
                                                res.render('dashboard',req.model);
                                                console.log("reached to dashboard");
                                });
                                server.post("/dashboard",Dashboard.process,function(req,res){
                                                res.render('dashboard',req.model);
                                });
                }
};
module.exports=Dashboard.routes;




   



