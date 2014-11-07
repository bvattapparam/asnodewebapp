
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
                                rent_month:body.rent_month,
                                rent_amount:body.rent_amount,
                                rent_owner:body.rent_owner,
                                rent_comment:body.rent_comment
                            },
                            oId:body.rentID,
                            oTable:'tbl_rent',
                            oField:'rent_id'
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