/**
* @namespace
* @name CMSMgrDefaultSingleControl 
* @version 1.01 FrankCheng 默认详情控制器初始版本
* @description  默认详情控制器                                                                
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrControl/CMSMgrControl");
    FW.register({
        "name": "CMSMgrDefaultSingleControl",
        "extends": ["CMSMgrControl"],
        /**
        *@function
        *@memberOf CMSMgrDefaultSingleControl
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            this.showContent("appMainView");
        },
        "public": {
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name public$handleDataBefore
            *@description
            *@param data 数据
            *@param metadata 描述
            */
            "handleDataBefore": function(data, metadata) {
                var _data = this.API.father("handleDataBefore", data, metadata);
                return _data && _data[0];
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name private$getDecorates
            *@description 所有getDecorates数据
            */
            "getDecorates": function() {
                return [{
                    gadgetName: "CMSMgrDefaultNodeDecorate",
                    view: "CMSMgrDefaultNodeResourceView",
                    dataId: "CMSMgrDefaultNodeDecorate",
                    instance: "CMSMgrDefaultNodeDecorate",
                    children: [{
                        gadgetName: "CMSMgrDefaultTagDecorate",
                        view: "CMSMgrDefaultTagResourceView",
                        dataId: "CMSMgrDefaultTagDecorate",
                        instance: "CMSMgrDefaultTagDecorate",
                        children: [{
                            gadgetName: "CMSMgrDefaultSingleViewDecorate",
                            view: "CMSMgrDefaultSingleViewResourceView",
                            dataId: "CMSMgrDefaultSingleViewDecorate",
                            instance: "CMSMgrDefaultSingleViewDecorate"
                        }]
                    }]
                }];
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name private$checkData
            *@description 数据校验
            *@param data 页面数据
            */
            "checkData": function(data) {
                //toDo
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name private$metadataSet
            *@description
            *@return toDo
            *@example toDO
            */
            "metadataSet": function() {
                var _this = this;
                var metadata = this.MY._metadata;
                outer: for (var i in metadata) {
                    if (metadata[i].ourterLink) {
                        FW.use().save("singleMetadata", metadata);
                        FW.use().save("singleParam", _this.param);
                        FW.use().save("singleDataMetadata", _this.MY.metadata);
                        break outer;
                    }
                }
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name private$afterShow
            *@description 显示结束后处理
            *@param data 显示数据信息
            */
            "afterShow": function(data) {
                //处理数据
                this.API.private("metadataSet");
                var singleApp = FW.getApp("CMSMgrDefaultSingleViewDecorate");
                singleApp.assetsInit();
                singleApp.xheditorInit();
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name private$processorShowData
            *@description 处理显示数据
            */
            "processorShowData": function() {
                //定义所有数据
                var allData = null;
                //设定请求查询的参数
                //--single时使用
                var param = {};
                if (this.param.queryParam && this.param.queryParam.cid) {
                    param.cid = this.param.queryParam.cid;
                }
                if (this.param.parentAlias && this.param.parentAlias == this.param.alias && this.param.queryParam && this.param.queryParam.nodeid) {
                    param.cid = this.param.queryParam.nodeid;
                    if (this.param.mid) {
                        delete param.cid;
                    }
                }
                //请求当前alias数据
                var _queryData = this.queryData(this.param.alias, param);
                var _metadata = this.handleMetaDataBefore(_queryData.data);
                var _data = this.handleDataBefore(_queryData.data, _metadata);

                allData = {
                    alias: this.param.alias,
                    data: _data,
                    orgData: _queryData,
                    metadata: _metadata
                };
                //本gadget数据
                //--头部描述区显示数据
                var _titileData = _queryData.data.cmsmetadata.displayName;
                var _listBtnData = FW.use().evalJSON(window.systemCtx.listButton);
                if (window.customized && window.customized[_metadata.alias] && window.customized[_metadata.alias].listButton) {
                    _listBtnData = FW.use().evalJSON(window.customized[_metadata.alias].listButton);
                }

                allData.titleData = _titileData;
                allData.btnData = _listBtnData;
                return allData;
            }
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name TrigerEvent$selectAdd
            *@description
            */
            "selectAdd": function(dom) {
                if ($(dom).parent().prev().find(">tbody>tr.list-none").length) {
                    $(dom).parent().prev().find(">tbody>tr.list-none").remove();
                    var idx = 0;
                } else {
                    //找到最后一行name[idx]
                    var Col = $(dom).parent().prev().find(">tbody>tr");
                    var lastCol = Col.eq(Col.length - 2);
                    var arr = lastCol.html().match(/(data-list-value=["']?)(data.*?)(["']?[\s>])/)[2].split("[");
                    var idx = parseInt(arr[arr.length - 1].split("]")[0]) + 1;
                }
                //克隆空白行
                var lcwnone = $(dom).parent().parent().find("table>tbody>tr.list-tr-hidden");
                var cloneCol = lcwnone.clone(true).removeClass("list-tr-hidden");
                cloneCol.insertBefore(lcwnone);
                cloneCol.html(cloneCol.html().replace(/\[99\]/g, "[" + idx + "]")).show();
                this.API.private("assetsInit");
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name TrigerEvent$selectAll
            *@description
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
            *@memberOf CMSMgrDefaultSingleControl
            *@name TrigerEvent$selectChange
            *@description
            */
            "selectChange": function(dom) {
                $(dom).parent().prev().find(">tbody>tr").not(".list-tr-hidden").each(function() {
                    var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
                    cbox.click();
                });
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleControl
            *@name TrigerEvent$selectDelete
            *@description
            */
            "selectDelete": function(dom) {
                $(dom).parent().prev().find(">tbody>tr").each(function() {
                    var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
                    if (cbox.is(':checked')) {
                        $(this).remove();
                    }
                });
                if ($(dom).parent().prev().find(">tbody>tr").length == 1) {
                    var _vname = $(dom).parent().prev().find(">tbody>tr").find("input[name]:eq(0)").attr("name");
                    _vname = _vname.split("[99]")[0];
                    $(dom).parent().prev().find(">tbody>tr").before("<tr class='list-none'><td colspan='100' style='padding:40px; font-size:16px; color:orange; text-align:center;'>暂无数据<input type='hidden' name='" + _vname + "' /></td></tr>");
                }
            }
        }
    });
    return FW;
});