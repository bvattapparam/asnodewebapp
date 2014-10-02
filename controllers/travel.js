'use strict';
var config = require('nconf'),
    requestURI = config.get('requestURI'),
    async = require('async'),
      auth = require('../lib/auth'),
    dashboardData = require('../models/dashboard-data');

var Travel = {
                process: function(req,res,next){
                              //  Dashboard.getdashboardImages(req,next);
                              console.log("here is travel");
                               req.model={
                                                                viewName : "travel",
                                                                data:{ }
                                                };
                                                next();
                },

                routes: function(server){
                                server.get("/travel", auth.isAuthenticated(),Travel.process,function(req,res){
                                                res.render('travel',req.model);
                                                console.log("reached to travel");
                                });
                                server.post("/travel",Travel.process,function(req,res){
                                                res.render('travel',req.model);
                                });
                }
};
module.exports=Travel.routes;




   



