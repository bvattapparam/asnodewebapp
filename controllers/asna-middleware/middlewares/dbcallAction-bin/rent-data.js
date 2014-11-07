
"use strict";

var async = require('async'),
Helper = require('../../../../lib/helper'),
      dbConModel = require("../../../../models/dbcon"),
      helper=new Helper();

function getResponse(req, next) {
  
      var  asnaMiddleware = new dbConModel(),
                 body = req.body,
                        oParams = {
                                  oId:body.rentID,
                                  oTable:'tbl_rent',
                                  oField:'rent_id'
                };
                asnaMiddleware.getDataonID(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                       helper.sConsole("RENT RESPONSE DATA : ", JSON.stringify(serviceResponse));
                                                       var locality='IN',
                                                                culture = 'en_IN',
                                                                currency='INR';
                                                        helper.cFormatter(locality,culture,serviceResponse,currency,'rent_amount','cc_formated_amount');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'rent_month','m');
                                                        
                                                        req.model = {
                                                                    data: {viewmd:serviceResponse}
                                                        };
                                                        helper.sConsole("ROW DATA - RENT" , JSON.stringify(req.model));
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
