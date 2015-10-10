/**
* @namespace
* @name Text_Decorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./TypeDecorate");
    FW.register({
        "name": "Text_Decorate",
        "extends": ["TypeDecorate"],
        /**
        *@function
        *@memberOf Text_Decorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf Text_Decorate
            *@name public$getTypeDecorateEditData
            *@description
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                if (!metadata) {
                    alert("Text_Decorate描述数据不可以为空！");
                    return;
                }
                var _type = this.gadgetName.replace("_Decorate", "");
                var _data = {
                    metadata: metadata,
                    data: data,
                    appId: this.id
                };
                return this.API.show("Text_Decorate", _data, "_");
            },
            /**
            *@function
            *@memberOf Text_Decorate
            *@name public$getTypeDecorateData
            *@description 返回Text值
            */
            "getTypeDecorateData": function() {
                var query = "div[data-value='" + this.id + "']>input";
                return $(query).val();
            },
            /**
            *@function
            *@memberOf Text_Decorate
            *@name public$getTypeDecorateDisplayData
            *@description
            */
            "getTypeDecorateDisplayData": function(data, metadata) {
                if (!metadata) {
                    alert("Text_Decorate描述数据不可以为空！");
                    return;
                }
                return data || "";
            },
            /**
            *@function
            *@memberOf Text_Decorate
            *@name public$getTableHeadDisplayData
            *@description
            *@param title
            */
            "getTableHeadDisplayData": function(title) {
                return "<th>" + title + "</th>";
            }
        }
    });
    return FW;
});