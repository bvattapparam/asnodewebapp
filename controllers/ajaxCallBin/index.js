'use strict';

var AsnaMiddleWare = require("../asna-middleware/index");


module.exports = function (server) {

    	// AJAX call node
	server.post("/travelData", AsnaMiddleWare.travelData);
	server.post("/travelDataEdit", AsnaMiddleWare.travelDataEdit); 
};