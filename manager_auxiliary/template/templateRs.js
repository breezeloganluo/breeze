define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	var resource = {
		"gadgetName": {
			"resourceName": require("dpldir.tpl")
		}
	}
	FW.regResource(resource);
	return FW;
});