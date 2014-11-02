
"use strict";

var async = require('async'),
        dbConModel = require("../../../../models/dbcon"),
        Helper=require("../../../../lib/helper"),
        helper=new Helper();

function getResponse(req, next) {
      var  asnaMiddleware = new dbConModel(),
                body = req.body,
                        oParams = {
                            param:{
                                cc_date:body.cc_date,
                                cc_item:body.cc_item,
                                cc_amount:body.cc_amount,
                                cc_status:body.cc_status,
                                cc_type:body.cc_type,
                                cc_fourdigit:body.cc_fourdigit,
                                cc_provider:body.cc_provider,
                                cc_comment:body.cc_comment
                            },
                            oId:body.ccID,
                            oTable:'tbl_cc',
                            oField:'cc_id'
                };
                
                asnaMiddleware.getUpdateDataonID(oParams,
                                function (model, message) {
                                                       var  serviceResponse = (model) ? model : {};
                                                        req.model = {
                                                                    data: {
                                                                            viewmd:serviceResponse
                                                                        }
                                                        };
                                              next();
                });
}

exports.process = function (req, res) {
    async.series([
            function (cb) {
                getResponse(req, cb);
            }
        ], function (err, aResult) {
            console.log("RMODEL :" + JSON.stringify(req.model));
            res.json(req.model);
        }
    );
};