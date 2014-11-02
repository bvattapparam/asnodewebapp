/** Helper : Can be use to for global functions. **/
'use strict';
var locale = require('../lib/locale');
var mysqlDB = require('mysql');
var dbConModel = require("../models/dbcon");
var Helper=require('../lib/helper');
var helper=new Helper();


function Todo() {
}

Todo.prototype = {

      
                // call todo here
                getTodoList: function(req){
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
                                });
              }
};

module.exports = Todo;
