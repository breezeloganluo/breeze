/**
* @namespace
* @name roles_Control 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./CMSMgrDefaultListControl");
    FW.register({
        "name": "roles_Control",
        "extends": ["CMSMgrDefaultListControl"],
        "param": {
            /**
            *@memberOf roles_Control
            *@name alias
            *@description comments
            */
            "alias": "roles"
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf roles_Control
            *@name TrigerEvent$openGroup
            *@description
            *@param param
            *@param cid
            */
            "openGroup": function(param, cid) {
                var url = "";
                for (var i in this.param) {
                    if (i == "queryParam") {
                        for (var j in this.param.queryParam) {
                        	if(typeof this.param.queryParam[i] == "object"){
                        		url += "&" + j + "=[" + this.param.queryParam[j].join(",") + "]";
                        	}else{
                        		url += "&" + j + "=" + this.param.queryParam[j];
                        	}
                        }
                    } else {
                        if (i == "alias") {
                            continue;
                        }
                        for (var i in this.param) {
                            url += "&" + i + "=" + this.param[i];
                        }
                    }
                }
                url += "&nodeid=" + cid;
                url += "&type=roleactiongroup";
                FW.page.createControl(url);
            }
        }
    },module);
    return FW;
});