/**
* @namespace
* @name TypeDecorate 
* @version 0.01 罗光瑜 初始版本
* @description  这是类型Decorate的父类，即模型定义中的类型显示父类，原来全部在CMSMgrDecorate中，还是把它抽出来了 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "TypeDecorate",
        /**
        *@function
        *@memberOf TypeDecorate
        *@name onCreate$onCreate
        */
        "onCreate": function() {
            //toDO
        },
        "public": {
            /**
            *@function
            *@memberOf TypeDecorate
            *@name public$getTypeDecorateData
            *@description 获取type类型decorate数据
            */
            "getTypeDecorateData": function() {
                //toDo
            },
            /**
            *@function
            *@memberOf TypeDecorate
            *@name public$getTypeDecorateDisplayData
            *@description 获取type类型decorate数据显示数据
            */
            "getTypeDecorateDisplayData": function() {
                //toDo
            },
            /**
            *@function
            *@memberOf TypeDecorate
            *@name public$getTypeDecorateEditData
            *@description 获取type类型decorate可编辑HTML返回数据
            *@param metadata 描述数据
            *@param data 显示数据
            *@return 可编辑HTML返回数据
            */
            "getTypeDecorateEditData": function(metadata, data) {
                return null;
            },
            /**
            *@function
            *@memberOf TypeDecorate
            *@name public$createTypeDecorateEditData
            *@description 创建type类型decorate
            *@param appId 实例名
            *@param type type类型
            *@param metadata 描述数据
            *@param data 显示数据
            */
            "createTypeDecorateEditData": function(appId, type, metadata, data) {
                var appName = type + "_Decorate";
                var app = null;
                try {
                    app = FW.createApp(appId, appName, {},
                    appId);
                    return app.getTypeDecorateEditData(metadata, data);
                } catch(e) {
                    return "<div style='display:none'></div>";
                }
            },
            /**
            *@function
            *@memberOf TypeDecorate
            *@name public$createTypeDecorateListData
            *@description
            *@param appId
            *@param type
            *@param metadata
            *@param data
            */
            "createTypeDecorateListData": function(appId, type, metadata, data) {
                var appName = type + "_Decorate";
                var app = null;
                try {
                    app = FW.createApp(appId, appName, {},
                    appId);
                    return app.getTypeDecorateDisplayData(metadata, data);
                } catch(e) {
                    return "<script>$(this).parent().hide();</script>";
                }
            },
            /**
            *@function
            *@memberOf TypeDecorate
            *@name public$getTableHeadDisplayData
            *@description
            *@param type
            *@param title
            */
            "getTableHeadDisplayData": function(type, title) {
                var appName = type + "_Decorate";
                var app = null;
                try {
                    app = FW.createApp(type + "_thead", appName, {},
                    type + "_head");
                    return app.getTableHeadDisplayData(title);
                } catch(e) {
                    return "<th style='display:none'>不支持的显示类型</th>";
                }
            }
        }
    });
    return FW;
});