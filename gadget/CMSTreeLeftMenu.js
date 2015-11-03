/**
* @namespace
* @name CMSTreeLeftMenu 
* @version 0.01 罗光瑜 2014-06-1罗光瑜修改，增加对菜单状态的控制
* @description  处理左边的管理后台的菜单树，使用的alias是leftmenu             
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "CMSTreeLeftMenu",
        "extends": ["CMSTreeBase"],
        "param": {
            /**
            *@memberOf CMSTreeLeftMenu
            *@name displayName
            *@description 栏目树显示的栏目字段名 默认为displayName	格式{"xxxalias":"fieldName"};
            */
            "displayName": null,
            /**
            *@memberOf CMSTreeLeftMenu
            *@name alias
            *@description 左边菜单树的请求alias，通过此配置，可以让菜单树从不同的地方获取树节点结构
            */
            "alias": "leftmenu",
            /**
            *@memberOf CMSTreeLeftMenu
            *@name clearCach
            *@description 判断是否在onCreate的时候，清除缓存信息
            */
            "clearCach": false,
            /**
            *@memberOf CMSTreeLeftMenu
            *@name treeDate
            *@description 为空，则用传统的数据方式到数据口中查询数据
            *否则用本结构数据进行树显示
            *{
            *  "菜单名称",
            *  url:"如果是父节点则为空",
            *  "child":{
            *  }
            *}
            */
            "treeDate": null

        },
        /**
        *@function
        *@memberOf CMSTreeLeftMenu
        *@name onCreate$onCreate
        *@description 初始化方法
        */
        "onCreate": function() {
            //if(需要清除){清除缓存
            if (this.param.clearCach) {
                //清除缓存
                FW.use().save("leftmenu", null);
            }
            //}
            //if(有缓存){使用缓存数据显示树
            if (FW.use().load("leftmenu")) {
                //获取缓存数据
                var data = FW.use().load("leftmenu");
                //直接显示数据
                this.API.private("showTree", data);
            }
            //}
            //else if(参数有传递数据内容){使用数据结构内容构造数据并显示
            else if (this.param.treeDate) {
                //block(快){整理数据    
                //block(递归){递归赋值
                //--输入的是当前的节点    
                //--输出的是本层的搞好的节点
                var processData = function(pdata) {
                    var result = {};
                    for (var n in pdata) {
                        var oneData = pdata[n];
                        result[n] = {
                            name: n,
                            type: ((oneData.url) ? "item": "floder"),
                            cid: n,
                            url: oneData.url
                        }
                        if (oneData.children) {
                            result[n].additionalParameters = {
                                children: processData(oneData.children)
                            }
                        }
                    }
                    return result;
                }
                //}
                //调用这个函数，转换数据
                var selftData = processData(this.param.treeDate);
                //}
                //显示菜单树
                this.API.private('showTree', selftData);
            }
            //}
            //else{创建树
            else {
                //调用父类方法，创建树
                this.API.private("createTree", this.param.alias);
            }
            //}
        },
        "public": {
            /**
            *@function
            *@memberOf CMSTreeLeftMenu
            *@name public$openMenu
            *@description 打开左边窗口为打开状态
            */
            "openMenu": function() {
                //处理打开状态
                $("#sidebar").removeClass("menu-min");
                //处理箭头方向
                $("#menu_button_arr").removeClass("icon-double-angle-right");
            },
            /**
            *@function
            *@memberOf CMSTreeLeftMenu
            *@name public$closeMenu
            *@description 把左边窗口状态改成关闭状态
            */
            "closeMenu": function() {
                //处理打开状态
                $("#sidebar").addClass("menu-min");
                //处理箭头方向
                $("#menu_button_arr").addClass("icon-double-angle-right");
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSTreeLeftMenu
            *@name private$noTree
            *@description undefined
            */
            "noTree": function() {
                this.API.show("viewNodeTree", {});
                this.API.find("li>a.dropdown-toggle").toggle(function() {

                    $(this).parent().attr("class", "open");
                    $(this).next().slideDown("fast");

                },
                function() {

                    $(this).parent().attr("class", "");
                    $(this).next().slideUp("fast");

                });
            },
            /**
            *@function
            *@memberOf CMSTreeLeftMenu
            *@name private$showTree
            *@description 被父类获取完数据后调用，生成左边的菜单树
            *@param tree_data 传入的数据对象
            */
            "showTree": function(tree_data) {
                //权限检查
                tree_data = this.API.private("checkLeftAuth", tree_data);
                //if(有缓存){直接html显示
                if (FW.use().load("leftmenu") != null) {
                    //获取缓存
                    var cacheData = FW.use().load("leftmenu");
                    //显示缓存数据    
                    this.dom.html(cacheData);
                }
                //}
                //else{没有缓存，正常显示数据
                else {
                    //显示数据
                    tree_data = this.API.private('checkLeftAuth', tree_data)
                    //2015年1月13日11:00:46 FrankCheng 修改show的位置viewNodeTree-->menu
                    this.API.show("menu", tree_data);
                }
                //}
                //初始化选中菜单
                //--根据菜单url的文件信息判断当前被选中的菜单进行高亮处理
                var paramUrl = document.location.href.split("/")[document.location.href.split("/").length - 1];
                $("#sidebar").find("li a").each(function() {
                    var elementUrlArray = $(this).attr("href").split("/");
                    var elementUrl = elementUrlArray.pop();
                    if (elementUrl == paramUrl) {
                        $(this).parents("li").addClass("active");
                    } else {
                        $(this).parents("li").removeClass("active");
                    }
                });
                //处理和绑定树收缩和展开事件
                //--这不是标准的原来组件做法，因为原来组件做法的js加载时间已经过了
                //--这里是阿辉补充的方法，有缺陷
                this.API.find("li>a.dropdown-toggle").toggle(function() {
                    if ($(this).parent().attr("class") == "open") {
                        $(this).parent().attr("class", "");
                        $(this).next().slideUp("fast");
                    } else {
                        $(this).parent().attr("class", "open");
                        $(this).next().slideDown("fast");
                    }
                },
                function() {
                    if ($(this).parent().attr("class") == "open") {
                        $(this).parent().attr("class", "");
                        $(this).next().slideUp("fast");
                    } else {
                        $(this).parent().attr("class", "open");
                        $(this).next().slideDown("fast");
                    }

                });
            },
            /**
            *@function
            *@memberOf CMSTreeLeftMenu
            *@name private$checkLeftAuth
            *@description 左边菜单的权限校验
            *@param treedata 树的数据
            */
            "checkLeftAuth": function(treedata) {
                //2014年12月13日16:07:06 FrankCheng 修改权限校验
                //若不存在权限数据 将所有数据直接返回
                if (!authorityData) {
                    return treedata;
                }
                function check(treedata) {
                    //遍历删除所有无权限菜单
                    for (var i in treedata) {
                        var type = treedata[i].type;
                        var url = treedata[i].url;
                        if (type == "item") {
                            var norole = url.indexOf("norole");
                            if (norole != -1) {
                                continue;
                            }
                            //查找alias
                            var regexResult = /alias=(.+)&|alias=(.+)/ig.exec(url);
                            var alias = "";
                            if (regexResult != null) {
                                //获取alias
                                alias = regexResult[2];
                                if (alias == null) {
                                    alias = regexResult[1];
                                }
                            } else {
                                alias = url;
                            }
                            //根据alias查询权限
                            var serverName = "cms.queryNode";
                            var checkHasAuth = 0;
                            for (var j = 0; j < authorityData[serverName].length; j++) {
                                if (authorityData[serverName][j].paramJson.alias == alias) {
                                    break;
                                }
                                checkHasAuth++;
                            }
                            if (checkHasAuth == authorityData[serverName].length) {
                                delete treedata[i];
                                continue;
                            }
                            regexResult = /actionKey=(.+)&|actionKey=(.+)/ig.exec(url);
                            var actionKey = "";
                            if (regexResult != null) {
                                //获取alias
                                actionKey = regexResult[2];
                                if (actionKey == null) {
                                    actionKey = regexResult[1];
                                }
                            } else {
                                actionKey = url;
                            }
                            if (actionKey == url) {
                                continue;
                            }
                            var hasAuth = false;
                            outer: for (var k in authorityData) {
                                if (k.indexOf("cms") != -1) {
                                    continue;
                                }
                                for (var kk = 0; kk < authorityData[k].length; kk++) {
                                    if (authorityData[k][kk].actionKey && authorityData[k][kk].actionKey == actionKey) {
                                        hasAuth = true;
                                        break outer;
                                    }
                                }
                            }
                            if (!hasAuth) {
                                delete treedata[i];
                            }
                        } else if (type == "folder") {
                            check(treedata[i].additionalParameters.children);
                        }
                    }
                    //遍历删除无子菜单目录
                    for (var i in treedata) {
                        if (treedata[i].type == "folder" && treedata[i].additionalParameters != null) {
                            var allLength = 0;
                            for (var j in treedata[i].additionalParameters.children) {
                                allLength++;
                            }
                            if (allLength == 0) {
                                delete treedata[i];
                            } else {
                                continue;
                            }
                        }
                    }
                }
                check(treedata);
                return treedata;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSTreeLeftMenu
            *@name FireEvent$menuClick
            *@description 页面点击后的事件
            *@param aobj a标签的对象，注意不是jquery包装器
            *@param isNode 是否是有子节点的父节点
            */
            "menuClick": function(aobj, isNode) {
                //获取href即跳转地址
                var url = aobj.href;
                //保存页面当前的html内容
                var htmlStr = this.dom.html();
                FW.use().save("leftmenu", htmlStr);
                //if(是有子节点的父节点，当前是展开状态){退出，不跳转
                if (isNode && !$("#sidebar").hasClass("menu-min")) {
                    //结束函数
                    return;
                }
                //}
                //if(url不为空){跳转
                if (!/^\s*$/.test(url)) {
                    //window跳转
                    window.location = url;
                }
                //}
            },
            /**
            *@function
            *@memberOf CMSTreeLeftMenu
            *@name FireEvent$go2selector
            *@description 调用selector执行后续方法
            *@param param url参数
            */
            "go2selector": function(param) {
                var url4 = param.substring(0, 4);
                if(url4 == "http") {
                    window.open(param, "_blank");
                }
                FW.page.createControl(param);
            }
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf CMSTreeLeftMenu
            *@name TrigerEvent$trigerReShowNodeTree
            *@description undefined
            */
            "trigerReShowNodeTree": function(alias, _displayName, _param) {}
        }
    });
    return FW;
});