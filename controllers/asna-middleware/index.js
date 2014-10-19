"use strict";

var travelDataSection = require('./middlewares/dbcallAction-bin/travel-data');
var travelDataEditSection = require('./middlewares/dbcallAction-bin/travel-data-edit');
var travelDataDeleteSection = require('./middlewares/dbcallAction-bin/travel-data-delete');
exports.travelData = function (req, res) {
	travelDataSection.process(req, res);
};

exports.travelDataEdit = function (req, res) {
	travelDataEditSection.process(req, res);
	
};

exports.travelDataDelete = function (req, res) {
	travelDataDeleteSection.process(req, res);
	
};
