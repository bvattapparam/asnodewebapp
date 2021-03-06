
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
                                travel_bookeddate:body.travel_bookeddate,
                                travel_date:body.travel_date,
                                travel_from:body.travel_from,
                                travel_to:body.travel_to,
                                travel_mode:body.travel_mode,
                                travel_status:body.travel_status,
                                travel_pnr:body.travel_pnr,
                                travel_amount:body.travel_amount,
                                travel_count:body.travel_count,
                                travel_comment:body.travel_comment
                            },
                            oId:body.travelID,
                            oTable:'tbl_travel',
                            oField:'travel_id'
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
            helper.sConsole("ROW MODEL", JSON.stringify(req.model));
            res.json(req.model);
        }
    );
};