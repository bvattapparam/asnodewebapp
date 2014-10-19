'use strict';

var mysqlDB = require('mysql');

var dbCon= function(){
                this.dbConnection=mysqlDB.createPool({
                                host:'localhost',
                                user:'root',
                                password:'testuser',
                                database:'as_nodeapp'
                }); 
// LIVE
//                   this.dbConnection=mysqlDB.createPool({
//                                 host     : '127.3.39.129',
//                               user     : 'adminXFreqs7',
//                               password : 'XxAjSNGL5BAR',
//                               database:"asna"
//                                             }); 
 };

dbCon.prototype={
                
                 getInsertFields:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                
                                                                var message={};//console.log("MySQL CONNECTED");
                                                               var insertquery= connection.query('insert into  ' +  oParams.oTable + ' set ?' ,  oParams.params, function(err,result){
                                                                                connection.release();  // release connection once the query is executed and allow other query to run
                                                                                if(err){
                                                                                             console.log("query ERROR : " + err);  
                                                                                              var message,messagecontent;
                                                                                              message="info";
                                                                                              messagecontent=err+"There is some error"
                                                                                            finalCallback(err,message);
                                                                                }
                                                                                else
                                                                                {
                                                                                               console.log("QUERY : "+ insertquery.sql);
                                                                                                console.log("here" + JSON.stringify(result));
                                                                                               
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
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED");
                                                               var oRowFetch= connection.query('SELECT * FROM ' +  oParams.oTable, function(err,result){
                                                                                connection.release();
                                                                                if(err){
                                                                                             console.log("query ERROR in SELECT : " + err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                               console.log("QUERY : "+ oRowFetch.sql);
                                                                                                console.log("here" + JSON.stringify(result));
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                },
                getUpdateDataonID:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED" + oParams.param);
                                                               var oRowFetch= connection.query('UPDATE '+oParams.oTable+' set ? where '+oParams.oField+'='+oParams.oId, oParams.param, function(err,result){
                                                                                connection.release();
                                                                                //console.log("QUERY" + oRowFetch.sql);// ('insert into  ' +  oTable + ' set ?' ,  oParams, function(err,result){
                                                                                if(err){
                                                                                             console.log("query ERROR in SELECT : " + err);  
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
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED" + oParams.param);
                                                               var oRowFetch= connection.query('SELECT * FROM '+oParams.oTable+' where '+oParams.oField+'='+oParams.oId, function(err,result){
                                                                                connection.release();
                                                                                if(err){
                                                                                             console.log("query ERROR in SELECT : " + err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                               console.log("QUERY : "+ oRowFetch.sql);
                                                                                                console.log("here" + JSON.stringify(result));
                                                                                                console.log("ROW DATA" + JSON.stringify(result));
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                },
                deleteDataonID:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED" + oParams.param);
                                                               var oRowFetch= connection.query('DELETE  FROM '+oParams.oTable+' where '+oParams.oField+'='+oParams.oId, function(err,result){
                                                                                connection.release();
                                                                                if(err){
                                                                                             console.log("query ERROR in SELECT : " + err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                               console.log("QUERY : "+ oRowFetch.sql);
                                                                                               var message={
                                                                                                        messagetype:"warning",
                                                                                                        messagecontent:"Data has been deleted successfully!"
                                                                                                };
                                                                                                result['message'] =message;
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                }
                


};
module.exports = dbCon;

  

