
"use strict";
var config = require('nconf'),
        rootURI = config.get('requestURI'),
 async = require('async'),
      dbConModel = require("../../../../models/dbcon"),
      Helper=require("../../../../lib/helper"),
      helper=new Helper();

function getResponse(req, next) {
  
      var  asnaMiddleware = new dbConModel(),

                 Param = req.params,
                        oParams = {
                                  oId:Param.id,
                                  oTable:'tbl_travel',
                                  oField:'travel_id'
                };
                helper.sConsole("LATEST", JSON.stringify(oParams));
                asnaMiddleware.deleteDataonID(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                        helper.sConsole("TRAVEL RESPONSE DATA ", JSON.stringify(serviceResponse));
                                                        req.model = {
                                                                    data: {
                                                                      viewmd:serviceResponse
                                                                    }
                                                        };
                                                        req.session.messageType = req.model.data.viewmd.message.messagetype;
                                                        req.session.messageContent = req.model.data.viewmd.message.messagecontent;
                                                        helper.sConsole("ROW SESSION - TRAVEL DATA DELETE", req.session.messageType);
                                                        helper.sConsole("ROW TRAVEL DATA REDIRECT", JSON.stringify(req.model))
                                                      next();                      
                });
}

exports.process = function (req, res) {
	async.series([
			function (cb) {
				getResponse(req, cb);
			}
		], function (err, aResult) {
                                            res.redirect(rootURI+'/travel');
		}
	);
};
