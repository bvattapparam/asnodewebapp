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
                                                                //console.log("MySQL CONNECTED");
                                                               var insertquery= connection.query('insert into  ' +  oTable + ' set ?' ,  oParams, function(err,result){
                                                                                if(err){
                                                                                             console.log("query ERROR : " + err);  
                                                                                }
                                                                                else
                                                                                {
                                                                                               console.log("QUERY : "+ insertquery.sql);
                                                                                                console.log("here" + JSON.stringify(result));
                                                                                                finalCallback(result);
                                                                                }
                                                                });
                                                }
                                });
                }


};
module.exports = dbCon;

  

