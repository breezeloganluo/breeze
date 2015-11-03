/**
* @namespace
* @name actionSingle_Control 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./CMSMgrDefaultSingleControl");
    FW.register({
        "name": "actionSingle_Control",
        "extends": ["CMSMgrDefaultSingleControl"],
        
        "public": {
            /**
            *@function
            *@memberOf actionSingle_Control
            *@name public$handleMetaDataBefore
            *@description
            */
            "handleMetaDataBefore": function(data) {
                //直接构造
                var result = {
                    "cmsalias": {
                        "title": "alias",
                        "type": "Text"
                    },
                    "actions": {
                        "title": "功能选项",
                        "type": "CheckBox",
                        "valueRange": [{
                            "添加内容": 0,
                            "删除内容": 1,
                            "修改内容": 2,
                            "查询内容": 3,
                            "添加节点": 4,
                            "删除节点": 5,
                            "修改节点": 6,
                            "查询节点": 7
                        }]
                    }
                }
                this.MY.metadata = {
                    "displayName": "CMS权限添加"
                };
                return result;
            },
            /**
            *@function
            *@memberOf actionSingle_Control
            *@name public$addNew
            *@description
            */
            "addNew": function(data) {
                //设定service
                var service = "addContent";
                //获取模式
                var mode = this.param.mode;
                if (mode == "node") {
                    service = "addNode";
                }
                //获取nodeid
                var _nodeid = this.param.queryParam && this.param.queryParam.nodeid;
                if (_nodeid && _nodeid != "-1") {
                    data.nodeid = _nodeid;
                }
                //if (是添加cmsalias的时候){
                if (data.cmsalias) {
                    //block(块){判断alias的合法性
                    //合成ccms查询参数
                    var aliasDisplayName = "";
                    var doServerParam = {
                        "alias": "channel",
                        "param": {
                            "alias": data.cmsalias
                        }
                    }
                    //调用cms进行查询
                    var tmprs = this.API.doServer("queryContent", "cms", doServerParam);
                    //if(不存在){提示并推出
                    if (tmprs.code != 0 || tmprs.data == null || tmprs.data.cmsdata == null) {
                        //提示并推出
                        alert("alias未找到");
                        return {
                            "code": 100
                        }
                    }
                    //}
                    //获取显示名称
                    aliasDisplayName = tmprs.data.cmsdata[0].displayName;
                    //}
                    //将action转成json
                    var json = [];
                    if (data.actions != null || data.actions != "") {
                        json =data.actions;
                    }
                    //while(所有action){逐个提交
                    for (var i = 0; i < json.length; i++) {
                        //设定初始变量
                        var actionName;
                        var cmsServiceName;
                        var paramJson = "{alias:'" + data.cmsalias + "'}";
                        //合成提交参数
                        if (json[i] == 0) {
                            actionName = "添加" + aliasDisplayName;
                            cmsServiceName = "cms.addContent";
                        } else if (json[i] == 1) {
                            actionName = "删除" + aliasDisplayName;
                            cmsServiceName = "cms.deleteContent";
                        } else if (json[i] == 2) {
                            actionName = "修改" + aliasDisplayName;
                            cmsServiceName = "cms.modifyContent";
                        } else if (json[i] == 3) {
                            actionName = "查看" + aliasDisplayName;
                            cmsServiceName = "cms.queryContent";
                        } else if (json[i] == 4) {
                            actionName = "添加" + aliasDisplayName + "目录";
                            cmsServiceName = "cms.addNode";
                        } else if (json[i] == 5) {
                            actionName = "删除" + aliasDisplayName + "目录";
                            cmsServiceName = "cms.deleteNode";
                        } else if (json[i] == 6) {
                            actionName = "修改" + aliasDisplayName + "目录";
                            cmsServiceName = "cms.modifyNode";
                        } else if (json[i] == 7) {
                            actionName = "查询" + aliasDisplayName + "目录";
                            cmsServiceName = "cms.queryNode";
                        }

                        doServerParam = {
                            "alias": "action",
                            "param": {
                                "actionName": actionName,
                                "serviceName": cmsServiceName,
                                "paramJson": paramJson,
                                "nodeid": _nodeid
                            }
                        }
                        //逐个用同步方法循环提交
                        tmprs = this.API.doServer("addContent", "cms", doServerParam);
                        if (tmprs.code != 0) {
                            return tmprs;
                        }
                    }
                    //}
                    return 0;
                }
                //}
                //普通添加
                return this.API.doServer(service, "cms", {
                    "alias": this.getAlias(),
                    "param": data
                }).code;
            }
        }
    },module);
    return FW;
});