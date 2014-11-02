
"use strict";

var async = require('async'),
        Helper = require('../../../../lib/helper'),
      dbConModel = require("../../../../models/dbcon"),
      helper=new Helper();

function getResponse(req, next) {
  
      var  asnaMiddleware = new dbConModel(),
                 body = req.body,
                        oParams = {
                                  oId:body.travelID,
                                  oTable:'tbl_travel',
                                  oField:'travel_id'
                };
                asnaMiddleware.getDataonID(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                          var locality='IN',
                                                                culture = 'en_IN',
                                                                currency='INR';
                                                        helper.cFormatter(locality,culture,serviceResponse,currency,'travel_amount','travel_formated_amount');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'travel_date','m');
                                                        helper.dFormatter(locality,culture,serviceResponse,currency,'travel_bookeddate','m');
                                                        console.log("TRAVEL RESPONSE DATA AJAX : " + JSON.stringify(serviceResponse));
                                                        req.model = {
                                                                    data: {viewmd:serviceResponse}
                                                        };
                                                        helper.sConsole("TRAVEL ROW DATA",  JSON.stringify(req.model));
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
