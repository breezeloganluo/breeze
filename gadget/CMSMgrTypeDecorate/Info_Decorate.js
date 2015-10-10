/**
* @namespace
* @name Info_Decorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./TypeDecorate");
    FW.register({
        "name": "Info_Decorate",
        "extends": ["TypeDecorate"],
        /**
        *@function
        *@memberOf Info_Decorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf Info_Decorate
            *@name public$getTypeDecorateEditData
            *@description
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                if (!metadata) {
                    alert("Info_Decorate描述数据不可以为空！");
                    return;
                }
                var _type = this.gadgetName.replace("_Decorate", "");
                data = data ? FW.use().evalJSON(data) : null;
                var _data = {
                    metadata: metadata,
                    data: data,
                    appId: this.id
                };
                //获取所有gadget对象查看是否有配置信息
                _data.cfgList = [];
                _data.cfgData = {};
                
                this.MY.configObj = {};
                var gadgets = FW.getGadget();
                for (var n in gadgets) {
                    oneGadget = gadgets[n];
                    if (oneGadget["public"] && oneGadget["public"].getCfgInfo) {
                        if (oneGadget["public"].getCfgInfo()) {
                            var appObj = FW.createApp(n, n, this);
                            var cfgObj = appObj.getCfgInfo();
                            appObj.configCtr = this;
                            _data.cfgList.push(cfgObj);
                            this.MY.configObj[cfgObj.sig] = appObj;
                            var settingData = _data.data&&_data.data[cfgObj.sig];
                            _data.cfgData[cfgObj.sig] = settingData?FW.use().toJSONString(settingData):"";
                            appObj.cfgData = settingData;
                        }
                    }
                }
                this.MY.data = _data && _data.data;
                return this.API.show("Info_Decorate", _data, "_");
            },
            /**
            *@function
            *@memberOf Info_Decorate
            *@name FireEvent$closeAddNew
            *@description
            */
            "closeAddNew": function() {
                $("#mask-modal").remove();
                $("[attr-mask='show']").remove();
            },
            /**
            *@function
            *@memberOf Info_Decorate
            *@name public$getTypeDecorateData
            *@description 返回Text值
            */
            "getTypeDecorateData": function() {
                var query = "div[data-value='" + this.id + "']";
                var data = {};
                var has = false;
                $(query).find("[info-id]").each(function() {
                    if ($(this).val()) {
                        has = true;
                        data[$(this).attr("info-id")] = $(this).val();
                    }
                });
                if (has) {
                    return data;
                } else {
                    return "";
                }
            },
            /**
            *@function
            *@memberOf Info_Decorate
            *@name public$typeMask
            *@description
            */
            "typeMask": function(type) {
                var oldId = this.id;
                this.id = type;
                if ($("#" + this.id).length == 0) {
                    $("body").append("<div id='" + this.id + "'></div>");
                }
                if ($("#" + type + "_" + this.id).length == 0) {
                    $("body").append("<div attr-mask='show' id='" + type + "_" + this.id + "'></div>");
                }
                if ($("#mask-modal").length == 0) {
                    $("body").append("<div id='mask-modal' class='modal-backdrop  in'></div>");
                }
				var cfgData = this.MY.configObj[type].cfgData;
                var displayData = this.MY.configObj[type].getDisplayCfg(cfgData);

                this.API.show(displayData, this.MY.data && this.MY.data[type], type);
                this.id = oldId;
            },
            /**
            *@function
            *@memberOf Info_Decorate
            *@name public$saveAddNew
            *@description 调用对应的配置修饰实例，获取页面值，并记录返回
            *@param type toDo
            */
            "saveAddNew": function(type) {
                var cfgApp = this.MY.configObj[type];
                var data = cfgApp.getCfgSetting(".modal-body");

                if (data) {
                    $("[info-id='" + type + "']").val(FW.use().toJSONString(data));
                }
                $("#mask-modal").remove();
                $("[attr-mask='show']").remove();
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf Info_Decorate
            *@name FireEvent$changeInfo
            *@description
            */
            "changeInfo": function(type, dom) {
                $("[aria-disabled]").attr("class", "done").attr("aria-selected", "false");
                $("[info-id]").hide();
                if ($("[info-id='" + type + "']").val() == "" || $("[info-id='" + type + "']").val() == null) {
                    this.typeMask(type);
                } else {
                    $(dom).parent().attr("class", "current active").attr("aria-selected", "true");
                    $("[info-id='" + type + "']").show();
                }
            }
        }
    });
    return FW;
});