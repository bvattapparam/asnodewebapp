"use strict";

var travelDataSection = require('./middlewares/dbcallAction-bin/travel-data');
var travelDataEditSection = require('./middlewares/dbcallAction-bin/travel-data-edit');
var travelDataDeleteSection = require('./middlewares/dbcallAction-bin/travel-data-delete');
var ccDataSection = require('./middlewares/dbcallAction-bin/cc-data');
var ccDataEditSection = require('./middlewares/dbcallAction-bin/cc-data-edit');
var ccDataDeleteSection = require('./middlewares/dbcallAction-bin/cc-data-delete');
var shoppingDataDeleteSection = require('./middlewares/dbcallAction-bin/shopping-data-delete');
var todoDataDeleteSection = require('./middlewares/dbcallAction-bin/todo-data-delete');
var rentDataDeleteSection = require('./middlewares/dbcallAction-bin/rent-data-delete');

var shoppingDataSection = require('./middlewares/dbcallAction-bin/shopping-data');
var shoppingDataEditSection = require('./middlewares/dbcallAction-bin/shopping-data-edit');

exports.travelData = function (req, res) {
	travelDataSection.process(req, res);
};

exports.travelDataEdit = function (req, res) {
	travelDataEditSection.process(req, res);
};

exports.travelDataDelete = function (req, res) {
	travelDataDeleteSection.process(req, res);
};

exports.ccData = function (req, res) {
	ccDataSection.process(req, res);
};
exports.ccDataEdit = function (req, res) {
	ccDataEditSection.process(req, res);
};
exports.ccDataDelete = function (req, res) {
	ccDataDeleteSection.process(req, res);
};

exports.shoppingData = function (req, res) {
	shoppingDataSection.process(req, res);
};
exports.shoppingDataEdit = function (req, res) {
	shoppingDataEditSection.process(req, res);
};
exports.shoppingDataDelete = function (req, res) {
	shoppingDataDeleteSection.process(req, res);
};
exports.todoDataDelete = function (req, res) {
	todoDataDeleteSection.process(req, res);
};

exports.rentDataDelete = function (req, res) {
	rentDataDeleteSection.process(req, res);
};