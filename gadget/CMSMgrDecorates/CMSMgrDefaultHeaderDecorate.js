/**
* @namespace
* @name CMSMgrDefaultHeaderDecorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrDecorate");
    FW.register({
        "name": "CMSMgrDefaultHeaderDecorate",
        "extends": ["CMSMgrDecorate"],
        /**
        *@function
        *@memberOf CMSMgrDefaultHeaderDecorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            //toDO
        },
        "public": {
            /**
            *@function
            *@memberOf CMSMgrDefaultHeaderDecorate
            *@name public$getCfgInfo
            *@description 获取系统配置的信息
            */
            "getCfgInfo": function() {
                //返回对应的名称
                return {
                    name: "头部按钮",
                    sig: "listButton"
                }
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultHeaderDecorate
            *@name private$processingData
            *@description processingData
            *@param data 输入数据
            */
            "processingData": function(data) {
                //头部描述区显示数据
                var _titileData = data.orgData.data.cmsmetadata.displayName;
                var _listBtnData = FW.use().evalJSON(window.systemCtx.listButton);
                if (window.customized && window.customized[data.alias] && window.customized[data.alias].listButton) {
                    _listBtnData = FW.use().evalJSON(window.customized[data.alias].listButton);
                }
                var result = {
                    titleData: _titileData,
                    btnData: _listBtnData
                };
                for(var i=result.btnData.length; i--; ){
                    if(result.btnData[i].type == "menu"){
                        delete result.btnData[i].type;
                    }
                }
                return result;
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultHeaderDecorate
            *@name private$openAdd
            *@description 打开添加页面
            *@param
            */
            "openAdd": function(type) {
                var url = "";
                for (var i in this.control.param) {
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                        	if(typeof this.control.param.queryParam[j] == "object"){
                        		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
                        	}else{
                        		url += "&" + j + "=" + this.control.param.queryParam[j];
                        	}
                        }
                    } else if (i == "type") {
                        continue;
                    } else {
                        url += "&" + i + "=" + this.control.param[i];
                    }
                }
                url += "&type=single";
                if(type){
                    url += "&type=" + type;
                }
                FW.page.createControl(url);
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultHeaderDecorate
            *@name private$exportExcel
            *@description 导出excel
            *@param
            */
            "exportExcel": function() {
                var url = "";
                for (var i in this.control.param) {
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                        	if(typeof this.control.param.queryParam[j] == "object"){
                        		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
                        	}else{
                        		url += "&" + j + "=" + this.control.param.queryParam[j];
                        	}
                        }
                    } else if (i == "type") {
                        continue;
                    } 
                    else {
                        url += "&" + i + "=" + this.control.param[i];
                    }
                }
                //url += "&type=exportExcel";
                //FW.page.createControl(url);
                url = "?" + url.substring(1);
                window.open(Cfg.baseUrl + "/page/manager/CMSMgrExportExcel.jsp" + url,"_blank");
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultHeaderDecorate
            *@name private$openDebug
            *@description 打开调试页面
            *@param
            */
            "openDebug": function() {
                var url = "";
                for (var i in this.control.param) {
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                        	if(typeof this.control.param.queryParam[j] == "object"){
                        		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
                        	}else{
                        		url += "&" + j + "=" + this.control.param.queryParam[j];
                        	}
                        }
                    } else if (i == "type") {
                        continue;
                    } else {
                        url += "&" + i + "=" + this.control.param[i];
                    }
                }
                url += "&type=debugpage";
                FW.page.createControl(url);
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultHeaderDecorate
            *@name FireEvent$clickEvn
            *@description 触发点击事件，首先检查本函数是否有对应的方法，如果没有转向control去调用。
            *@param eventType 事件名称
            */
            "clickEvn": function(eventType, type) {
                //if (公有方法存在){先调用自己的公有方法
                if (this[eventType]) {
                    if(type && type != "undefined"){
                        this[eventType](type);
                    }else{
                        this[eventType]();
                    }
                    return;
                }
                //}
                //if (私有方法存在){
                if (this["private"][eventType]) {
                    if(type && type != "undefined"){
                        this.API.private(eventType,type);
                    }else{
                        this.API.private(eventType);
                    }
                    return;
                }
                //}
                //if (公有方法中存在){
                if (this.control[eventType]) {
                    if(type && type != "undefined"){
                        this.control[eventType](type);
                    }else{
                        this.control[eventType]();
                    }
                    return;
                }
                //}
            }
        }
    },
    module);
    return FW;
});