'use strict';

var AsnaMiddleWare = require("../asna-middleware/index");


module.exports = function (server) {

    	// AJAX call node
	server.post("/travelData", AsnaMiddleWare.travelData);
	server.post("/travelDataEdit", AsnaMiddleWare.travelDataEdit); 

	server.post("/ccData", AsnaMiddleWare.ccData); 
	server.post("/ccDataEdit", AsnaMiddleWare.ccDataEdit); 

	server.post("/shoppingData", AsnaMiddleWare.shoppingData); 
	server.post("/shoppingDataEdit", AsnaMiddleWare.shoppingDataEdit); 

	// PARAM call node
	server.get("/travelDataDelete/:id", AsnaMiddleWare.travelDataDelete); 
	server.get("/ccDataDelete/:id", AsnaMiddleWare.ccDataDelete); 
	server.get("/shoppingDataDelete/:id", AsnaMiddleWare.shoppingDataDelete); 
	server.get("/todoDataDelete/:id", AsnaMiddleWare.todoDataDelete); 
	server.get("/rentDataDelete/:id", AsnaMiddleWare.rentDataDelete); 
};