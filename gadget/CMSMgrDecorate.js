/**
* @namespace
* @name CMSMgrDecorate 
* @description  decorate api接口提供一些基本的decorate方法。
*一个decorate就是一个组件，包含了组件本身的基本数据处理的相关内容
*另外，组件本身也支持，设定到数据模型中进行设定和定义。
*相关的方法：getCfgInfo这个是入口方法，如果返回为null则表示不用数据模型设置
*getDisplayCfg获取用于模型设置时的显示页面表单
*getCfgSetting用于获取配置设置信息
*进行模型设置，将会给实例添加几个公有变量：configCtr创建和控制本实例的模型配置数据类型   
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "CMSMgrDecorate",
        /**
        *@function
        *@memberOf CMSMgrDecorate
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name public$getDisplayData
            *@description 返回HTML数据 用于普通decorate组件
            *会返回当前及当前组建所有子组件的HTML数据
            */
            "getDisplayData": function() {
                //获取数据
                var _allData = this.MY.data;
                //返回片段数据
                return this.API.show(this.param.view, _allData, "_");
            },
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name public$setData
            *@description 设置初始化的数据，放置在[ths.MY.data]中
            *@param data 设置的数据
            *@param setChild 开关，如果为true则设置儿子否则只设置自己
            */
            "setData": function(data, setChild) {
                //设置数据
                this.MY.data = this.API.private('processingData', data);
                //给儿子也设置数据
                if (this.param.decorates && setChild) {
                    for (var i = 0; i < this.param.decorates.length; i++) {
                        FW.getApp(this.param.decorates[i].instance).setData(data);
                    }
                }
            },
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name public$getCfgInfo
            *@description 获取系统配置的信息，默认返回是null，即没有配置
            */
            "getCfgInfo": function() {
                //返回空
                return null;
            },
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name public$getDisplayCfg
            *@description 返回显示显示配置的html片段
            *@param cfgObj 配置对象
            *@return 显示的html片段
            */
            "getDisplayCfg": function(cfgObj) {
                //显示配置信息
                return this.API.show("configView", cfgObj, "_");
            },
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name public$getCfgSetting
            *@description 由页面配置获取配置内容，提供默认方法，这种方法页面元素有前提要求：
            *$(domSelector).find("tr").not(".list-tr-hidden").find("td").not(".center")
            *并且值的标签使用属性attr-d来标识属性名的
            *@param domSelector 进行判断的jqueryselector
            *@return 返回设置的对象
            */
            "getCfgSetting": function(domSelector) {
                //设定初值变量
                var data = [];
                var _data = {};
                //block(dom里面所有的td){
                $(domSelector).find("tr").not(".list-tr-hidden").find("td").not(".center").each(function() {
                    //读入dom中值，兼容input,select,textarea情况
                    var text = $(this).find("input").val();
                    if (!text) {
                        text = $(this).find("textarea").val();
                    }
                    if (!text) {
                        text = $(this).find(":selected").val();
                    }
                    //if (用重复名称记录){记录当前行，新起一行
                    if (_data[$(this).attr("attr-d")]) {
                        //加入一行
                        data.push(_data);
                        //新起一行
                        _data = {};
                    }
                    //}
                    //处理读入的值，为空就退出，否则记录一条记录
                    if (!text) {
                        return;
                    }
                    if ($(this).attr("attr-d") == "fun") {
                        _data.oper = {};
                        _data.oper[$(this).attr("attr-d")] = text;
                    } else {
                        _data[$(this).attr("attr-d")] = text;
                    }

                });
                //}
                //补充记录最后一条记录，并返回
                var isNull = true;
                for (var i in _data) {
                    isNull = false;
                    break;
                }
                if (isNull) {
                    return null;
                }
                data.push(_data);
                return data;
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name private$getChildrenApp
            *@description
            */
            "getChildrenApp": function(id) {
                if (this.param.decorates) {
                    return FW.getApp(this.param.decorates[id].instance);
                }
            },
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name private$childrenData
            *@description 被模板调用，设置混合儿子的页面信息
            *@param idx 第几个儿子
            *@return 儿子的信息字符串
            */
            "childrenData": function(idx) {
                var app = this.API.private('getChildrenApp', idx);
                return app.getDisplayData();
            },
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name private$processingData
            *@description 处理数据
            *@param data 输入数据
            */
            "processingData": function(data) {
                return data;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name FireEvent$saveAddNew
            *@description 给作为alias统一配置时，默认页面的方法使用
            */
            "saveAddNew": function() {
                //调用父类进行设置
                this.configCtr.saveAddNew(this.getCfgInfo().sig);
            },
            /**
            *@function
            *@memberOf CMSMgrDecorate
            *@name FireEvent$closeAddNew
            *@description 响应关闭，该方法只用于模型定制
            *@param dom 事件节点处理
            */
            "closeAddNew": function(dom) {
                //关闭窗口
                this.configCtr.closeAddNew();
            }
        }
    });
    return FW;
});