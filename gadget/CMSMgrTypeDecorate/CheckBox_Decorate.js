/**
* @namespace
* @name CheckBox_Decorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./TypeDecorate");
    FW.register({
        "name": "CheckBox_Decorate",
        "extends": ["TypeDecorate"],
        /**
        *@function
        *@memberOf CheckBox_Decorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf CheckBox_Decorate
            *@name public$getTypeDecorateEditData
            *@description
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                if (!metadata) {
                    alert("CheckBox_Decorate描述数据不可以为空！");
                    return;
                }
                var _type = this.gadgetName.replace("_Decorate", "");
                var _data = {
                    metadata: metadata,
                    data: data,
                    appId: this.id
                };
                return this.API.show("CheckBox_Decorate", _data, "_");
            },
            /**
            *@function
            *@memberOf CheckBox_Decorate
            *@name public$getTypeDecorateData
            *@description
            */
            "getTypeDecorateData": function() {
                var checked = [];
                var query = "div[data-value='" + this.id + "']";
                $(query).find(":checked").each(function() {
                    var _value = "";
                    try {
                        _value = eval("(" + $(this).val() + ")");
                    } catch(e) {
                        _value = $(this).val();
                    }
                    checked.push(_value);
                });
                if (checked.length == 0) {
                    return null;
                }
                return checked;
            },
            /**
            *@function
            *@memberOf CheckBox_Decorate
            *@name public$getTableHeadDisplayData
            *@description
            */
            "getTableHeadDisplayData": function(title) {
                return "";
            }
        }
    });
    return FW;
});