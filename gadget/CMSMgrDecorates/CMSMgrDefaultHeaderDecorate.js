/**
* @namespace
* @name CMSMgrDefaultHeaderDecorate 
* @description   
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
                if (window.customized && window.customized[data.metadata.alias] && window.customized[data.metadata.alias].listButton) {
                    _listBtnData = FW.use().evalJSON(window.customized[data.metadata.alias].listButton);
                }
                var result = {
                    titleData: _titileData,
                    btnData: _listBtnData
                };
                return result;
            }
        }
    });
    return FW;
});