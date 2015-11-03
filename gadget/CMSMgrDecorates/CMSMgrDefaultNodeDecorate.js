/**
* @namespace
* @name CMSMgrDefaultNodeDecorate 
* @description  左边菜单树，点击的时候，默认是不给type或者照操原来的参数
*但是param中的clickType参数，是可以强制指定对应的参数的。这个参数，没有默认值，所以没有在类中声明，但是会出现在代码中，treeSelectct中  
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrDecorate");
    FW.register({
        "name": "CMSMgrDefaultNodeDecorate",
        "extends": ["CMSMgrDecorate"],
        /**
        *@function
        *@memberOf CMSMgrDefaultNodeDecorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            //toDO
        },
        "public": {
            /**
            *@function
            *@memberOf CMSMgrDefaultNodeDecorate
            *@name public$makeTreeData
            *@description
            *@param data 原始数据 请求后的未经过处理的数据
            */
            "makeTreeData": function(data) {
                var temp = {};
                var tree_data = {};

                for (var i = 0; i < data.cmsdata.length; i++) {
                    var t_cid = " " + data.cmsdata[i].cid;
                    var t_alias = data.cmsdata[i].alias;
                    var t_nodeID = " " + (data.cmsdata[i].nodeid || "");
                    var t_displayName = data.cmsdata[i].displayName;
                    var t_url = data.cmsdata[i].menuUrl;
                    var t_icon = data.cmsdata[i].icon;
                    if (data.cmsdata[i].ctalias) {
                        var t_ctalias = data.cmsdata[i].ctalias;
                    }
                    var selfData = {
                        name: t_displayName,
                        type: 'item',
                        cid: t_cid,
                        url: t_url,
                        icon: t_icon
                    };
                    if (t_ctalias) selfData.ctalias = t_ctalias;

                    if (temp[t_cid]) {
                        selfData.type = 'folder';
                        selfData.additionalParameters = temp[t_cid].additionalParameters;
                    }

                    temp[t_cid] = selfData;
                    if (t_nodeID == " " || t_nodeID == " 0" || t_nodeID == " -1") {
                        tree_data[t_cid] = selfData;
                        continue;
                    }

                    var parent = temp[t_nodeID];
                    if (!parent) {
                        parent = {};
                        temp[t_nodeID] = parent;
                    }

                    parent.type = 'folder';
                    if (!parent.additionalParameters) {
                        parent.additionalParameters = {
                            children: {}
                        }
                    }
                    parent.additionalParameters.children[selfData.cid] = selfData;
                }
                return tree_data;
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultNodeDecorate
            *@name private$processingData
            *@description 覆盖父类处理数据方法
            *@param data 数据
            */
            "processingData": function(data) {
                //查询数据
                var tmpdata = null;
                if (data.orgData.data.cmsmetadata.parentAlias && data.orgData.data.cmsmetadata.alias != data.orgData.data.parentAlias && !this.control.param.mode) {
                    var _queryNodeData = this.control.queryData(this.control.param.alias, "-", null, null, null, 'father');
                    tmpdata = _queryNodeData
                }
                //整理数据
                if (tmpdata && tmpdata.data && tmpdata.data.cmsdata) {
                    var treeData = this.makeTreeData(tmpdata.data);
                    //++这是做什么的？
                    var select = FW.getApp("CMSMgrControl").param.queryParam && FW.getApp("CMSMgrControl").param.queryParam.nodeid;
                    return {
                        "treeData": treeData,
                        "select": select
                    };
                }
                return null;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultNodeDecorate
            *@name FireEvent$treeAdd
            *@description 添加顶级节点
            */
            "treeAdd": function() {
                var cid = $(".tree-selected");
                var url = "";
                for (var i in this.control.param) {
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                        	if(typeof this.control.param.queryParam[j] == "object"){
                        		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
                        	}else{
                        		url += "&" + j + "=" + this.control.param.queryParam[j];
                        	}
                        }
                    } else {
                        url += "&" + i + "=" + this.control.param[i];
                    }
                }
                url += "&type=single";
                url += "&queryObj=father";
                url += "&parentAlias=" + this.control.MY.metadata.parentAlias;
                //标识出这是添加父节点的操作
                url += "&cpc_oper=addNode";
                //判断添加节点
                //--这是做什么的，还请名剑解释，区分是添加顶节点还是子节点，如果存在是添加子节点，现在和cpc_oper重复了，可能没有用，要看一下保存事件有没有使用mid
                if (this.param.queryParam && this.control.MY.metadata.parentAlias && this.control.MY.metadata.parentAlias == this.control.MY.metadata.alias && this.control.param.queryParam && this.control.param.queryParam.nodeid && this.control.param.type == "single") {
                    url += "&mid=" + this.param.queryParam.nodeid;
                }

                FW.page.createControl(url);
            },
            /**
             *@function
             *@memberOf CMSMgrDefaultNodeDecorate
             *@name FireEvent$treeTopAdd
             *@description 添加顶级节点
             */
             "treeTopAdd": function() {
                 var cid = $(".tree-selected");
                 var url = "";
                 for (var i in this.control.param) {
                     if (i == "queryParam") {
                         for (var j in this.control.param.queryParam) {
                        	 if(j == "nodeid"){
                        		 continue;
                        	 }
                        	 if(typeof this.control.param.queryParam[j] == "object"){
                         		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
                         	}else{
                         		url += "&" + j + "=" + this.control.param.queryParam[j];
                         	}
                         }
                     } else {
                         url += "&" + i + "=" + this.control.param[i];
                     }
                 }
                 url += "&type=single";
                 url += "&queryObj=father";
                 url += "&parentAlias=" + this.control.MY.metadata.parentAlias;
                 //标识出这是添加父节点的操作
                 url += "&cpc_oper=addNode";
                 //判断添加节点
                 //--这是做什么的，还请名剑解释，区分是添加顶节点还是子节点，如果存在是添加子节点，现在和cpc_oper重复了，可能没有用，要看一下保存事件有没有使用mid
                 if (this.param.queryParam && this.control.MY.metadata.parentAlias && this.control.MY.metadata.parentAlias == this.control.MY.metadata.alias && this.control.param.queryParam && this.control.param.queryParam.nodeid && this.control.param.type == "single") {
                     url += "&mid=" + this.param.queryParam.nodeid;
                 }

                 FW.page.createControl(url);
             },
            /**
            *@function
            *@memberOf CMSMgrDefaultNodeDecorate
            *@name FireEvent$treeSelect
            *@description 点击某个节点后，处理对应的显示对象
            *@param cid 对应的cid
            */
            "treeSelect": function(cid) {
                //初始化变量url
                var url = "";
                //从control中的param中获取参数
                for (var i in this.control.param) {
                    if (i != "queryParam") {
                    	//将分页参数过滤掉
                        if (i == "start" || i == "length" ) {
                        	continue;
                        }
                        //处理菜单选择的type
                        if (i == "type"){
                        	var myType = this.control.param[i];
                        	if (/single/i.test(myType)){
	                        	var curCtr = FW.page.MY.curControl;
			                    var lastCtr = FW.page.getLastControl(curCtr.alias, curCtr.type);
			                    if (lastCtr && lastCtr.type) {
			                    	myType = lastCtr.type;		                        
			                    }
		                    }
		                    url += "&type=" + myType;
                        	continue;
                        }
                        url += "&" + i + "=" + this.control.param[i];
                    } else {
                        for (var j in this.control.param.queryParam) {
                            if (j == "nodeid" || j == "cid" || j == 'cpc_oper') {
                                continue;
                            }
                            if(typeof this.control.param.queryParam[j] == "object"){
                        		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
                        	}else{
                        		url += "&" + j + "=" + this.control.param.queryParam[j];
                        	}
                        }
                    }
                }
                //增加node节点标识
                url += "&nodeid=" + cid;
                //if (有父亲同时在tag页中的其他页面，这时要把parentAlias记录便于返回){
                if (this.control.MY.metadata.parentAlias && this.control.MY.metadata.parentAlias == this.control.MY.metadata.alias && this.control.param.type == "single") {
                    url += "&parentAlias=" + this.control.MY.metadata.alias;
                }
                //}
                //if(alias自己等于自己){强制设置type
                if (!this.param.clickType && this.control.MY.metadata.parentAlias && this.control.MY.metadata.parentAlias == this.control.MY.metadata.alias) {
                    //设置type信息
                    url += ("&type=single");
                }
                //}
                
                FW.page.createControl(url);
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultNodeDecorate
            *@name FireEvent$treeMod
            *@description 树节点的修改
            */
            "treeMod": function() {
                var url = "";
                for (var i in this.control.param) {
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                        	if(typeof this.control.param.queryParam[j] == "object"){
                        		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
                        	}else{
                        		url += "&" + j + "=" + this.control.param.queryParam[j];
                        	}
                        }
                    } else {
                        url += "&" + i + "=" + this.control.param[i];
                    }
                }
                url += "&type=single";
                url += "&queryObj=father";
                url += "&parentAlias=" + this.control.MY.metadata.parentAlias;
                url += "&cid=" + this.control.param.queryParam.nodeid;

                FW.page.createControl(url);
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultNodeDecorate
            *@name FireEvent$treeDel
            *@description 删除一个树节点
            */
            "treeDel": function() {
                var nodeid = this.control.param.queryParam && this.control.param.queryParam.nodeid;
                var _this = this;

                if (nodeid) {
                    var param = {
                        "alias": this.control.param.alias,
                        "param": {
                            "cid": nodeid
                        }
                    };
                    if (confirm("确定要删除吗？")) {
                        var code = this.API.doServer("deleteNode", "cms", param).code;
                        if (code == 0) {
                            var url = "";
                            for (var i in _this.control.param) {
                                if (i == "nodeid" || i == "queryObj" || i == "parentAlias") {
                                    continue;
                                }
                                if (i == "queryParam") {
                                    for (var j in _this.control.param.queryParam) {
                                        if (j == "nodeid") {
                                            continue;
                                        }
                                        if(typeof _this.control.param.queryParam[j] == "object"){
                                    		url += "&" + j + "=[" + _this.control.param.queryParam[j].join(",") + "]";
                                    	}else{
                                    		url += "&" + j + "=" + _this.control.param.queryParam[j];
                                    	}
                                    }
                                } else {
                                    url += "&" + i + "=" + _this.control.param[i];
                                }
                            }
                            FW.page.createControl(url);
                        }
                    }
                }
            }
        }
    },module);
    return FW;
});