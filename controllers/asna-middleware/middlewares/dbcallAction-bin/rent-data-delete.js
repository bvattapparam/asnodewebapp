
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
                                  oTable:'tbl_rent',
                                  oField:'rent_id'
                };
                asnaMiddleware.deleteDataonID(oParams,
                                function (model) {
                                                       var  serviceResponse = (model) ? model : {};
                                                        req.model = {
                                                                    data: {
                                                                      viewmd:serviceResponse
                                                                    }
                                                        };
                                                        req.session.messageType = req.model.data.viewmd.message.messagetype;
                                                        req.session.messageContent = req.model.data.viewmd.message.messagecontent;
                                                      next();                      
                });
}

exports.process = function (req, res) {
	async.series([
			function (cb) {
				getResponse(req, cb);
			}
		], function (err, aResult) {
                                            res.redirect(rootURI+'/rent');
		}
	);
};
