/**
* @namespace
* @name CMSMgrDefaultTagDecorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrDecorate");
    FW.register({
        "name": "CMSMgrDefaultTagDecorate",
        "extends": ["CMSMgrDecorate"],
        /**
        *@function
        *@memberOf CMSMgrDefaultTagDecorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            //toDO
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultTagDecorate
            *@name private$processingData
            *@description 重载父类方法，处理列表中的一些数据
            *@param data 传入的数据
            */
            "processingData": function(data) {
                var CMSMgrDefaultTagDecorate = {};
                if (this.control.param.mode && this.control.param.mode == "tag") {
                    var tagInfo = FW.use().load("taginfo");
                    for (var i = 0; i < tagInfo.length; i++) {
                        if (tagInfo[i].alias == data.alias) {
                            tagInfo[i].selected = true;
                        } else {
                            tagInfo[i].selected = false;
                        }
                    }
                    CMSMgrDefaultTagDecorate.showData = tagInfo;
                } else if (this.control.param.mode && this.control.param.mode == "node") {
                    CMSMgrDefaultTagDecorate.showData = null;
                } else {
                    if (/list/i.test(this.control.param.type)) {
                        CMSMgrDefaultTagDecorate.showData = null;
                    }
                    if (/single/i.test(this.control.param.type)) {
                        //单列表情况
                        CMSMgrDefaultTagDecorate.showData = [];
                        CMSMgrDefaultTagDecorate.showData.push({
                            type: "single",
                            alias: data.alias,
                            showName: "基本信息",
                            selected: true
                        });
                        for (var i = 0; data.orgData.data.cmsmetadata.children && i < data.orgData.data.cmsmetadata.children.length; i++) {
                            CMSMgrDefaultTagDecorate.showData.push(data.orgData.data.cmsmetadata.children[i]);
                        }
                        FW.use().save("taginfo", CMSMgrDefaultTagDecorate.showData);
                    } else {
                        CMSMgrDefaultTagDecorate.showData = null;
                    }

                }

                return CMSMgrDefaultTagDecorate;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultTagDecorate
            *@name FireEvent$changeTag
            *@description 改变tag页
            *@param direction 目标
            */
            "changeTag": function(direction) {
                //初始化参数
                var url = "";
                var tagInfo = FW.use().load("taginfo");
                //判断当前是否为parentalias
                var isP = false;
                //判断目标是否为parentalias
                var miP = false;
                for (var i = 0; i < tagInfo.length; i++) {
                    if (this.control.param.alias == tagInfo[i].alias && tagInfo[i].type && tagInfo[i].type == "single") {
                        isP = true;
                    }
                    if (direction == tagInfo[i].alias && tagInfo[i].type && tagInfo[i].type == "single") {
                        miP = true;
                    }
                }
                //处理复制参数
                for (var i in this.control.param) {
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                            if (j == "cid") {
                                if (isP) {
                                    url += "&nodeid=" + this.control.param.queryParam[j];
                                } else if (miP) {
                                    continue;
                                } else {
                                    url += "&" + j + "=" + this.control.param.queryParam[j];
                                }
                            } else if (j == "nodeid") {
                                if (isP) {
                                    url += "&nid=" + this.control.param.queryParam[j];
                                } else if (miP) {
                                    url += "&cid=" + this.control.param.queryParam[j];
                                } else {
                                    url += "&" + j + "=" + this.control.param.queryParam[j];
                                }
                            } else {
                                url += "&" + j + "=" + this.control.param.queryParam[j];
                            }
                        }
                    } else if (i == "mode") {
                        continue;
                    } else {
                        if (i == "nid") {
                            if (isP) {
                                continue;
                            } else if (miP) {
                                url += "&nodeid=" + this.control.param[i];
                            } else {
                                url += "&" + i + "=" + this.control.param[i];
                            }
                        } else {
                            url += "&" + i + "=" + this.control.param[i];
                        }
                    }
                }
                url += "&alias=" + direction;
                if (miP) {
                    url += "&type=single";
                } else {
                    url += "&type=list";
                    url += "&mode=tag";
                }
                //找到最后一次出现的位置
                if(miP){
                    //获取control对象
                    var controlObj = {
                        alias: direction,
                        control: "single"
                    };
                    //出栈
                    var historyControl = FW.page.MY.controls.pop();
                    //找到不是mask的类型
                    while(historyControl.type && historyControl.type == "mask"){
                        historyControl = FW.page.MY.controls.pop();
                    }
                    //while(this.my记录不为空，且出栈内容不是输入的control){继续出栈
                    while (FW.page.MY.controls.length > 0 && (historyControl.alias != controlObj.alias || historyControl.type != controlObj.type)) {
                        if(historyControl.type == "single" && historyControl.alias == controlObj.alias){
                            break;
                        }
                        //出栈
                        historyControl = FW.page.MY.controls.pop();
                    }
                    //}
                }
                FW.page.createControl(url);
            }
        }
    });
    return FW;
});