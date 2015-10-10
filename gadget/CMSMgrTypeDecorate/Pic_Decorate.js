/**
* @namespace
* @name Pic_Decorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./TypeDecorate");
    FW.register({
        "name": "Pic_Decorate",
        "extends": ["TypeDecorate"],
        /**
        *@function
        *@memberOf Pic_Decorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf Pic_Decorate
            *@name public$getTypeDecorateEditData
            *@description
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                if (!metadata) {
                    alert("Pic_Decorate描述数据不可以为空！");
                    return;
                }
                var _type = this.gadgetName.replace("_Decorate", "");
                var _data = {
                    metadata: metadata,
                    data: data,
                    appId: this.id
                };
                return this.API.show("Pic_Decorate", _data, "_");
            },
            /**
            *@function
            *@memberOf Pic_Decorate
            *@name public$getTypeDecorateData
            *@description
            */
            "getTypeDecorateData": function() {
                var query = "div[data-value='" + this.id + "']>div>input[name='fId_hidden']";
                return $(query).val();
            },
            /**
            *@function
            *@memberOf Pic_Decorate
            *@name public$getTypeDecorateDisplayData
            *@description
            */
            "getTypeDecorateDisplayData": function(data, metadata) {
                if (!metadata) {
                    alert("Pic_Decorate描述数据不可以为空！");
                    return;
                }
                if(typeof data != "undefined" && data != "undefined" && data != ""){
                    return "<img style='max-height:90px;max-width:90px;' src='" + Cfg.baseUrl + "/" + data + "'></src>";
                }else{
                    return "";
                }
            },
            /**
            *@function
            *@memberOf Pic_Decorate
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