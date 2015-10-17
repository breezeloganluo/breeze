/**
* @namespace
* @name CMSMgrDefaultListControl 
* @version 1.01 FrankCheng 基本列表控制器初始版本
* @description  默认列表控制器                                                                                  
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrControl/CMSMgrControl");
    FW.register({
        "name": "CMSMgrDefaultListControl",
        "extends": ["CMSMgrControl"],
        /**
        *@function
        *@memberOf CMSMgrDefaultListControl
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {
            this.showContent("CMSMgrControl");
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListControl
            *@name private$getDecorates
            *@description 所有getDecorates数据
            */
            "getDecorates": function() {
                var result = [{
                    gadgetName: "CMSMgrDefaultHeaderDecorate",
                    view: "CMSMgrDefaultHeaderResourceView",
                    instance: "CMSMgrDefaultHeaderDecorate"
                },{
                    gadgetName: "CMSMgrDefaultNodeDecorate",
                    view: "CMSMgrDefaultNodeResourceView",
                    instance: "CMSMgrDefaultNodeDecorate",
                    children: [{
                        gadgetName: "CMSMgrDefaultTagDecorate",
                        view: "CMSMgrDefaultTagResourceView",
                        instance: "CMSMgrDefaultTagDecorate",
                        children: [{
                            gadgetName: "CMSMgrDefaultListFilterDecorate",
                            view: "CMSMgrDefaultListFilterResourceView",
                            instance: "CMSMgrDefaultListFilterDecorate",
                            children: [{
                                gadgetName: "CMSMgrDefaultListViewDecorate",
                                view: "CMSMgrDefaultListViewResourceView",
                                instance: "CMSMgrDefaultListViewDecorate",
                                children: [{
                                    gadgetName: "CMSMgrDefaultListPaginationDecorate",
                                    view: "CMSMgrDefaultListPaginationResourceView",
                                    instance: "CMSMgrDefaultListPaginationDecorate"
                                }]
                            }]
                        }]
                    }]
                }];
                return result;
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListControl
            *@name private$processorShowData
            *@description 处理列表数据
            */
            "processorShowData": function() {
                //定义所有数据
                var allData = null;
                //请求当前alias数据
                var _queryData = this.queryData();
                //查询结果判断
                if (!_queryData || _queryData.code != 0){
                	if (!_queryData){
                		FW.alert("访问数据失败");                		
                	}
                	else if (_queryData.code == 25){
                		FW.alert("您没有权限进行本操作");
                	}
                	return null;
                }
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
            *@memberOf CMSMgrDefaultListControl
            *@name TrigerEvent$openAdd
            *@description 添加操作
            */
            "openAdd": function() {
                var url = "";
                for (var i in this.param) {
                    if (i == "queryParam") {
                        for (var j in this.param.queryParam) {
                            url += "&" + j + "=" + this.param.queryParam[j];
                        }
                    } else {
                        url += "&" + i + "=" + this.param[i];
                    }
                }
                url += "&type=single";
                FW.page.createControl(url);
            }
        }
    });
    return FW;
});