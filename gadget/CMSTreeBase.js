/**
* @namespace
* @name CMSTreeBase 
* @version * @description  基本的创建树类
*该类提供一个基本的私有方法，createTree供子类调用，该方法使用标准的cms方法进行数据查询，并整理数据结构。
*完后，将调用另外两个私有函数，或showTree或shownotree进行显示。
*扩展子类通常只重写其onCreate方法和showTree方法  
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./CMSTreeLeftMenu");
    FW.register({
        "name": "CMSTreeBase",
        "param": {
            /**
            *@memberOf CMSTreeBase
            *@name displayName
            *@description 栏目树显示的栏目字段名 默认为displayName	格式{"xxxalias":"fieldName"};
            */
            "displayName": null

        },
        /**
        *@function
        *@memberOf CMSTreeBase
        *@name onCreate$onCreate
        *@description 构造函数，空函数
        */
        "onCreate": function() {},
        "private": {
            /**
            *@function
            *@memberOf CMSTreeBase
            *@name private$createTree
            *@description 根据输入的alis 进行节点树查询并将之显示到页面上
            *var selfData = {
            *      name: t_displayName,
            *      type: 'item',
            *      cid: t_cid,
            *      url: t_url,
            *      additionalParameters = {
            *          children: {
            *            ["cid"]:又是类似自己的一个对象
            *          }
            *      }
            *};
            *2013-11-26日罗光瑜扩展，增加从参数可以动态控制显示的名称以及查询的过滤参数，但兼容原来的程序
            *@param alias 要查询的alias
            *@param _displayName 显示于页面上的字段
            *@param _param 查询参数
            */
            "createTree": function(alias, _displayName, _param) {
                //准备参数
                var __type = FW.use().getParameter("type");
                var _this = this;
                _this.MY.displayName = _displayName || _this.param.displayName && _this.param.displayName[alias] || "displayName";
                //block(回调){查询数据并整理和显示
                //--2013-11-26日罗光瑜扩展，增加从参数可以动态控制显示的名称以及查询的过滤参数，但兼容原来的程序
                _this.API.doServer("queryNode", "cms", {
                    alias: alias,
                    param: _param
                },
                function(code, data) {
                    //if(返回值正确且有数据){处理显示数据
                    if (code == 0 && data.cmsdata && data.cmsdata.length) {
                        //初始化栏目对象
                        //--param: name , type , additionalParameters, children
                        var temp = {};
                        var tree_data = {};
                        //for(遍历数据){整理每条数据
                        for (var i = 0; i < data.cmsdata.length; i++) {
                            //block(--){整理参数
                            //栏目id
                            //--2014-05-23罗光瑜修改 cid 要用空格加上，这样才能保证排序顺序
                            var t_cid = " " + data.cmsdata[i].cid;
                            //栏目别名
                            var t_alias = data.cmsdata[i].alias;
                            //父栏目id
                            var t_nodeID = " " + (data.cmsdata[i].nodeid || "");
                            //栏目名称
                            var t_displayName = data.cmsdata[i][_this.MY.displayName];
                            //url
                            var t_url = data.cmsdata[i].menuUrl;
                            //icon
                            var t_icon = data.cmsdata[i].icon;
                            //父亲节点处理
                            //--2013-11-26日罗光瑜修改，如果被挂接节点本身有父节点，也要正常显示,这是所有节点全部是父节点
                            //2014年7月29日 19:18:11 程明剑 屏蔽该验证
                            // var parentAlias = data.cmsmetadata && data.cmsmetadata.parentAlias;
                            // if (parentAlias && parentAlias != t_alias) {
                            //     t_nodeID = " " + 0;
                            // }
                            if (data.cmsdata[i].ctalias) {
                                var t_ctalias = data.cmsdata[i].ctalias;
                            }
                            //}
                            //block(块){整理自己
                            //创建初始化自己
                            var selfData = {
                                name: t_displayName,
                                type: 'item',
                                cid: t_cid,
                                url: t_url,
                                icon: t_icon
                            };
                            if (t_ctalias) selfData.ctalias = t_ctalias;
                            //if (之前的假自己已经存在){将假自己合并过来到自己的真对象中
                            if (temp[t_cid]) {
                                //改变类型为folder类型，并合并儿子
                                selfData.type = 'folder';
                                selfData.additionalParameters = temp[t_cid].additionalParameters;
                            }
                            //}
                            //将整理好的自己，放入临时对象中
                            temp[t_cid] = selfData;
                            //}
                            //block(块){处理父节点
                            //if(是顶级节点){结束单次遍历
                            if (t_nodeID == " " || t_nodeID == " 0" || t_nodeID == " -1") {
                                //直接加入到临时列表中,并结束单次遍历
                                tree_data[t_cid] = selfData;
                                continue;
                            }
                            //}
                            //从临时对象中获取老爸
                            var parent = temp[t_nodeID];
                            //if (这个老爸不存在){造一个假老爸，并放入临时对象中
                            if (!parent) {
                                //造一个假老爸
                                parent = {};
                                //丢到临时数据里面
                                temp[t_nodeID] = parent;
                            }
                            //}
                            //把自己加入到老爸中
                            //--老爸的结构是additionalParameters.children
                            parent.type = 'folder';
                            if (!parent.additionalParameters) {
                                parent.additionalParameters = {
                                    children: {}
                                }
                            }
                            parent.additionalParameters.children[selfData.cid] = selfData;
                            //}
                        }
                        //}
                        //调用私有方法显示树
                        _this.API.private("showTree", tree_data);
                    }
                    //}
                    //else if(无数据有儿子  那么添加儿子信息){ 
                    else if(code == 0 && !data.cmsdata && (!__type||__type!="single")){
                        for(var i =0;i<data.cmsmetadata.children.length;i++){
                            var alias = this.getAlias();
                            var type = FW.use().getParameter("type");
                            var url = window.location.href;
                            if(type){
                                url = url.replace(type,"single");
                            }else{
                                url+="&type=single";
                            }
                            url = url.replace(alias,data.cmsmetadata.alias);
                            url+="&action=add";
                            url+="&cAlias="+alias;
                            window.location.href = url;
                            return;
                        }
                    }else{
                        //显示noTree

                        _this.API.private("noTree");
                    }
                    //}
                })
                //}
            },
            /**
            *@function
            *@memberOf CMSTreeBase
            *@name private$showTree
            *@description 显示树，输入的格式如下：
            *var selfData = {
            *      name: t_displayName,
            *      type: 'item',
            *      cid: t_cid,
            *      url: t_url,
            *      additionalParameters = {
            *          children: {
            *            ["cid"]:又是类似自己的一个对象
            *          }
            *      }
            *};
            *该方法为基本的显示方法，显示节点树的结构
            *@param tree_data 节点树结构
            */
            "showTree": function(tree_data) {
                var _this = this;
                //显示视图
                _this.API.show("nodeTree",tree_data,this.param.target);
                //栏目树数据组合函数
               if(this.param.nodeHidden == "Hidden"){
            	   $("#aliasNodeTree").hide();
            	   $("#aliasNodeTreeBtn").hide();
               }
                
                var _nodeid = FW.use().getParameter("nodeid") || "";
                if (_nodeid){ 
                	_this.nodeid = _nodeid;
                	if(FW.getApp("appMainWithTree")){
                		FW.getApp("appMainWithTree").setMY("nodeid",_nodeid);
                	} 
                }
            },
            /**
            *@function
            *@memberOf CMSTreeBase
            *@name private$noTree
            *@description 空树时显示的内容，通常是不现实左边菜单部分
            */
            "noTree": function() {
            	//2015年1月14日11:06:04 FrankCheng 若无菜单那么list部分就为12
            	$(".col-lg-3").removeClass("col-lg-3");
            	$(".col-lg-9").removeClass("col-lg-9").addClass("col-lg-12");
            }
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf CMSTreeBase
            *@name TrigerEvent$trigerReShowNodeTree
            *@description 2013-11-26日罗光瑜扩展，增加从参数可以动态控制显示的名称以及查询的过滤参数，但兼容原来的程序
            */
            "trigerReShowNodeTree": function(alias, _displayName, _param) {
                this.API.private("createTree", alias, _displayName, _param);
            }
        },
        "view":{
        	nodeTree:require("./CMSMgrNodeTree.tpl")
        }
    });
    return FW;
});