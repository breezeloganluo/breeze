/**
* @namespace
* @name CMSMgrDefaultListFilterDecorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrDecorate");
    FW.register({
        "name": "CMSMgrDefaultListFilterDecorate",
        "extends": ["CMSMgrDecorate"],
        /**
        *@function
        *@memberOf CMSMgrDefaultListFilterDecorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            //toDO
        },
        "public": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListFilterDecorate
            *@name public$getCfgInfo
            *@description 获取系统配置的信息
            */
            "getCfgInfo": function() {
                //返回对应的名称
                return {
                    name: "筛选器",
                    sig: "filterSet"
                }
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListFilterDecorate
            *@name public$getCfgSetting
            *@description 调用父类方法，真实key值部分，转换成对象
            *@param domSelector 进行判断的jqueryselector
            *@return 返回设置的对象
            */
            "getCfgSetting": function(domSelector) {
                var resultObj = this.API.father("getCfgSetting", domSelector);
                if (resultObj != null && resultObj != "") {
                    for (var i = 0; resultObj.length && i < resultObj.length; i++) {
                        if (resultObj[i].filterValue) {
                            resultObj[i].filterValue = eval("(" + resultObj[i].filterValue + ")");
                        }
                    }
                }
                return resultObj;
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListFilterDecorate
            *@name private$processingData
            *@description
            *@param data data
            */
            "processingData": function(data) {
                var CMSMgrDefaultListFilterDecorate = null;
                //筛选位置数据
                if (data.orgData.data.cmsmetadata.dataMemo && data.orgData.data.cmsmetadata.dataMemo.aliasCfg && data.orgData.data.cmsmetadata.dataMemo.aliasCfg.filterSet) {
                    CMSMgrDefaultListFilterDecorate = {
                        data: FW.use().evalJSON(data.orgData.data.cmsmetadata.dataMemo.aliasCfg.filterSet),
                        selectData: FW.getApp("CMSMgrControl").param.queryParam
                    };
                }
                //进一步处理
                var _data = {};
                _data.filterData = CMSMgrDefaultListFilterDecorate && CMSMgrDefaultListFilterDecorate.data;
                _data.selectData = CMSMgrDefaultListFilterDecorate && CMSMgrDefaultListFilterDecorate.selectData;
                return CMSMgrDefaultListFilterDecorate && CMSMgrDefaultListFilterDecorate.data ? _data: null;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListFilterDecorate
            *@name FireEvent$selectAll
            *@description 弹出的蒙板层进行全选，该方法给模型设计时使用
            *@param dom 事件的dom节点
            */
            "selectAll": function(dom) {
                $(dom).parent().prev().find(">tbody>tr").not(".list-tr-hidden").each(function() {
                    var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
                    if (!cbox.is(':checked')) {
                        cbox.click();
                    }
                });
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListFilterDecorate
            *@name FireEvent$selectAdd
            *@description 弹出的蒙板层，新添加一行，该方法给模型设计时使用
            *@param dom 当前的dom节点
            */
            "selectAdd": function(dom) {
                //克隆空白行
                var lcwnone = $(dom).parent().parent().find("table>tbody>tr.list-tr-hidden");
                var cloneCol = lcwnone.clone(true).removeClass("list-tr-hidden");
                cloneCol.insertBefore(lcwnone);
                cloneCol.html(cloneCol.html()).show();
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListFilterDecorate
            *@name FireEvent$selectChange
            *@description 弹出蒙板层的反选按钮
            *@param dom 事件的dom节点
            */
            "selectChange": function(dom) {
                $(dom).parent().prev().find(">tbody>tr").not(".list-tr-hidden").each(function() {
                    var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
                    cbox.click();
                });
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListFilterDecorate
            *@name FireEvent$selectDelete
            *@description 弹出层的删除功能，该功能在模型设计时使用
            *@param dom 点击事件的dom节点
            */
            "selectDelete": function(dom) {
                $(dom).parent().prev().find(">tbody>tr").each(function() {
                    var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
                    if (cbox.is(':checked')) {
                        $(this).remove();
                    }
                });
                if ($(dom).parent().prev().find(">tbody>tr").length == 1) {
                    var lcwnone = $(dom).parent().parent().find("table>tbody>tr.list-tr-hidden");
                    var cloneCol = lcwnone.clone(true).removeClass("list-tr-hidden");
                    cloneCol.insertBefore(lcwnone);
                    cloneCol.html(cloneCol.html()).show();
                }
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListFilterDecorate
            *@name FireEvent$chooseFilter
            *@description 在实际filter页面中选中后触发的事件
            *@param key 关键字
            *@param value 值
            *@param type 类型
            *@return 无
            */
            "chooseFilter": function(key, value, type) {
                var url = "";
                var c = true;
                for (var i in this.control.param.queryParam) {
                    if (i == key && this.control.param.queryParam[i] == value) {
                        c = false;
                        continue;
                    } else {
                        url += "&" + i + "=" + this.control.param.queryParam[i];
                    }
                }
                if (c) {
                    url += "&" + key + "=" + value;
                }

                for (var i in this.control.param) {
                    if (i == "queryParam" || i == "start" || i == "length") {
                        continue;
                    }
                    url += "&" + i + "=" + this.control.param[i];
                }
                FW.page.createControl(url);
            }
        }
    });
    return FW;
});