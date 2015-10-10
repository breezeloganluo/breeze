/**
* @namespace
* @name Select_Decorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./TypeDecorate");
    FW.register({
        "name": "Select_Decorate",
        "extends": ["TypeDecorate"],
        /**
        *@function
        *@memberOf Select_Decorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf Select_Decorate
            *@name public$getTypeDecorateEditData
            *@description
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                if (!metadata) {
                    alert("Select_Decorate描述数据不可以为空！");
                    return;
                }
                var _type = this.gadgetName.replace("_Decorate", "");
                var _data = {
                    metadata: metadata,
                    data: data,
                    appId: this.id
                };
                return this.API.show("Select_Decorate", _data, "_");
            },
            /**
            *@function
            *@memberOf Select_Decorate
            *@name public$getTypeDecorateData
            *@description
            */
            "getTypeDecorateData": function() {
                var query = "div[data-value='" + this.id + "']";
                return $(query).find("option:selected").val();
            },
            /**
            *@function
            *@memberOf Select_Decorate
            *@name public$getTypeDecorateDisplayData
            *@description
            */
            "getTypeDecorateDisplayData": function(data, metadata) {
                if (!metadata) {
                    alert("Select_Decorate描述数据不可以为空！");
                    return;
                }
                var chooseValue = metadata.valueRange;
                var _data = "";
                for (var k = 0; k < chooseValue.length; k++) {
                    for (var l in chooseValue[k]) {
                        if (chooseValue[k][l] == data) {
                            _data = l;
                        }
                    }
                }
                return _data;
            },
            /**
            *@function
            *@memberOf Select_Decorate
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