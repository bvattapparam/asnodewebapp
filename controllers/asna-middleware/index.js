"use strict";

var travelDataSection = require('./middlewares/ajax-bin/travel-data');
var travelDataEditSection = require('./middlewares/ajax-bin/travel-data-edit');

exports.travelData = function (req, res) {
	travelDataSection.process(req, res);
};

exports.travelDataEdit = function (req, res) {
	travelDataEditSection.process(req, res);
	
};