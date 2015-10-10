/**
* @namespace
* @name TextArea_Decorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./TypeDecorate");
    FW.register({
        "name": "TextArea_Decorate",
        "extends": ["TypeDecorate"],
        /**
        *@function
        *@memberOf TextArea_Decorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf TextArea_Decorate
            *@name public$getTypeDecorateEditData
            *@description
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                if (!metadata) {
                    alert("TextArea_Decorate描述数据不可以为空！");
                    return;
                }
                var _type = this.gadgetName.replace("_Decorate", "");
                var _data = {
                    metadata: metadata,
                    data: data,
                    appId: this.id
                };
                return this.API.show("TextArea_Decorate", _data, "_");
            },
            /**
            *@function
            *@memberOf TextArea_Decorate
            *@name public$getTypeDecorateData
            *@description
            */
            "getTypeDecorateData": function() {
                var query = "div[data-value='" + this.id + "']>textarea";
                return $(query).val();
            },
            /**
            *@function
            *@memberOf TextArea_Decorate
            *@name public$getTableHeadDisplayData
            *@description
            *@param title
            */
            "getTableHeadDisplayData": function(title) {
                return "";
            }
        }
    });
    return FW;
});