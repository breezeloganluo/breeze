/**
* @namespace
* @name CMSMgrDefaultListPaginationDecorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrDecorate");
    FW.register({
        "name": "CMSMgrDefaultListPaginationDecorate",
        "extends": ["CMSMgrDecorate"],
        /**
        *@function
        *@memberOf CMSMgrDefaultListPaginationDecorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            //toDO
        },
        "public": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListPaginationDecorate
            *@name public$pagination
            *@description 计算分页相关数据
            *@param start 启始位置
            *@param count 查询总数
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
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListPaginationDecorate
            *@name private$processingData
            *@description
            */
            "processingData": function(data) {
                //分页位置数据
                //--父亲的查询要调用父亲的实例
                var _queryCountData = this.control.queryDataCount(data.alias, this.control.param.queryParam);
                var _countMetadata = this.control.handleMetaDataBefore(_queryCountData.data);
                var _countData = this.control.handleDataBefore(_queryCountData.data, _countMetadata);
                var CMSMgrDefaultListPaginationDecorate = {
                    data: _countData
                };
                //--数据怎么整合
                var param = FW.getApp("CMSMgrControl").param;
                var start = param && param.start;
                var count = CMSMgrDefaultListPaginationDecorate.data[0].count;
                return this.pagination(start, count);
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListPaginationDecorate
            *@name FireEvent$go2page
            *@description 分页的相应事件
            *@param page 页码(0为第一页)
            */
            "go2page": function(page) {
                var url = "type=list";
                for (var i in this.control.param) {
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                            url += "&" + j + "=" + this.control.param.queryParam[j];
                        }
                    } else {
                        url += "&" + i + "=" + this.control.param[i];
                    }
                }
                url += "&start=" + page * 10;
                FW.page.createControl(url);
            }
        }
    });
    return FW;
});