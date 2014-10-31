
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
                                shopping_date:body.shopping_date,
                                shopping_item:body.shopping_item,
                                shopping_amount:body.shopping_amount,
                                shopping_status:body.shopping_status,
                                shopping_cart:body.shopping_cart,
                                shopping_comment:body.shopping_comment
                            },
                            oId:body.shoppingID,
                            oTable:'tbl_shopping',
                            oField:'shopping_id'
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