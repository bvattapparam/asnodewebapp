'use strict';

var mysqlDB = require('mysql');

var dbCon= function(){
                this.dbConnection=mysqlDB.createPool({
                                host:'localhost',
                                user:'root',
                                password:'testuser',
                                database:'as_nodeapp'
                }); 
};

dbCon.prototype={
                showFields:function(oTable,oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED");
                                                                connection.query('select  * from  ' +  oTable ,  function(err,result){
                                                                                if(err){
                                                                                             console.log("query ERROR : " + err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                              //  console.log("here" + JSON.stringify(rv));
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                },

                 insertFields:function(oTable,oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                
                                                                var message={};//console.log("MySQL CONNECTED");
                                                               var insertquery= connection.query('insert into  ' +  oTable + ' set ?' ,  oParams, function(err,result){
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
                                                                                            
                                                                                                finalCallback(result,message);
                                                                                }
                                                                });
                                                }
                                });
                },
                showRowFields:function(oTable,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED");
                                                               var oRowFetch= connection.query('SELECT * FROM ' +  oTable, function(err,result){
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
                   showSearchFields_Travel:function(oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED" + oParams.param);
                                                               var oRowFetch= connection.query('SELECT * FROM tbl_travel where travel_id='+oParams.travel_id, function(err,result){
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
                    getUpdateTravelData:function(oTravelID,oParams,finalCallback){
                                this.dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                console.log("get Connection ERROR : " + err);
                                                }
                                                else
                                                {
                                                                //console.log("MySQL CONNECTED" + oParams.param);
                                                               var oRowFetch= connection.query('UPDATE tbl_travel set ? where travel_id='+oTravelID, oParams, function(err,result){
                                                               
                                                               console.log("QUERY" + oRowFetch.sql);// ('insert into  ' +  oTable + ' set ?' ,  oParams, function(err,result){
                                                                                if(err){
                                                                                             console.log("query ERROR in SELECT : " + err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                               // console.log("QUERY : "+ oRowFetch.sql);
                                                                                               //  console.log("here" + JSON.stringify(result));
                                                                                               //  console.log("ROW DATA" + JSON.stringify(result));

                                                                                                var message={
                                                                                                        messagetype:"success",
                                                                                                        messagecontent:"Data has been edited successfully!"
                                                                                                };
                                                                                                finalCallback(result,message);
                                                                                }
                                                                });
                                                }
                                });
                }


};
module.exports = dbCon;

  

