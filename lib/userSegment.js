"use strict";

var services = require("servicecore"),
	segmentWhiteListName = "HAWK_ELIGIBLE_WHITELIST",
	segmentOptInOutName = "HAWK_OPT_INOUT_ACTION",
	segmentOptInOutValue = 1,
	segmentRead;

module.exports = {
	checkWhiteListing: function (req, res, next) {

		if (!segmentRead) {
			segmentRead = services.create('segmentread');
		}
		if (req.user && req.user.accountNumber) {
			var payload = {
				accountNumber: req.user.accountNumber,
				getDetails: false,
				trackingIdentifier: null,
				publicCredential: null,
				segmentFilter: null
			};
			segmentRead.profile(payload).get_segments(payload, function (error, result) {
				if (!error) {
					if (isWhiteListed(result.body.segments)) {
						next();
					} else {
						res.redirect(req.headers.host);
					}
				}
				else {
					appErrorDisplay.renderErrorPage(error, req, res);
				}
			});
		} else {
			next();
		}
	}
};

function isWhiteListed(segments) {
	var segment,
		isSegmentWhiteListed = false;
	segment = segments.pop();
	while (segment) {
		if ((segment.name === segmentWhiteListName) || (segment.name === segmentOptInOutName && segment.value === segmentOptInOutValue)) {
			isSegmentWhiteListed = true;
			break;
		}
		segment = segments.pop();
	}

	return isSegmentWhiteListed;
}

