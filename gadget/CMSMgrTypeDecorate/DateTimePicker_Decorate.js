/**
* @namespace
* @name DateTimePicker_Decorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./TypeDecorate");
    FW.register({
        "name": "DateTimePicker_Decorate",
        "extends": ["TypeDecorate"],
        /**
        *@function
        *@memberOf DateTimePicker_Decorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf DateTimePicker_Decorate
            *@name public$getTypeDecorateEditData
            *@description
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                if (!metadata) {
                    alert("DateTimePicker_Decorate描述数据不可以为空！");
                    return;
                }
                var _type = this.gadgetName.replace("_Decorate", "");
                data = data ? FW.use("DateTime").formatTimeStamp(data, "yyyy-MM-dd hh:mm:ss") : null;
                var _data = {
                    metadata: metadata,
                    data: data,
                    appId: this.id
                };
                return this.API.show("DateTimePicker_Decorate", _data, "_");
            },
            /**
            *@function
            *@memberOf DateTimePicker_Decorate
            *@name public$getTypeDecorateData
            *@description
            */
            "getTypeDecorateData": function() {
                var query = "div[data-value='" + this.id + "']";
                return "" + FW.use("DateTime").format4($(query).find(".datetimepicker").val(), 'yyyy-MM-dd hh:mm:ss').getTime();
            },
            /**
            *@function
            *@memberOf DateTimePicker_Decorate
            *@name public$getTypeDecorateDisplayData
            *@description
            */
            "getTypeDecorateDisplayData": function(data, metadata) {
                if (!metadata) {
                    alert("DateTimePicker_Decorate描述数据不可以为空！");
                    return;
                }
                var _data = data ? FW.use("DateTime").formatTimeStamp(data, "yyyy-MM-dd hh:mm:ss") : "";
                return _data;
            },
            /**
            *@function
            *@memberOf DateTimePicker_Decorate
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