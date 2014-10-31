
"use strict";

var async = require('async'),
Helper = require('../../../../lib/helper'),
      dbConModel = require("../../../../models/dbcon"),
      helper=new Helper();

function getResponse(req, next) {
  
      var  asnaMiddleware = new dbConModel(),
                 body = req.body,
                        oParams = {
                                  oId:body.shoppingID,
                                  oTable:'tbl_shopping',
                                  oField:'shopping_id'
                };
                //console.log("LATEST" + JSON.stringify(oParams));
                asnaMiddleware.getDataonID(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                       var locality='IN',
                                                                culture = 'en_IN',
                                                                currency='INR';
                                                        helper.cFormatter(locality,culture,serviceResponse,currency,'shopping_amount','shopping_formated_amount');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'shopping_date','m');
                                                        helper.sConsole("SHOPPING RESPONSE DATA : ", JSON.stringify(serviceResponse));
                                                        req.model = {
                                                                    data: {viewmd:serviceResponse}
                                                        };
                                                        helper.sConsole("ROW DATA SHOPPING", JSON.stringify(req.model))
                                                      next();                      
                });
}

exports.process = function (req, res) {
	async.series([
			function (cb) {
				getResponse(req, cb);
			}
		], function (err, aResult) {
                                            res.json(req.model);
		}
	);
};
