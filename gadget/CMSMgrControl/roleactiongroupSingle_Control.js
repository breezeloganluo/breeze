/**
* @namespace
* @name roleactiongroupSingle_Control 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./CMSMgrDefaultSingleControl");
    FW.register({
        "name": "roleactiongroupSingle_Control",
        "extends": ["CMSMgrDefaultSingleControl"],
        
        "public": {
            /**
            *@function
            *@memberOf roleactiongroupSingle_Control
            *@name public$handleMetaDataBefore
            *@description
            *@param __data
            */
            "handleMetaDataBefore": function(__data) {
                var _metadata = this.API.father("handleMetaDataBefore", __data);
                this.MY.metadata.children = null;
                return _metadata;
            }
        }
    },module);
    return FW;
});