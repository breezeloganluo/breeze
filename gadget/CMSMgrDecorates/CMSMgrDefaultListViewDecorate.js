/**
* @namespace
* @name CMSMgrDefaultListViewDecorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrDecorate");
    require("../CMSMgrTypeDecorate/TypeDecorate");
    FW.register({
        "name": "CMSMgrDefaultListViewDecorate",
        "extends": ["CMSMgrDecorate", "TypeDecorate"],
        /**
        *@function
        *@memberOf CMSMgrDefaultListViewDecorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            //toDO
        },
        "public": {
        	/**
	        *@function
	        *@memberOf CMSMgrDefaultListViewDecorate
	        *@name public$assetsInit
	        *@description 插件初始化
	        */
            "assetsInit": function() {
            	var _this = this;
            	$('.input-daterange').datepicker({
            		autoclose:true,
            		format: "yyyy/mm/dd"
            	});
            	$(".input-daterange").datepicker().on("changeDate", function(){
            		//绑定变化事件[隐藏问题 会请求多次]
            		/*
            		 * 2015年10月31日12:04:37 支持时间域选择
            		 * 必须同时存在开始时间和结束时间 会自动替换时间前后
            		 * 通过这种方法屏蔽多次请求
            		 * */
            		//获取开始时间
            		var start = $(this).find("input[data-t='start']").val();
            		//获取结束时间
            		var end = $(this).find("input[data-t='end']").val();
            		//若有一者为空那么拒绝执行
                    if(start == "" || start == void 0 || end == void 0 || end == ""){
                    	return;
                    }
                    //判断开始时间是否大于结束时间 若大于 结束时间与开始时间相同
                    if(parseFloat(start.replace(/\//ig,"")) > parseFloat(end.replace(/\//ig,""))){
                    	$(this).find("input[data-t='end']").val(start);
                    }
                    //格式化格式
                    start = new Date(start).getTime();
                    end = new Date(end).getTime();
                    var url = "";
                    for (var i in _this.control.param.queryParam) {
                        url += "&" + i + "=" + _this.control.param.queryParam[i];
                    }
                    
                    for (var i in _this.control.param) {
                        if (i == "queryParam" || i == "start" || i == "length") {
                            continue;
                        }
                        url += "&" + i + "=" + _this.control.param[i];
                    }
                    
                    url+="&" + $(this).find("input").attr("name") + "=[" + start + "," + end + "]";
                    
                    FW.page.createControl(url);
                    
            	});
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name public$getCfgInfo
            *@description 获取系统配置的信息
            */
            "getCfgInfo": function() {
                //返回对应的名称
                return {
                    name: "列表页按钮",
                    sig: "listOperBtns"
                }
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name private$processingData
            *@description 重载父类方法，处理列表中的一些数据
            *@param data 传入的数据
            */
            "processingData": function(data) {
                var CMSMgrDefaultListViewDecorate = {
                    alias: this.param.alias,
                    data: data.data,
                    orgData: data.orgData,
                    metadata: data.metadata
                };
                //设定默认数据
                var _listOperBtns = [{
                    "name": "",
                    "title": "编辑",
                    "style": "btn-info",
                    "icon": "icon-edit",
                    "authority": "modifyContent",
                    "rowId": "true",
                    "oper": {
                        "fun": "openMod"
                    }
                },
                {
                    "name": "",
                    "title": "删除",
                    "style": "btn-danger",
                    "icon": "icon-trash",
                    "authority": "deleteContent",
                    "rowId": "true",
                    "dom": "true",
                    "oper": {
                        "fun": "deleteContent"
                    }
                }];
                //处理定制数据
                if (window.customized && window.customized[data.alias] && window.customized[data.alias].listOperBtns) {
                    _listOperBtns = FW.use().evalJSON(window.customized[data.alias].listOperBtns);
                }
                //设置数据
                CMSMgrDefaultListViewDecorate.listOperBtns = _listOperBtns;
                return CMSMgrDefaultListViewDecorate;
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name private$openMod
            *@description 打开模型编辑框
            *@param type 指定type类型
            *@param cid 标识符
            */
            "openMod": function(type, cid) {
                //防止被多次实例化时调用，比如在模型编辑的时候被调用 
                if (!this.control) {
                    return;
                }
                //if(cid或alias不存在){退出
                if (!cid || !this.control.param.alias) {
                    FW.alert("缺少关键参数alias或cid！");
                    return;
                }
                //}
                //else{打开新的页面
                else {
                    var url = "";
                    //将原来参数设定到url中
                    for (var i in this.control.param) {
                        if (i == "type" || i == "queryObj" || i == 'start') {
                            continue;
                        }
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
                    //设定type
                    if (type) {
                        url += "&type=" + type;
                    } else {
                        url += "&type=single";
                    }
                    //设定cid
                    if (cid) {
                        url += "&cid=" + cid;
                    }
                    //调用页面转向
                    FW.page.createControl(url);
                }
                //}
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name private$deleteContent
            *@description 删除选中数据
            *@param type 指定type
            *@param cid 标识符
            *@param domid 节点标识
            *@param dom 节点
            */
            "deleteContent": function(type, cid, domid, dom) {
                //防止被多次实例化时调用，比如在模型编辑的时候被调用 
                if (!this.control) {
                    return;
                }
                //调用control的删除方法
                var result = this.control.deleteContent(type, cid, dom);
                if (result != 0) {
                    return result;
                }
                //重新刷新页面
                var url = "";
                for (var i in this.control.param) {
                    if (i == "type" || i == "queryObj") {
                        continue;
                    }
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                            if(typeof this.control.param.queryParam[j] == "object"){
	                    		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
	                    	}else{
	                    		url += "&" + j + "=" + this.control.param.queryParam[j];
	                    	}
                        }
                    } else {
                        url += "&" + i + "=" + this.param[i];
                    }
                }
                if (type) {
                    url += "&type=" + type;
                }
                FW.page.createControl(url);
                return 0;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name FireEvent$btnEvent
            *@description 处理点击消息
            *@param evnId 处理的按钮索引
            *@param domObj 当前点击事件的dom组件
            */
            "btnEvent": function(dataId, evnId, domObj) {
                //获取点击信息
                var oneData = this.MY.data.data[dataId];
                var oneBtn = this.MY.data.listOperBtns[evnId];
                //处理调用函数的内容
                var funName = oneBtn.oper.fun;
                //block(块){处理调用的函数
                //处理type和初始化
                //--type表示配置传递的参数
                var type = oneBtn.type;
                //处理第几行
                var cid = oneData.cid;
                //处理domid参数
                var domid = "data" + dataId;
                //}
                //if (公有方法存在){先调用自己的公有方法
                if (this[funName]) {
                    this[funName](type, cid, domid, domObj);
                    return;
                }
                //}
                //if (私有方法存在){
                if (this["private"][funName]) {
                    this.API.private(funName, type, cid, domid, domObj);
                    return;
                }
                //}
                //if (control公有方法中存在){
                if (this.control[funName]) {
                    this.control[funName](type, cid, domid, domObj);
                    return;
                }
                //}
                //若全都没找到 执行triger
            	FW.trigerEvent(funName, type, cid);
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name FireEvent$selectAll
            *@description 弹出的蒙板层，进行全选，该方法给模型设计的alias使用
            *@param dom 被选中的事件dom节点
            */
            "selectAll": function(dom) {
                $(dom).parent().prev().find(">tbody>tr").not(".list-tr-hidden").each(function() {
                    var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
                    if (!cbox.is(':checked')) {
                        cbox.click();
                    }
                });
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name FireEvent$selectAdd
            *@description 弹出的蒙板层新添加一行，该方法给模型设置使用
            *@param dom dom节点
            */
            "selectAdd": function(dom) {
                //克隆空白行
                var lcwnone = $(dom).parent().parent().find("table>tbody>tr.list-tr-hidden");
                var cloneCol = lcwnone.clone(true).removeClass("list-tr-hidden");
                cloneCol.insertBefore(lcwnone);
                cloneCol.html(cloneCol.html()).show();
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name FireEvent$selectChange
            *@description 弹出层的反选功能，该功能给模型设计时使用
            *@param dom 事件的dom节点
            */
            "selectChange": function(dom) {
                $(dom).parent().prev().find(">tbody>tr").not(".list-tr-hidden").each(function() {
                    var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
                    cbox.click();
                });
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultListViewDecorate
            *@name FireEvent$selectDelete
            *@description 弹出层的删除记录，该功能在模型设计时使用
            *@param dom 事件的dom节点
            */
            "selectDelete": function(dom) {
                $(dom).parent().prev().find(">tbody>tr").each(function() {
                    var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
                    if (cbox.is(':checked')) {
                        $(this).remove();
                    }
                });
                if ($(dom).parent().prev().find(">tbody>tr").length == 1) {
                    var lcwnone = $(dom).parent().parent().find("table>tbody>tr.list-tr-hidden");
                    var cloneCol = lcwnone.clone(true).removeClass("list-tr-hidden");
                    cloneCol.insertBefore(lcwnone);
                    cloneCol.html(cloneCol.html()).show();
                }
            }
        }
    },
    module);
    return FW;
});