/* global requirejs:true */
requirejs.config({
    paths: {
        "jquery":                   "lib/jquery-1.8.0.min",
        "jqueryUI":                 "lib/jquery-ui-1.8.0.min",
        "json":                     (typeof JSON === "undefined") ? "lib/json2" : "empty:",
        "underscore":               "lib/underscore-1.3.3",
        "backbone":                 "lib/backbone-0.9.2",
        "backboneSubroute":         "lib/backbone-subroute-0.3.2",
        "dust":                     "lib/dust-core-2.0.3",
        "nougat":                   "core/nougat",
        "BaseView":                 "core/baseView",
        "dust-helpers" :            "lib/dust-helpers-1.1.1",
        "dust-helpers-supplement" : "lib/dust-helpers-supplement",
        "bootstrap" :               "lib/bootstrap.min",
         "raphael" :               "lib/raphael-min",
          "morris" :               "lib/morris.min",
        "lap"       :               "lib/lap",
        "businessHelper":           "lib/business-helper",
        "popUp":                    "lib/popUp",
        "cookie":                   "lib/jquery.cookie",
        "viewUtil":                 "util/view",
        "dashboard":     "view/dashboard",
        "travel":     "view/travel",
        "login":     "view/login",
        "footer":                   "bower_components/merchant-footer/merchant-footer",
        "header":                   "bower_components/merchant-header/merchant-header",
        "opinionLabComponent":      "bower_components/merchant-opinion-lab/opinionLabComponent",
        "onlineOpinionPopup":       "bower_components/merchant-opinion-lab/onlineOpinionPopup",
        "opinionLab":               "bower_components/merchant-opinion-lab/opinionLab",
        "textField":                'components/textInput/textField',

        //Widgets
        "validation":               'validation',
        "errorDisplay":             'errorDisplay'
    },
    useStrict: true,
    shim: {
        "dust": {
            exports: "dust"
        },
        "dust-helpers": {
            deps: ["dust"]
        },
        "dust-helpers-supplement": {
            deps: ["dust", "dust-helpers"]
        },
        "jqueryUI": {
            deps: ["jquery"]
        },
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "backboneSubroutes": {
            deps: ["backbone"]
        },
        "bootstrap" : {
            deps: ["jquery"]
        },
        "businessHelper" : {
            deps: ["jquery"]
        }
    }
});
