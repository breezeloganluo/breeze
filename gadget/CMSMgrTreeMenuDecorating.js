/**
* @namespace
* @name CMSMgrTreeMenuDecorating 
* @description  这是CMS管理后台的修饰类，用于处理左边菜单 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../breeze/framework/js/tools/DateTime");
    require("./CMSTreeBase");
    FW.register({
        "name": "CMSMgrTreeMenuDecorating",
        "extends": ["CMSTreeBase"],
        "param": {
            /**
            *@memberOf CMSMgrTreeMenuDecorating
            *@name mode
            *@description 表示当前是哪个模式，list模式还是single模式
            */
            "mode": "list"
        },
        /**
        *@function
        *@memberOf CMSMgrTreeMenuDecorating
        *@name onCreate$onCreate
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf CMSMgrTreeMenuDecorating
            *@name public$getSelectedNodeid
            */
            "getSelectedNodeid": function() {
            	var nodeid = FW.use().getParameter("nodeid");
            	if(this.MY.selectedNodeid!=null){
            		return this.MY.selectedNodeid;
            	}else if(nodeid!=null){
            		return nodeid;
            	}else{
            		return null;
            	}
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrTreeMenuDecorating
            *@name private$afterBaseShow
            *@description 继承方法，由父类调用，在现实主要的实体后的显示内容
            */
            "afterBaseShow": function() {
                //获取基本属性
                var metadata = this.getMY("rowMetadata");
                var mode = FW.use().getParameter("mode");
				var alias = this.getAlias();
                
				var ro = FW.use().getParameter("norole");
				if (ro != null){
					ro = "&norole="+ro;
				}else{
					ro = "";
				}
				
				//2014年12月20日10:42:15 FrankCheng 修改无DisplayName正常显示列表
				var parentData = this.API.doServer("queryNode","cms",{"alias":alias});
				var parentDesc = (parentData.code == 0 && parentData.data) ? FW.use().evalJSON(parentData.data.cmsmetadata.dataDesc) : null;
				//if(如果菜单设置的情况，且是list页面){要强制跳转到single页面
				if(this.param.mode == "list" && metadata.parentAlias == this.getAlias()){
					window.location = Cfg.CMSMgr+"?alias="+this.getAlias() + "&type=single"+ro;
				}
				//}
				
				
                //if(list模式){
                if (this.param.mode == "list") {
                    //if (有老爸而且不是tag模式 无父亲或者存在displayName){显示树
                    if (! (mode && mode == "tag") && metadata.parentAlias && (parentDesc == null || parentDesc.displayName != null)) {
                        //显示树
                        this.API.private("createTree", this.getAlias());
                        //2015年2月7日15:03:15 FrankCheng 修改自己挂接自己的问题
                    	if(this.getMY("noSelectNode")){
                    		$(".panel.panel-default>.panel-body").hide();
                    	}
                    }
                    //}
                    //else{
                    else {
                        //不显示
                        this.API.private("noTree");
                    }
                    //}
                }
                //}
                //else{
                else {
                    //if(不是在tag模式下并且有老爸并且自己和老爸相等){
                    if (! (mode && mode == "tag") && metadata.parentAlias && metadata.parentAlias == this.getAlias()) {
                        //显示树
                        this.API.private("createTree", this.getAlias());
                        //2015年2月7日15:03:15 FrankCheng 修改自己挂接自己的问题
                    	if(this.getMY("noSelectNode")){
                    		$(".panel.panel-default>.panel-body").hide();
                    	}
                    }
                    //}
                    //else{
                    else {
                        //不显示
                        this.API.private("noTree");
                    }
                    //}
                }
                //}
            }
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf CMSMgrTreeMenuDecorating
            *@name TrigerEvent$trigerReShowNodeTree
            *@description 重写这个方法，不再接受外部的triger请求
            */
            "trigerReShowNodeTree": function() {},
            /**
            *@function
            *@memberOf CMSMgrTreeMenuDecorating
            *@name TrigerEvent$trigerChangeClass
            */
            "trigerChangeClass": function(nodeid, ctalias,dom) {
                this.MY.selectedNodeid = nodeid.replace(/\s/ig,"");
                this.setMY("nodeid", nodeid.replace(/\s/ig,""));
                //去除所有样式
                //2015年3月18日10:10:32 FrankCheng 去除多余代码
                //$(".curSelectedNode").each(function(){
                //	$(this).removeClass("curSelectedNode");
                //});
                //$(dom).addClass("curSelectedNode");
                //$(".panel.panel-default>.panel-body").show();
               
                //if(当前是列表形态){按照列表的方式处理
				if (this.param.mode=="list"){
					if (ctalias) {
						this.setAlias(ctalias);
					}
					//不能show自己，因为重绘图树，会把树的选中样式清除掉
					//this.show({nodeid:nodeid},0,"");
					this.API.private("getApp").show({
						nodeid: nodeid
					},0, "");
				}
                //}
                //else{按照编辑页面处理
                else{
                    //修改hash的值，处理编辑状态下的刷新
                    //--当编辑状态下，如果地址栏上有nodeid参数，那么刷新后，将显示的是添加页面
                    //--这个是不对的，那么通过本事件，将强制写入一个hash
                    //--表单页面看到这个hash就不当作是添加表单的处理
                    if (!/#changeNode/i.test(window.location)){
                        window.location = window.location + "#changeNode";
                    }                    
					this.API.private("getApp").show({
						cid: nodeid
					},0, "");
					//2015年3月30日19:08:29 FrankCheng 当在详情页且点击了切换树后 显示详情
					var _type = FW.use().getParameter("type");
					if(_type&&_type=="single"){
						$("#view_formObj").parent().parent().show();
					}
				}
                //}
				var metadtat = this.getMY("rowMetadata");
                //显示左上角的视图信息
                FW.page && FW.page.setTitle && FW.page.setTitle(metadtat.displayName);
                
                //2015年3月13日10:07:32 FrankCheng 首先去除所有已选项
                var checkIsContent = $(dom).parent().parent().hasClass("tree-folder-content");
                $("#nodeTree").children().each(function(){
                	if($(this).hasClass("tree-selected")){
                		$(this).removeClass("tree-selected");
                		$(this).find("i").removeClass("icon-ok");
                	}else if($(this).hasClass("tree-folder")){
                		$(this).children().each(function(){
                			if(!checkIsContent){
                				$(this).find(".icon-minus").removeClass("icon-minus");
                			}
            				$(this).find(".tree-selected>i").removeClass("icon-ok");
            				$(this).find(".tree-selected").removeClass("tree-selected");
            				$(this).find("i[class='icon-ok']").removeClass("icon-ok");
                		});
                		if(!checkIsContent){
                			$(this).find(".tree-folder-content").hide();
                		}
                	}
                });
                $(dom).parent().addClass("tree-selected");
                $(dom).prev().addClass("icon-ok");
                //2015年3月13日10:09:11 FrankCheng 修正节点串位问题
                if($(dom).parent().prev().hasClass("icon-plus")){
                	$(dom).parent().prev().addClass("icon-minus");
                }
                
                if($(dom).parent().hasClass("tree-selected")){
                	$(dom).parent().parent().next().show();
                }
                
                FW.page.checkAuth($("body"));
            }
        }
    });
    return FW;
});