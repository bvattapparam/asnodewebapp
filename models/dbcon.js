'use strict';

var mysqlDB = require('mysql');
var locale = require('../lib/locale');
var Helper=require('../lib/helper');
var helper=new Helper();

var dbCon= function(){
        this.dbConnection=helper.dbConfigSet();
}

dbCon.prototype={
                 getInsertFields:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                helper.sConsole("get Connection ERROR  ", err);
                                                }
                                                else
                                                {               
                                                                var message={};
                                                               var insertquery= connection.query('insert into  ' +  oParams.oTable + ' set ?' ,  oParams.params, function(err,result){
                                                                                connection.release();  // release connection once the query is executed and allow other query to run
                                                                                if(err){
                                                                                             helper.sConsole("query ERROR in Insert: " , err);  
                                                                                              var message,messagecontent;
                                                                                              message="info";
                                                                                              messagecontent=err+"There is some error"
                                                                                            finalCallback(err,message);
                                                                                }
                                                                                else
                                                                                {
                                                                                               helper.sConsole("get Insert QUERY : ", insertquery.sql);
                                                                                                helper.sConsole("get Insert Result", JSON.stringify(result));
                                                                                               
                                                                                              message={
                                                                                                        messagetype:"success",
                                                                                                        messagecontent:"Data has been added successfully!"
                                                                                              };
                                                                                            result.message=message;
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                },
                getRowFields:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                helper.sConsole("get Connection ERROR  ", err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED");
                                                               var oRowFetch= connection.query('SELECT * FROM ' +  oParams.oTable, function(err,result){
                                                                                connection.release();
                                                                                if(err){
                                                                                             helper.sConsole("query ERROR in Select : " , err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                               helper.sConsole("CODE FOR RESULT :",  JSON.stringify(result));
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                },
                getUpdateDataonID:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                helper.sConsole("get Connection ERROR : ", err);
                                                }
                                                else
                                                {
                                                               var oRowFetch= connection.query('UPDATE '+oParams.oTable+' set ? where '+oParams.oField+'='+oParams.oId, oParams.param, function(err,result){
                                                                                connection.release();
                                                                                if(err){
                                                                                             helper.sConsole("query ERROR in Update : ", err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                                var message={
                                                                                                        messagetype:"success",
                                                                                                        messagecontent:"Data has been edited successfully!"
                                                                                                };
                                                                                                 result['message'] =message;
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                },

                getDataonID:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                helper.sConsole("get Connection ERROR : ", err);
                                                }
                                                else
                                                {
                                                               var oRowFetch= connection.query('SELECT * FROM '+oParams.oTable+' where '+oParams.oField+'='+oParams.oId, function(err,result){
                                                                                connection.release();
                                                                                if(err){
                                                                                             helper.sConsole("query ERROR in SELECT : ", err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                                helper.sConsole("ROW DATA in getDataon ID", JSON.stringify(result));
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                },
                deleteDataonID:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                helper.sConsole("get Connection ERROR deleteDataon ID : ", err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED" + oParams.param);
                                                               var oRowFetch= connection.query('DELETE  FROM '+oParams.oTable+' where '+oParams.oField+'='+oParams.oId, function(err,result){
                                                                                connection.release();
                                                                                if(err){
                                                                                             helper.sConsole("query ERROR in Delete : ", err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                               var message={
                                                                                                        messagetype:"warning",
                                                                                                        messagecontent:"Data has been deleted successfully!"
                                                                                                };
                                                                                                result['message'] =message;
                                                                                                finalCallback(result);
                                                                                                helper.sConsole("DELETE response", JSON.stringify(result));
                                                                                }
                                                                });
                                                }
                                });
                },

                // method to get the sum of travel 
                getSum:function(oParam,finalCallback){
                    this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                helper.sConsole("get Connection ERROR deleteDataon ID : ", err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED" + oParams.param);
                                                              //var oRowFetch= connection.query('SELECT ( select SUM(travel_amount) FROM tbl_travel) as tvalue,(select sum(cc_amount) from tbl_cc) as cvalue,(select sum(shopping_amount) from tbl_shopping) as svalue', function(err,result){
                                                                 var oRowFetch= connection.query('SELECT  SUM(travel_amount)  as tvalue, sum(cc_amount) as cvalue, sum(shopping_amount)  as svalue from tbl_travel travel, tbl_cc cc , tbl_shopping shopping', function(err,result){
                                                                                connection.release();
                                                                                if(err){
                                                                                             helper.sConsole("query ERROR in SUM  : ", err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                                 var message={
                                                                                                        messagetype:"warning",
                                                                                                        messagecontent:"Data has been deleted successfully!"
                                                                                                };
                                                                                               
                                                                                                helper.sConsole("SUM OF TRAVEL", JSON.stringify(result));
                                                                                                finalCallback(result);
                                                                                                
                                                                                }
                                                                });
                                                }
                                });
                }
};
module.exports = dbCon;

  

