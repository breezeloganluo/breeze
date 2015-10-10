/**
* @namespace
* @name CMSMgrDefaultMaskControl 
* @description   
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrControl/CMSMgrControl");
    FW.register({
        "name": "CMSMgrDefaultMaskControl",
        "extends": ["CMSMgrControl"],
        /**
        *@function
        *@memberOf CMSMgrDefaultMaskControl
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {
            this.showContent("appMainView", "appMainView");
        },
        "public": {
            /**
            *@function
            *@memberOf CMSMgrDefaultMaskControl
            *@name public$showDecorates
            *@description
            */
            "showDecorates": function() {
                var decorates = this.API.private("getDecorates");

                var allData = {};
                //列表显示区数据
                var _start = this.param.start || 0;
                var _lengh = this.param.length || 10;
                var _method = this.param.method || null;
                var _queryObj = this.param.queryObj || null;
                var _spes = this.param.spes || null;
                var _param = this.param.queryParam || null;
                var _CMSMgrDefaultListViewDecorate = this.queryData(this.param.alias, _param, _start, _lengh, _method, _queryObj, _spes);
                var _CMSMgrDefaultListViewDecorateMetadata = this.handleMetaDataBefore(_CMSMgrDefaultListViewDecorate.data);
                var _CMSMgrDefaultListViewDecorateData = this.handleDataBefore(_CMSMgrDefaultListViewDecorate.data, _CMSMgrDefaultListViewDecorateMetadata);
                allData.CMSMgrDefaultListViewDecorate = {
                    data: _CMSMgrDefaultListViewDecorateData,
                    metadata: _CMSMgrDefaultListViewDecorateMetadata
                };
                var _CMSMgrDefaultListPaginationDecorate = this.queryDataCount(this.param.alias, this.param.queryParam);
                var _CMSMgrDefaultListPaginationDecorateMetadata = this.handleMetaDataBefore(_CMSMgrDefaultListPaginationDecorate.data);
                var _CMSMgrDefaultListPaginationDecorateData = this.handleDataBefore(_CMSMgrDefaultListPaginationDecorate.data, _CMSMgrDefaultListPaginationDecorateMetadata);
                allData.CMSMgrDefaultListPaginationDecorate = {
                    data: _CMSMgrDefaultListPaginationDecorateData
                };

                if ($("#appMainView_appSelector").length == 0) {
                    $("body").append("<div id='appMainView_CMSMgrControl'></div>");
                }
                if ($("#mask-modal").length == 0) {
                    $("body").append("<div id='mask-modal' class='modal-backdrop  in'></div>");
                }

                this.createDecorateApps(decorates);
                var appData = FW.getApp("CMSMgrDefaultListView").getDisplayData(allData);
                this.API.show("appMainView", appData, 'appMainView');
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultMaskControl
            *@name public$showContent
            *@description 重写showContent方法
            *@param viewId 视图id
            *@param target 位置
            */
            "showContent": function(viewId, target) {
                //获取decorate
                var decorates = this.API.private("getDecorates");
                //整理显示数据
                var allData = this.API.private('processorShowData');
                //创建所有decorate
                this.createDecorateApps(decorates, allData);
                //显示前调整数据
                this.API.private('beforeShow', allData);
                //显示内容
                if ($("#appMainView_appSelector").length == 0) {
                    $("body").append("<div id='appMainView_CMSMgrControl'></div>");
                }
                if ($("#mask-modal").length == 0) {
                    $("body").append("<div id='mask-modal' class='modal-backdrop  in'></div>");
                }
                this.API.show(viewId, allData, target);
                //显示后调整
                this.API.private('afterShow', allData);
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultMaskControl
            *@name private$pagination
            *@description
            */
            "pagination": function(start, count) {
                if (!start) {
                    start = 0;
                }
                var pageCount = Math.ceil(count / 10);
                var nowPage = start % 10;
                if (nowPage == 0) {
                    nowPage = start / 10;
                } else {
                    nowPage = Math.floor(start / 10);
                }
                return {
                    "pageCount": pageCount,
                    "nowPage": nowPage
                };
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultMaskControl
            *@name private$getDecorates
            *@description 获取所有decorate数据
            */
            "getDecorates": function() {
                return [{
                    gadgetName: "CMSMgrDefaultListViewDecorate",
                    view: "CMSMgrDefaultMaskListViewResourceView",
                    instance: "CMSMgrDefaultListViewDecorate",
                    children: [{
                        gadgetName: "CMSMgrDefaultListPaginationDecorate",
                        view: "CMSMgrDefaultListPaginationResourceView",
                        instance: "CMSMgrDefaultListPaginationDecorate"
                    }]
                }];
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultMaskControl
            *@name private$processorShowData
            *@description 处理显示数据
            */
            "processorShowData": function() {
                //定义所有数据
                var allData = null;
                //请求当前alias数据
                var _queryData = this.queryData();
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
            *@memberOf CMSMgrDefaultMaskControl
            *@name TrigerEvent$closeMask
            *@description
            */
            "closeMask": function() {
                $("#mask-modal").remove();
                $("#appMainView_CMSMgrControl").remove();
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultMaskControl
            *@name TrigerEvent$maskChooseData
            *@description
            */
            "maskChooseData": function() {
                var alias = this.param.alias;
                //获取数据
                var data = {};
                $("input[type='radio']:checked").parent().parent().find("td[key]").each(function() {
                    var key = $(this).attr("key");
                    var value = $(this).text().trim();
                    eval("data." + key + "='" + value + "'||'';");

                });
                //关闭模型
                $("#mask-modal").remove();
                $("#appMainView_CMSMgrControl").remove();
                //设置数据
                for (var i in data) {
                    $("div[outer-data^='" + alias + "." + i + "']").find("input").val(data[i]).attr("value", data[i]);
                }
            }
        }
    });
    return FW;
});