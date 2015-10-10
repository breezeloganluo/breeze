/**
* @namespace
* @name List_Decorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./TypeDecorate");
    FW.register({
        "name": "List_Decorate",
        "extends": ["TypeDecorate"],
        /**
        *@function
        *@memberOf List_Decorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf List_Decorate
            *@name public$getTypeDecorateEditData
            *@description
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                if (!metadata) {
                    alert("List_Decorate描述数据不可以为空！");
                    return;
                }
                var title = metadata.title;
                metadata = metadata.valueRange[0];

                var _data = {
                    title: title,
                    metadata: metadata,
                    data: data,
                    appId: this.id
                };
                return this.API.show("List_Decorate", _data, "_");
            },
            /**
            *@function
            *@memberOf List_Decorate
            *@name public$getTypeDecorateData
            *@description
            */
            "getTypeDecorateData": function() {
                var query = "div[data-value='" + this.id + "']";
                var data = {};
                eval(this.id + "=" + this.id + "||[];");
                $(query).find("td[data-list-value^='" + this.id + "']").each(function() {
                    if ($(this).parent().hasClass("list-tr-hidden")) return;

                    var _value = $(this).attr("data-list-value");
                    var _type = $(this).attr("data-list-type");
                    var _key = $(this).attr("data-list-key");
                    var ___value = _value.replace("." + _key, "");
                    eval(___value + "=" + ___value + "||{}");
                    if (_type == "Text" || _type == "Hidden" || _type == "ReadOnly") {
                        var __value = $(this).children().val();
                        eval(_value + "='" + __value + "'");
                    } else if (_type == "Select") {
                        var __value = $(this).children().find("option:selected").val();
                        eval(_value + "='" + __value + "'");
                    } else if (_type == "TextArea") {
                        var __value = $(this).children().val();
                        try {
                            if (__value == "Text" || __value == "File") {
                                eval(_value + "='" + __value + "';");
                            } else {
                                eval(_value + "=FW.use().toJSONString(" + __value + ")");
                            }
                        } catch(e) {
                            try {
                                eval(_value + "='" + __value + "';");
                            } catch(e) {
                                eval(_value + "=__value;");
                            }

                        }
                    } else if (_type == "DatePicker") {
                        var __value = FW.use("DateTime").format4($(this).children()[0].value, "yyyy-MM-dd").getTime();
                        eval(_value + "='" + __value + "';");
                    } else if (_type == "TimePicker") {
                        var __value = FW.use("DateTime").format4($(this).children().find(".timepicker-24").val(), "hh:mm:ss").getTime();
                        eval(_value + "='" + __value + "';");
                    } else if (_type == "Select") {
                        var __value = $(this).children().find("option:selected").val();
                        eval(_value + "='" + __value + "';");
                    }
                });
                return eval(this.id);
            },
            /**
            *@function
            *@memberOf List_Decorate
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