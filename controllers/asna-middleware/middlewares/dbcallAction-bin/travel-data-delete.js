
"use strict";
var config = require('nconf'),
        rootURI = config.get('requestURI'),
 async = require('async'),
      dbConModel = require("../../../../models/dbcon");

function getResponse(req, next) {
  
      var  asnaMiddleware = new dbConModel(),
                 //body = req.body,

                 Param = req.params,
                        oParams = {
                                  oId:Param.id,
                                  oTable:'tbl_travel',
                                  oField:'travel_id'
                };
                console.log("LATEST" + JSON.stringify(oParams));
                asnaMiddleware.deleteDataonID(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                        console.log("TRAVEL RESPONSE DATA : " + JSON.stringify(serviceResponse));
                                                        req.model = {
                                                                    data: {
                                                                      viewmd:serviceResponse
                                                                    }
                                                        };
                                                        req.session.messageType = req.model.data.viewmd.message.messagetype;
                                                        req.session.messageContent = req.model.data.viewmd.message.messagecontent;
                                                        console.log("ROW SESSION" + req.session.messageType);
                                                        console.log("ROW DATA REDIRECT:" + JSON.stringify(req.model))
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
                                           //res.json(req.model);
                                            res.redirect(rootURI+'/travel');
		}
	);
};
