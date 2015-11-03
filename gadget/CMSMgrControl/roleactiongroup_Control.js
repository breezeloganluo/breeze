/**
* @namespace
* @name roleactiongroup_Control 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./CMSMgrDefaultSingleControl");
    FW.register({
        "name": "roleactiongroup_Control",
        "extends": ["CMSMgrDefaultSingleControl"],
        "param": {
            /**
            *@memberOf roleactiongroup_Control
            *@name alias
            *@description
            */
            "alias": "roleactiongroup"
        },
        /**
        *@function
        *@memberOf roleactiongroup_Control
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {
            var data = this.API.private("queryActionGroup");
            this.API.show("groupView", data);
            //加载函数
            try {
                $(".uniform").uniform();
            } catch(e) {
                // TODO: handle exception
            }
        },
        "private": {
            /**
            *@function
            *@memberOf roleactiongroup_Control
            *@name private$queryActionGroup
            *@description
            */
            "queryActionGroup": function(cid, callback) {
                var _this = this;
                var _nodeid = this.param.queryParam.nodeid;
                //查询所有权限组
                var allResult = this.API.doServer("queryContent", "cms", {
                    "alias": "actiongroup"
                });
                var allActionGroup = null;
                if (allResult.code == 0 && allResult.data) {
                    allActionGroup = allResult.data.cmsdata;
                }
                var checkResult = this.API.doServer("queryContent", "cms", {
                    "alias": "roleactiongroup",
                    "param": {
                        "nodeid": _nodeid
                    }
                });
                var checkActionGroup = null;
                if (checkResult.code == 0 && checkResult.data && checkResult.data.cmsdata) {
                    checkActionGroup = checkResult.data.cmsdata;
                    //检查是否早已经选中
                    for (var i = 0; i < allActionGroup.length; i++) {
                        var cid = allActionGroup[i].cid;
                        for (var j = 0; j < checkActionGroup.length; j++) {
                            if (checkActionGroup[j].actiongroupid == cid) {
                                allActionGroup[i].selected = true;
                            }
                        }
                    }
                    this.MY.checkData = checkActionGroup;
                }

                return allActionGroup;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf roleactiongroup_Control
            *@name FireEvent$goBack
            *@description
            *@param type
            */
            "goBack": function(type) {
                var url = "";
                for (var i in this.param) {
                    if (i == "type" || i == "queryObj") {
                        continue;
                    }
                    if (i == "queryParam") {
                        for (var j in this.param.queryParam) {
                            if (j == "cid" || j == "nodeid") {
                                continue;
                            }
                            if(typeof this.param.queryParam[i] == "object"){
                        		url += "&" + j + "=[" + this.param.queryParam[j].join(",") + "]";
                        	}else{
                        		url += "&" + j + "=" + this.param.queryParam[j];
                        	}
                        }
                    } else {
                        url += "&" + i + "=" + this.param[i];
                    }
                }
                url += "&type=list";
                //if(参数传入type就用之){
                if (type) {
                    url += "&type=" + type;
                }
                //}
                //else{用堆栈返回
                else {
                    var curCtr = FW.page.MY.curControl;
                    var lastCtr = FW.page.getLastControl(curCtr.alias, curCtr.type);
                    if (lastCtr && lastCtr.type) {
                        url += "&type=" + lastCtr.type;
                    }
                }
                //}
                FW.page.createControl(url);
            }
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf roleactiongroup_Control
            *@name TrigerEvent$save
            *@description 保存权限方法
            */
            "save": function() {
                var _this = this;
                var alias = "roleactiongroup";
                var nodeid = this.param.queryParam.nodeid;
                var selectData = [];
                $("div.checker>span.checked").each(function() {
                    var _data = {};
                    _data.actiongroupName = $(this).find("input").val();
                    _data.actiongroupid = $(this).find("input").attr("roleactiongroupcid");
                    selectData.push(_data);
                });
                if (selectData.length == 0) {
                    $("input:checked").each(function() {
                        var _data = {};
                        _data.actiongroupName = this.value;
                        _data.actiongroupid = this.attributes.roleactiongroupcid.value;
                        selectData.push(_data);
                    });
                }
                if (this.MY.checkData) {
                    var checkData = this.MY.checkData;
                    //查找所有需要添加的数据  
                    for (var i = 0; i < selectData.length; i++) {
                        var ii = 0;
                        for (var j = 0; j < checkData.length; j++) {
                            if (checkData[j].actiongroupid == selectData[i].actiongroupid) {
                                break;
                            } else {
                                ii++;
                            }
                        }
                        if (ii == checkData.length) {
                            _this.API.doServer("addContent", "cms", {
                                "alias": alias,
                                "param": {
                                    "nodeid": nodeid,
                                    "actiongroupName": selectData[i].actiongroupName,
                                    "actiongroupid": selectData[i].actiongroupid
                                }
                            });
                        }
                    }
                    for (var i = 0; i < checkData.length; i++) {
                        var ii = 0;
                        for (var j = 0; j < selectData.length; j++) {
                            if (checkData[i].actiongroupid == selectData[j].actiongroupid) {
                                break;
                            } else {
                                ii++;
                            }
                        }
                        if (ii == selectData.length) {
                            _this.API.doServer("deleteContent", "cms", {
                                "alias": alias,
                                "param": {
                                    "cid": checkData[i].cid
                                }
                            });
                        }
                    }
                } else {
                    //查找所有需要添加的数据  
                    for (var i = 0; i < selectData.length; i++) {
                        _this.API.doServer("addContent", "cms", {
                            "alias": alias,
                            "param": {
                                "nodeid": nodeid,
                                "actiongroupName": selectData[i].actiongroupName,
                                "actiongroupid": selectData[i].actiongroupid
                            }
                        });
                    }
                }
                alert("操作成功");
            }
        }
    },module);
    return FW;
});