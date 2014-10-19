
"use strict";

var async = require('async'),
      dbConModel = require("../../../../models/dbcon");

function getResponse(req, next) {
  
      var  asnaMiddleware = new dbConModel(),
                 body = req.body,
                        oParams = {
                                  oId:body.travelID,
                                  oTable:'tbl_travel',
                                  oField:'travel_id'
                };
                //console.log("LATEST" + JSON.stringify(oParams));
                asnaMiddleware.getDataonID(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                        console.log("TRAVEL RESPONSE DATA : " + JSON.stringify(serviceResponse));
                                                        req.model = {
                                                                    data: {viewmd:serviceResponse}
                                                        };
                                                        console.log("ROW DATA" + JSON.stringify(req.model))
                                                      next();                      
                });
}

exports.process = function (req, res) {
	async.series([
			function (cb) {
				getResponse(req, cb);
			}
		], function (err, aResult) {
                                           // console.log("RMODEL :" + JSON.stringify(req.model));
                                            res.json(req.model);
		}
	);
};
