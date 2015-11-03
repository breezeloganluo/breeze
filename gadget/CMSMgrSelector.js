/**
* @namespace
* @name CMSMgrSelector 
* @version 1.01 FrankCheng 选择器初始版本
* @description  后台CMS系统选择器 负责创建对应的选择器 gadget名称=type+"_Control"                          
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "CMSMgrSelector",
        /**
        *@function
        *@memberOf CMSMgrSelector
        *@name onCreate$onCreate
        *@description 初始化方法 页面入口，创建初始化的内部变量：
        *[this.MY.controls]=[
        *{
        *  alis:"alias",
        *  type"type"
        *}
        *]
        *[this.MY.curControl]={
        *  alias:"xxx",
        *  type:"xxx"
        *}
        */
        "onCreate": function() {
            //创建controls变量
            this.MY.controls = [];
            this.MY.curControl = {};
            //获取url中所有参数
            var urlParams = window.location.search.replace("?", "");
            //if(--){--
            if (urlParams == null || urlParams == "") {
                //不显示内容 返回
                return;
            }
            //}
            //else{
            else {
                //根据参数创建控制器control
                this.createControl(urlParams);
            }
            //}
        },
        "public": {
            /**
            *@function
            *@memberOf CMSMgrSelector
            *@name public$createControl
            *@description 创建基本控制器,在创建控制器的同时记录当前的控制器信息，便于历史调用,
            *信息的结构构成为：参考oncreate方法
            *@param url 页面地址信息，注意，可以只是参数部分
            */
            "createControl": function(url) {
                //根据url获取参数
                var _param = this.API.private("analyticParameter", url);
                _param.type = _param.type || "list";
                var alias = _param.alias;
                var type = _param.type;
                //根据type获取gadget名
                var gadgetName = this.API.private('getControlName', alias, type);
                //设定创建新gadget的resource
                var resource = {
                    param: _param,
                    id: gadgetName
                };
                //获取gadget对象
                var gadget = FW.getGadget(gadgetName);
                //if(gadget存在){正常的创建
                if (gadget) {
                    //创建app
                    FW.createApp("CMSMgrControl", gadgetName, resource, "CMSMgrControl");
                }
                //}
                //else{转向到debugpage上
                else {
                    //修改resource
                    resource.param.forward = true;
                    //创建app
                    FW.createApp("CMSMgrControl", "debugpage_Control", resource, "CMSMgrControl");
                }
                //}
                //将信息录入到controls中
                this.MY.curControl = {
                    alias: alias,
                    type: type
                }
                this.MY.controls.push(this.MY.curControl);
            },
            /**
            *@function
            *@memberOf CMSMgrSelector
            *@name public$getLastControl
            *@description 往堆栈里面找，把和自己相同的清除掉，再返回上一个
            *@param alias 对应alias
            *@param type 类型
            *@return 输入信息的上一个control
            */
            "getLastControl": function(alias, type) {
                //if (没有输入参数){只返回最近信息
                if (alias == null && type == null) {
                    return this.MY.controls.pop();
                }
                //}
                //获取control对象
                var controlObj = {
                    alias: alias,
                    type: type
                };
                //出栈
                var historyControl = this.MY.controls.pop();
                //找到不是mask的类型
                while (historyControl.type == "mask") {
                    historyControl = this.MY.controls.pop();
                }
                //while(this.my记录不为空，且出栈内容不是输入的control){继续出栈
                while (this.MY.controls.length > 0 && (historyControl.alias != controlObj.alias || historyControl.type != controlObj.type)) {
                    //出栈
                    historyControl = this.MY.controls.pop();
                }
                //}
                //再出栈
                historyControl = this.MY.controls.pop();
                //返回
                return historyControl;
            },
            /**
            *@function
            *@memberOf CMSMgrSelector
            *@name public$clearLastControl
            *@description 清除上一个信息
            *@param alias 别名
            *@param type 类型
            */
            "clearLastControl": function(alias, type) {
                //获取control对象
                var controlObj = {
                    alias: alias,
                    control: type
                };
                //出栈
                var historyControl = this.MY.controls.pop();
                //找到不是mask的类型
                while (historyControl.type && historyControl.type == "mask") {
                    historyControl = this.MY.controls.pop();
                }
                //while(this.my记录不为空，且出栈内容不是输入的control){继续出栈
                while (this.MY.controls.length > 0 && (historyControl.alias != controlObj.alias || historyControl.type != controlObj.type)) {
                    //出栈
                    historyControl = this.MY.controls.pop();
                }
                //}
                //返回
                return historyControl;
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrSelector
            *@name private$analyticParameter
            *@description 解析参数
            *@param url 整个请求参数
            *@return json
            */
            "analyticParameter": function(url) {
                //若不存在=表示该值是alias
                if (!/\=/ig.test(url)) {
                    return {
                        "alias": url
                    };
                } else {
                    var param = {};
                    while (true) {
                        var _str = /([^=\?&\s]+)=([^=\?&\s]+)/ig.exec(url);
                        if (!_str) {
                            break;
                        } else {
                            url = url.substr(url.indexOf(_str[0]) + _str[0].length);
                            if (_str[1] == "norole" || _str[1] == "threadSignal") {
                                continue;
                            }
                            if (_str[1] == "alias" || _str[1] == "start" || _str[1] == "length" || _str[1] == "method" || _str[1] == "queryObj" || _str[1] == "spes" || _str[1] == "type" || _str[1] == "parentAlias" || _str[1] == "nid" || _str[1] == "mode" || _str[1] == "mid") {
                                param[_str[1]] = _str[2];
                            } else {
                                if (_str[1] == "actionKey") {
                                    continue;
                                }
                                param.queryParam = param.queryParam || {};
                                if (_str[2].split("%").length > 1) {
                                    param.queryParam[_str[1]] = _str[2].split("%");
                                }else if(_str[2].indexOf("[") != -1){
                                	param.queryParam[_str[1]] = _str[2].replace(/[\[\]]/ig,"").split("\,");
                                }else {
                                    param.queryParam[_str[1]] = _str[2];
                                }
                            }
                        }
                    }
                    return param;
                }
            },
            /**
            *@function
            *@memberOf CMSMgrSelector
            *@name private$getControlName
            *@description 根据alias以及相关的参数，获取control字符串
            *@param alias 当前请求的别名
            *@param type 当前的type
            */
            "getControlName": function(alias, type) {
                //声明返回变量
                var gadgetName = null;
                //if(alias存在){处理特殊的channel和mask情况
                if (alias) {
                    //if (如果是list情况){使用默认列表
                    if (type == "list") {
                        gadgetName = "CMSMgrDefaultListControl";
                    }
                    //}
                    //else if(如果是single){普通表单或者模型定义情况
                    else if (type == "single") {
                        if (alias == "channel") {
                            gadgetName = "CMSMgrModSingleControl";
                        } else {
                            gadgetName = "CMSMgrDefaultSingleControl";
                        }
                    }
                    //}
                    //else if(蒙板层情况){使用蒙板层
                    else if (type == "mask") {
                        gadgetName = "CMSMgrDefaultMaskControl";
                    }
                    //}
                    //else{用type拼接
                    else {
                        gadgetName = type + "_Control";
                    }
                    //}
                }
                //}
                //else{用type拼接页面
                else {
                    if (type) {
                        gadgetName = type + "_Control";
                    } else {
                        alert("type can't be null!!");
                        return;
                    }
                }
                //}
                return gadgetName;
            }
        }
    },
    module);
    return FW;
});