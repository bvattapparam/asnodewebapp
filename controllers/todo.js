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
                setInitialModel:function(req, next) {
                      req.model = {
                            viewName:'todo',
                            data : {}
                        };
                },
                process: function(req,res,next){
                              helper.sConsole("REACHED TO TODO SUB-VIEW");
                              Todo.setInitialModel(req, next);
                              Todo.getTodoList(req, next);

                },
                processAdd:function (req, res, next){
                          Todo.setInitialModel(req, next);
                            helper.sConsole("REACHED TODO ADD");
                            Todo.pushTodo(req,res, next); // calling to push the data
                },
                getParam:function(req){
                    var body    =   req.body,
                            Params={
                                                "todo":body.todo,
                                                "todo_category":body.todo_category
                            };
                            helper.sConsole('Params' + JSON.stringify(Params));
                            return Params;
                },
                pushTodo: function(req,res,next){
                     var dbconnection = new dbConModel();
                                helper.sConsole("CONTROLLER TODO ADD :: PUSH");
                                var oParams={
                                        params:Todo.getParam(req),
                                        oTable:'tbl_todo'
                                    }
                                helper.sConsole("oParams" + JSON.stringify(oParams));

                                dbconnection.getInsertFields(oParams,
                                function (model) {
                                                var  serviceResponse = (model) ? model : {};
                                                req.model.data.viewModel=serviceResponse;
                                             //next();
                                });
                                Todo.process(req,res, next);
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
                                                            req.model.data.toDoList = toDoResponse;
                                                            req.model.data.messageType=req.session.messageType;
                                                            req.model.data.messageContent=req.session.messageContent;
                                                            req.session.messageType=null;
                                                            req.session.messageContent=null;
                                             next();

                                });
              },
                routes: function(server){
                                server.get("/todo", auth.isAuthenticated(),Todo.process,function(req,res){
                                  helper.sConsole("REACHED TODO view");
                                                res.render(req.model.viewName,req.model);
                                });
                                server.post("/todo",Todo.processAdd,function(req,res){
                                                res.render(req.model.viewName,req.model);
                                });

                }

};
module.exports=Todo.routes;




   



