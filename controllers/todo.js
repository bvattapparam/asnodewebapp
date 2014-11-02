'use strict';
var config = require('nconf'),
        rootURI = config.get('requestURI'),
        async = require('async'),
        mysql=require('mysql'),
        dbConModel = require("../models/dbcon"),
        auth = require('../lib/auth'),
        Helper = require('../lib/helper'),
        helper=new Helper();

var Todo = {
                process: function(req,res,next){
                              helper.sConsole("REACHED TO TODO SUB-VIEW");
                              Todo.setInitialModel(req, next);
                              Todo.getTodoList(req, next);
                },
                 setInitialModel:function(req, next) {
                      req.model = {
                            data : {}
                        };
                        next();
                },
                 getTodoList: function(req,next){
                                 var dbconnection = new dbConModel();
                                helper.sConsole("SESSION START", req.session.messageType);
                                var oParams = {
                                                oTable:'tbl_todo'
                                };
                                
                                dbconnection.getTodo(oParams,
                                function (model) {
                                                    var  toDoResponse = (model) ? model : {};
                                                    helper.sConsole("TODO RESPONSE DATA", JSON.stringify(toDoResponse));
                                                    req.model.data.toDoList = toDoResponse;
                                                
                                              
                                             // next();

                                });
                                  
    }

};
module.exports=Todo.process;




   



