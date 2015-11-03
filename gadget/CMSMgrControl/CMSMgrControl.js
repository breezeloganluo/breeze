/**
* @namespace
* @name CMSMgrControl 
* @version 1.01 FrankCheng 控制器初始API接口版本
1.02 罗光瑜 改造了公有私有方法的能力框架
* @description  CMS控制器基本接口 注意:所有control都需要自行引用自己所需要的资源文件。
*公有方法是能力，私有方法是辅助显示功能的   
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "CMSMgrControl",
        /**
        *@function
        *@memberOf CMSMgrControl
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {},
        "public": {
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$handleMetaDataBefore
            *@description 处理和转换查询出来的元数据格式
            *@param __data 待转换数据
            *@return json
            */
            "handleMetaDataBefore": function(__data) {
                //转化数据
                var metadata = eval("(" + __data.cmsmetadata.dataDesc + ")");
                //处理cid
                if (!metadata.cid) {
                    metadata.cid = {
                        type: "Hidden"
                    }
                }
                //初始化排序数组
                var sortArr = [];
                //for(遍历所有字段){处理下拉单选框，如果是下拉单选，判断是否从其他alias里面获取数据
                for (var mName in metadata) {
                    //获取其中一个值
                    var oneMData = metadata[mName];
                    //将值插入到排序数组中
                    var sortOrder = parseInt(oneMData.order);
                    if (oneMData.order == null) {
                        sortOrder = 999999;
                    }
                    sortArr.push({
                        name: mName,
                        sort: sortOrder
                    });
                    //2014-07-23罗光瑜修改，增加对type的处理
                    if (/\{/.test(oneMData.type)) {
                        var urlType = FW.use().getParameter("type");
                        var cid = FW.use().getParameter("cid");
                        if (urlType == "single") {
                            if (cid) {
                                urlType = "single_mod";
                            } else {
                                urlType = "single_add";
                            }
                        }
                        var typeObj = eval("(" + oneMData.type + ")");
                        oneMData.type = (typeObj[urlType] || typeObj["default"] || "Hidden");
                    }
                    //if(是select情况){处理下拉选项
                    if (/select/i.test(oneMData.type)) {
                        //获取valueRange
                        var oneSelect = oneMData.valueRange;
                        //for(遍历所有valueRange){
                        for (var i = 0; i < oneSelect.length; i++) {
                            //获取一个选项
                            var oneSelection = oneSelect[i];
                            //for(选项中的所有对象){对每个对象进行远程数据获取处理
                            for (var n in oneSelection) {
                                //初始化判断的正则表达式
                                var execResult = /(\w+)\.(\w+)/ig.exec(n);
                                //if(如果不是那种外链形式的){退出
                                if (execResult == null) {
                                    //退出单次循环
                                    break;
                                }
                                //}
                                //从服务器端获取下拉选择框的值
                                var selectionDataRes = this.API.doServer("queryContent", "cms", {
                                    alias: execResult[1]
                                });
                                var selectionData = selectionDataRes.data.cmsdata;
                                oneSelect[i] = {};
                                var name = execResult[2];
                                var value = oneSelection[n];
                                for (var ii = 0; selectionData && ii < selectionData.length; ii++) {
                                    var sName = selectionData[ii][name];
                                    var sValue = selectionData[ii][value];
                                    oneSelect[i][sName] = sValue;
                                }
                                break;
                            }
                            //}
                        }
                        //}
                    }
                    //}
                }
                //}
                //block(块){排序
                //数组排序
                sortArr.sort(function(a, b) {
                    return a.sort - b.sort;
                });
                //对象排序
                var tmpMetadata = {};
                for (var i = 0; i < sortArr.length; i++) {
                    var oneData = sortArr[i];
                    tmpMetadata[oneData.name] = metadata[oneData.name];
                }
                //对象赋值
                this.MY.metadata = __data.cmsmetadata;
                this.MY._metadata = metadata;
                metadata = tmpMetadata;
                //}
                //处理各类赋值
                return metadata;
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$handleDataBefore
            *@description 处理查询出来的数据
            */
            "handleDataBefore": function(__data, __metadata, __isSingleData) {
                //将里面的json类型进行处理掉
                if (__data.cmsdata && __data.cmsdata.length) {
                    for (var i = 0; i < __data.cmsdata.length; i++) {
                        for (var j in __metadata) {
                            if (__metadata[j].type == "List" || __metadata[j].type == "Pics" || __metadata[j].type == "CheckBox") {
                                if (/string/i.test(typeof(__data.cmsdata[i][j]))) {
                                    __data.cmsdata[i][j] = __data.cmsdata[i][j] && FW.use().evalJSON(__data.cmsdata[i][j]);
                                }
                            }
                        }
                    }
                };
                return __data.cmsdata;
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$deleteContent
            *@description 删除选中数据
            *@param type 指定type
            *@param cid 标识符
            *@param dom 节点
            */
            "deleteContent": function(type, cid, dom) {
                if (!this.param.alias) {
                    alert("未发现关键参数alias！");
                    return;
                }
                if (!cid) {
                    alert("cid不存在！");
                    return;
                }
                var param = {
                    "alias": this.param.alias,
                    "param": {
                        "cid": cid
                    }
                };
                var code = this.API.doServer("deleteContent", "cms", param).code;
                if (code != 0) {
                    alert("操作执行失败！请添加日志进行查看！");
                }

                return code;
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$update
            *@description 更新数据
            *@param data 需要更新的数据
            */
            "update": function(data) {
                var service = "modifyContent";
                if ((this.param.queryObj && this.param.parentAlias) || this.param.mid) {
                    if (data.nodeid) {
                        delete data.nodeid;
                    }
                    service = "modifyNode";
                }
                data = this.handleDataAfter(data);
                return this.API.doServer(service, "cms", {
                    "alias": this.param.alias,
                    "param": data
                }).code;
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$addNew
            *@description 添加数据
            *@param data 添加的数据
            */
            "addNew": function(data) {
                var service = "addContent"
                if ((this.param.queryObj && this.param.parentAlias) || this.param.mid) {
                    service = "addNode";
                }
                data = this.handleDataAfter(data);
                return this.API.doServer(service, "cms", {
                    "alias": this.param.alias,
                    "param": data
                }).code;
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$queryDataCount
            *@description 根据参数查询数据总数
            *@param alias 别名
            */
            "queryDataCount": function(alias, param, method) {
                if (param == null) {
                    param = {};
                }
                var serviceName = "";
                var packageName = "cms";
                if (this.param.queryObj == null || this.param.queryObj != "father") {
                    var paramSN = this.param.serviceName;
                    if (paramSN == null) {
                        serviceName = "queryContent";
                    } else {
                        var snArr = paramSN.split(".");
                        serviceName = snArr[1];
                        packageName = snArr[0];
                    }
                }
                if (this.param.queryObj == "father") {
                    serviceName = "queryNode";
                }
                var qParam = {
                    alias: alias,
                    param: param,
                    resultset: "count"
                };
                if (method) {
                    qParam.method = method;
                }
                
                //将查询的qParam的参数进行转义将两端的%去掉
                var tmpParam = {};
                if (qParam && qParam.param){
                	for (var n in qParam.param){
                		var v = qParam.param[n];
                		var expResult = /^%([\w]+)%$/i.exec(n);
                		if (expResult){                			
                			tmpParam[expResult[1]] = v;                			 
                		}else{
                			tmpParam[n] = v;
                		}
                	}
                	qParam.param = tmpParam;
                }

                var result;
                if (this.param.service) {
                    var message = this.param.service.match(/[a-zA-Z]+/ig);
                    var package = message[0];
                    var service = message[1];
                    qParam._nodeid = FW.use().getParameter("nodeid");
                    data = this.API.doServer(service, package, qParam).data;

                    result = {
                        "code": 0,
                        "data": data,
                    }
                } else {
                    result = this.API.doServer(serviceName, packageName, qParam);
                }
                return result;
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$handleDataAfter
            *@description
            *@param data 数据
            */
            "handleDataAfter": function(data) {
                var _metadata = this.MY._metadata;
                //反向转换
                //将里面的json类型进行处理掉
                if (data) {
                    for (var j in _metadata) {
                        if (_metadata[j].type == "List" || _metadata[j].type == "Pics") {
                            data[j] = data[j] && FW.use().toJSONString(data[j]);
                        }
                        if (_metadata[j].type == "CheckBox") {
                            try {
                                var orgData = eval("(data[j])");
                                data[j] = FW.use().toJSONString(orgData);
                            } catch(e) {
                                data[j] = FW.use().toJSONString(data[j]);
                            }
                        }
                        if (_metadata[j].type == "DatePicker" || _metadata[j].type == "TimePicker") {
                            data[j] = data[j] + "";
                        }
                    }
                };
                return data;
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$checkAuth
            *@description
            */
            "checkAuth": function(_dom) {
                var curAlias = this.param.alias;
                if (!curAlias || !authorityData) return;
                _dom.find("[authority]").each(function() {
                    //获取页面权限的severname
                    var serverName = "cms." + $(this).attr("authority");
                    //从jsp传过来的authorityData对象中找serviceName，然后遍历其数组找alias
                    if (!authorityData[serverName]) return true;
                    for (var i = 0; i < authorityData[serverName].length; i++) {
                        if (authorityData[serverName][i].paramJson.alias == curAlias) {
                            $(this).show();
                            break;
                        }
                    }
                });
                for (var i in authorityData) {
                    if (i.indexOf("cms") != -1) {
                        continue;
                    }
                    _dom.find("[actionKey]").each(function() {
                        //actionKey
                        var actionKey = $(this).attr("actionKey");
                        for (var j = 0; j < authorityData[i].length; j++) {
                            if (authorityData[i][j].actionKey == actionKey) {
                                $(this).show();
                                break;
                            }
                        }
                    });
                }
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$createDecorateApps
            *@description 创建所有app
            *@param decorates decorates列表
            *@param data 初始要设置进去的数据
            */
            "createDecorateApps": function(decorates, data) {
                //if(存在修饰){创建修饰
                if (decorates) {
                    //while(每一个修饰){创建
                    for (var i = 0; i < decorates.length; i++) {
                        //初始化resource
                        var resource = {
                            param: {
                                decorates: decorates[i].children,
                                view: decorates[i].view
                            },
                            id: decorates[i].instance
                        };
                        //while(每一个修饰成员){
                        for (var n in decorates[i]) {
                            //除去固定内容
                            if (n == "view" || n == "instance" || n == "children" || n == "gadgetName") {
                                continue;
                            }
                            //赋值
                            resource.param[n] = decorates[i][n];
                        }
                        //}
                        //创建app
                        this.MY.pageParam = this.param.pageParam || {};
                        var app = FW.createApp(decorates[i].instance, decorates[i].gadgetName, resource, decorates[i].instance);
                        app.control = this;
                        app.queryParam;
                        app.setData(data);
                        if (decorates[i].children) {
                            this.createDecorateApps(decorates[i].children, data);
                        }
                    }
                    //}
                }
                //}
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$openMask
            *@description 打开模板层
            *@param alias 别名
            */
            "openMask": function(alias) {
                var url = "alias=" + alias;
                url += "&type=mask";
                FW.page.createControl(url);
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$showContent
            *@description 最基本的显示基类，显示整个页面
            *@param viewid 要显示的视图id
            */
            "showContent": function(viewid) {
                //获取decorate
                var decorates = this.API.private("getDecorates");
                //整理显示数据
                var allData = this.API.private('processorShowData');
                //if (allData为空){直接退出，不处理
                //--这种情况就是超时或者查询数据失败
                if(!allData){
                	return;
                }
                //}
                //创建所有decorate
                this.createDecorateApps(decorates, allData);
                //显示前调整数据
                this.API.private('beforeShow', allData);
                //显示内容
                this.API.show(viewid, allData);
                //显示后调整
                this.API.private('afterShow', allData);
                //权限校验
                this.checkAuth($("#CMSMgrControl"));
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name public$queryData
            *@description 请求数据方法，注意，部分查询条件是被长期保存的，这些条件会对后面的查询产生影响。
            *这个时候，就要使用'-'标识强制忽略之前的某些记录的查询条件
            *@param alias 别名
            *@param param 请求参数'-'表示忽略参数
            *@param start 起始位置,'-'表示强制忽略
            *@param length 查询长度,'-'表示强制忽略
            *@param method
            *@param queryObj
            *@param spes '-'表示强制忽略
            */
            "queryData": function(alias, param, start, length, method, queryObj, spes) {
                alias = alias || this.param.alias;
                param = param || this.param.queryParam;
                if (param == "-") {
                    param = null;
                }
                //将cpc_开头的参数全部删除，因为这些是客户端控制参数，不能放到这里使用
                for(var n in param){
                	if (/^cpc_/i.test(n)){
                		delete param[n];
                	}
                }
                start = start || this.param.start || 0;
                length = length || this.param.length || 10;
                method = method || this.param.method || null;
                queryObj = queryObj || this.param.queryObj || null;
                spes = spes || this.param.spes || null;

                var serviceName = "";
                var packageName = "cms";
                if (queryObj == null || queryObj == "child") {
                    var paramSN = this.param.serviceName;
                    if (paramSN == null) {
                        serviceName = "queryContent";
                    } else {
                        var snArr = paramSN.split(".");
                        serviceName = snArr[1];
                        packageName = snArr[0];
                    }
                }

                if (start == null || start == '-') {
                    start = 0;
                }
                if (length == null || start == '-') {
                    length = 999999;
                }
                if (queryObj == "father") {
                    serviceName = "queryNode";
                    //父亲操作，要把分页重新调整
                    start = 0;
                    length = 999999;
                }
                //"spes":{"orderby":[{"name":"cid","desc":"true"}],"limit":{"start":"0","length":"10"}}
                //2014-06-30罗光瑜修改，因为后台加入了排序字段，所以前台取消排序处理
                if (spes == null || spes == '-') {
                    spes = {};
                }
                spes.limit = {
                    "start": start,
                    "length": length
                };
                var qParam = {
                    alias: alias,
                    param: param,
                    spes: spes
                };
                if (method) {
                    qParam.method = method;
                }
                var result;
                //将查询的qParam的参数进行转义将两端的%去掉
                var tmpParam = {};
                if (qParam && qParam.param){
                	for (var n in qParam.param){
                		var v = qParam.param[n];
                		var expResult = /^%([\w]+)%$/i.exec(n);
                		if (expResult){                			
                			tmpParam[expResult[1]] = v;                			 
                		}else{
                			tmpParam[n] = v;
                		}
                	}
                	qParam.param = tmpParam;
                }
                if (this.param.service) {
                    var message = this.param.service.match(/[a-zA-Z]+/ig);
                    var package = message[0];
                    var service = message[1];
                    qParam._nodeid = FW.use().getParameter("nodeid");
                    data = this.API.doServer(service, package, qParam).data;

                    result = {
                        "code": 0,
                        "data": data,
                    }
                } else {
                    result = this.API.doServer(serviceName, packageName, qParam);
                }
                return result;
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name private$getDecorates
            *@description 获取所有decorates的信息
            */
            "getDecorates": function() {
                //toDo
                return [];
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name private$components
            *@description 显示组件
            *@param name 组件名称
            *@return 组件的字符串
            */
            "components": function(name) {
                //找到组件
                var app = FW.getApp(name);
                //调用其获取字符串的方法
                var showStr = app.getDisplayData();
                //返回结果
                return showStr;
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name private$processorShowData
            *@description 处理所有显示数据
            *@return 可以显示的数据
            */
            "processorShowData": function() {},
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name private$beforeShow
            *@description 给在显示前的一个调整，这个时候，所有的decorate已经创建，可以独立设置某个decorate的信息
            *@param data 显示数据传入进来
            */
            "beforeShow": function(data) {
                //toDo
            },
            /**
            *@function
            *@memberOf CMSMgrControl
            *@name private$afterShow
            *@description 显示结束后的数据处理,也是个空方法，接受处理中
            */
            "afterShow": function(data) {
                //toDo
            }
        }
    },module);
    return FW;
});