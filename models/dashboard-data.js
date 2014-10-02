'use strict';
var jsonModel = require('../public/assets/jsonModel.json');

var dashboardData= function(){};

dashboardData.prototype={
                fetchImagePath:function(Callback){
                                Callback(jsonModel.viewModel);
                                
                 },
};
module.exports = dashboardData;

  

