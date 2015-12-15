/**
* @namespace
* @name CMSMgrDefaultSingleViewDecorate 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("../CMSMgrDecorate");
    require("../CMSMgrTypeDecorate/TypeDecorate");
    FW.register({
        "name": "CMSMgrDefaultSingleViewDecorate",
        "extends": ["CMSMgrDecorate", "TypeDecorate"],
        /**
        *@function
        *@memberOf CMSMgrDefaultSingleViewDecorate
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            //toDO
        },
        "public": {
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name public$xheditorInit
            *@description
            */
            "xheditorInit": function() {
                var _this = this;
                //xheditor编辑器
                _this.MY.editor = [];
                try {
                    if ($('.xheditor').length) {
                        $('.xheditor').each(function(index) {
                            _this.MY.editor[index] = $(".xheditor:eq(" + index + ")").xheditor({
                                urlType: "rel",
                                skin: 'nostyle',
                                width: '100%',
                                height: '300px',
                                upLinkUrl: "upload.php",
                                upLinkExt: "zip,rar,txt",
                                upImgUrl: "upload.php",
                                upImgExt: "jpg,jpeg,gif,png",
                                upFlashUrl: "upload.php",
                                upFlashExt: "swf",
                                upMediaUrl: "upload.php",
                                upMediaExt: "avi"
                            });
                        })
                    }
                } catch(e) {}
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name public$assetsInit
            *@description 插件初始化
            */
            "assetsInit": function() {
                try {
                    //24小时timepicker初始化
                    $('.timepicker-24').timepicker({
                        minuteStep: 1,
                        showSeconds: true,
                        showMeridian: false
                    });
                } catch(e) {

                }

                try {
                    $('.date-picker').datepicker({
                        autoclose: true,
                        todayHighlight: true
                    })
                    //show datepicker when clicking on the icon
                    .next().on(ace.click_event,
                    function() {
                        $(this).prev().focus();
                    });
                } catch(e) {
                    // TODO: handle exception
                }

                try {
                    $('.datepicker').datetimepicker({
                        language: "zh-CN",
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        todayHighlight: 1,
                        startView: 2,
                        minView: 2,
                        forceParse: 0
                    });
                } catch(e) {

                }

                try {
                    $('.timepicker').datetimepicker({
                        language: "zh-CN",
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        todayHighlight: 1,
                        startView: 1,
                        minView: 0,
                        maxView: 1,
                        forceParse: 0
                    });
                } catch(e) {
                    // TODO: handle exception
                }

                try {
                    $('.datetimepicker').datetimepicker({
                        language: "zh-CN",
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        todayHighlight: 1,
                        startView: 1,
                        minView: 0,
                        maxView: 1,
                        forceParse: 0
                    });
                } catch(e) {
                    alert("ace模版暂不支持DateTimePicker类型");
                    console.log(e);
                }

                try {
                    $(".picsUpload").each(function() {
                        var dom = $(this);
                        swfu = new SWFUpload({
                            // Backend Settings
                            upload_url: Cfg.swfuploadUrl,
                            post_params: {
                                "PHPSESSID": "session_id()"
                            },
                            // File Upload Settings
                            file_size_limit: "1 MB",
                            // 2MB
                            file_types: "*.jpg; *.gif; *.png",
                            file_types_description: "选择 JPEG/GIF/PNG 格式图片",
                            file_upload_limit: "0",
                            // Event Handler Settings - these functions as defined in Handlers.js
                            //  The handlers are not part of SWFUpload but are part of my website and control how
                            //  my website reacts to the SWFUpload events.
                            file_queue_error_handler: fileQueueError,
                            file_dialog_complete_handler: fileDialogComplete,
                            upload_progress_handler: uploadProgress,
                            upload_error_handler: uploadError,
                            // upload_success_handler : uploadSuccess,
                            // upload_complete_handler : uploadComplete,
                            //上传成功回调函数
                            upload_success_handler: function(file, result) {
                                var ImgArr = [];
                                var picUrl = FW.use().evalJSON(result).succUrl;
                                ImgArr[0] = {
                                    picUrl: picUrl,
                                    alt: ""
                                };
                            },

                            upload_complete_handler: function(file) {
                                dom.find(' .ProgressContainer').show();
                                dom.find(' .ProgressContainer').css({
                                    'width': '0%'
                                });
                                dom.find('#progressName').html('');
                                this.startUpload();
                            },
                            // Button Settings,
                            button_placeholder_id: "spanButtonPlaceholder",
                            button_width: 230,
                            button_height: 18,
                            button_text: '<span class="button">选择本地图片 <span class="buttonSmall">(单图最大为 1 MB，支持多选)</span></span>',
                            button_text_style: '.button {color:#ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 12pt; } .buttonSmall { font-size: 10pt; }',
                            button_text_top_padding: 0,
                            button_text_left_padding: 0,
                            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                            button_cursor: SWFUpload.CURSOR.HAND,
                            // Flash Settings
                            flash_url: Cfg.baseUrl + "/breeze/swfupload/swfupload.swf",

                            custom_settings: {
                                upload_target: "ProgressContainer"
                            },
                            // Debug Settings
                            debug: false
                        });
                        //banding删除按钮
                        dom.find(" .PicsClass").delegate(".delpic", "click",
                        function() {
                            $(this).parent().remove();
                        })
                    });
                } catch(e) {
                    // TODO: handle exception
                }
                //单图初始化
                try {
                    $(".col-lg-6.pic").each(function() {
                        var dom = $(this);
                        var onclickStr = "this.id = this.id.replace(/\]/ig,'_');";
                        onclickStr = onclickStr + "this.id = this.id.replace(/[\[\.]/ig,'_');";
                        onclickStr = onclickStr + "var tmpid=this.id;";
                        onclickStr = onclickStr + "var tmpi='#'+tmpid;";
                        onclickStr = onclickStr + "$.ajaxFileUpload({";
                        onclickStr = onclickStr + "url:'" + Cfg.ajaxFileUpLoadUrl + "',";
                        onclickStr = onclickStr + "secureuri:false,";
                        onclickStr = onclickStr + "fileElementId:tmpid,";
                        onclickStr = onclickStr + "dataType: 'json',";
                        onclickStr = onclickStr + "success: function (data, status){";
                        onclickStr = onclickStr + "$(tmpi).prevAll('input').val(data.succUrl);";
                        onclickStr = onclickStr + "$(tmpi).parent().next().find('img').attr('src',Cfg.baseUrl+'/'+data.succUrl);";
                        onclickStr = onclickStr + "}";
                        onclickStr = onclickStr + "})";
                        $(this).find("input[name=upload]").attr("onchange", onclickStr);
                    });

                } catch(e) {

}
                //文件初始化
                try {
                    $(".col-lg-6.file").each(function() {
                        var dom = $(this);
                        var onclickStr = "this.id = this.id.replace(/\]/ig,'_');";
                        onclickStr = onclickStr + "this.id = this.id.replace(/[\[\.]/ig,'_');";
                        onclickStr = onclickStr + "var tmpid=this.id;";
                        onclickStr = onclickStr + "var tmpi='#'+tmpid;";
                        onclickStr = onclickStr + "$.ajaxFileUpload({";
                        onclickStr = onclickStr + "url:'" + Cfg.ajaxFileUpLoadUrl + "',";
                        onclickStr = onclickStr + "secureuri:false,";
                        onclickStr = onclickStr + "fileElementId:tmpid,";
                        onclickStr = onclickStr + "dataType: 'json',";
                        onclickStr = onclickStr + "success: function (data, status){";
                        onclickStr = onclickStr + "$(tmpi).prevAll('input').val(data.succUrl);";
                        onclickStr = onclickStr + "}";
                        onclickStr = onclickStr + "})";
                        $(this).find("input[name=upload]").attr("onchange", onclickStr);
                    });
                } catch(e) {

                }
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name public$getData
            *@description 获取data方法
            */
            "getData": function() {
                var data = {};
                var _this = this;
                //还原html
                if (this.MY.editor && this.MY.editor.length > 0) {
                    for (var i = 0; i < _this.MY.editor.length; i++) {
                        _this.MY.editor[i].getSource();
                    }
                }

                $("div[data-value]").each(function() {
                    var key = $(this).attr("data-value");
                    var type = $(this).attr("data-type");
                    
                    var _value = FW.getApp(key).getTypeDecorateData() || "";
                    value = FW.use().toJSONString(_value);
                    eval(key + "=" + value);
                });
                if (FW.getApp("CMSMgrControl").param.queryParam && FW.getApp("CMSMgrControl").param.queryParam.nodeid) {
                    data.nodeid = FW.getApp("CMSMgrControl").param.queryParam.nodeid;
                }
                return FW.use().evalJSON(FW.use().toJSONString(data));
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name public$listShow
            *@description
            *@return toDo
            *@example toDO
            */
            "listShow": function(metadata, data, key) {
                return this.API.show("listView", {
                    "metadata": metadata,
                    "data": data,
                    "key": key
                },
                "_");
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name public$customizedType
            *@description 显示自定义type类型
            *对应tpl为tpye加cusomizedTpl e.g. sss_customerTpl
            *@param metadata 元数据
            *@param data 真实值
            *@param type type名称
            */
            "customizedType": function(metadata, data, type) {
                var showData = {
                    "metadata": metadata,
                    "data": data
                };
                if (metadata.valueRange && metadata.valueRange.length > 0 && metadata.valueRange[0]) {
                    var __appName = metadata.valueRange[0];
                    var __gadgetName = type + "_Decorate";
                    var __resourceAPP = {};
                    var __useAppName = metadata.valueRange[0];
                    var app = FW.createApp(__appName, __gadgetName, __resourceAPP, __useAppName);
                    var valueRange = [];
                    for (var i = 1; i < metadata.valueRange.length; i++) {
                        valueRange.push(metadata.valueRange[i]);
                    }
                    return app.getDecorateDisplayData(valueRange, data);
                } else {
                    alert("自定义type参数不全，请仔细检查！");
                }
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name public$getCfgInfo
            *@description 获取系统配置的信息
            */
            "getCfgInfo": function() {
                //返回详情页的定制项目
                return {
                    name: "详情页定制按钮",
                    sig: "singleButton"
                };
            }
        },
        "private": {
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name private$processingData
            *@description processingData
            *@param data 输入数据
            */
            "processingData": function(data) {
                var param = {};
                if (this.control.param.queryParam && this.control.param.queryParam.cid) {
                    param.cid = this.control.param.queryParam.cid;
                }
                if (this.control.param.parentAlias && this.control.param.parentAlias == this.control.param.alias && this.control.param.queryParam && this.control.param.queryParam.nodeid) {
                    param.cid = this.control.param.queryParam.nodeid;
                    if (this.control.param.mid) {
                        delete param.cid;
                    }
                }
                var _btnData = FW.use().evalJSON(window.systemCtx.singleButton);
                if (window.customized && window.customized[data.alias] && window.customized[data.alias].singleButton) {
                    _btnData = FW.use().evalJSON(window.customized[data.alias].singleButton);
                }
                if ((this.control.param.queryParam && this.control.param.queryParam.cpc_oper=='addNode') || !this.control.param.queryParam || (!this.control.param.queryParam.cid && !param.cid) || (!this.control.param.cid && this.control.param.mid)) {
                    data.data = null;
                }
                var CMSMgrDefaultSingleViewDecorate = {
                    data: data.data,
                    metadata: data.metadata,
                    btnData: _btnData
                };
                return CMSMgrDefaultSingleViewDecorate;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name FireEvent$btnEvent
            *@description 处理绑定的事件。将参数整理后触发TregerEvent方法
            *@param btnIdx 按钮的索引
            *@param dom 节点dom对象
            */
            "btnEvent": function(btnIdx, dom) {
                //获取节点
                var btnData = this.MY.data.btnData[btnIdx];
                //设置参数
                var funName = btnData.onclick;
                var type = btnData.type;
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
            	FW.trigerEvent(funName, type, dom);
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name FireEvent$selectAll
            *@description 弹出的蒙板层，全选功能，该功能给模型设计时使用
            *@param dom 事件的dom节点
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
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name FireEvent$selectAdd
            *@description 弹出蒙板层新添加一行，该方法给模型设计时使用
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
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name FireEvent$selectChange
            *@description 反选功能
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
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name FireEvent$selectDelete
            *@description 弹出的蒙板层，进行记录删除，该方法只用于模型设计时
            *@param dom 点击事件的dom节点
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
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name TrigerEvent$submit
            *@description 提交添加操作或者修改操作
            *@param type 操作的类型
            */
            "submit": function(type) {
                //防止被多次实例化时调用，比如在模型编辑的时候被调用 
            	document.getElementById("maskLayer").style.display ="block";
                if (!this.control) {
                	document.getElementById("maskLayer").style.display ="none";
                    return;
                }
                var _fun;
                var checkResult = true;
                var data = this.getData();
                //2015年11月3日16:10:56 FrankCheng 从描述数据中获取校验function使用eval进行执行
                //若该方法不存在、或者语法有错误 那么跳过执行 执行结果返回结果为false表示校验不通过 后续不会执行 其余返回结果表示成功
                if(this.control.MY.metadata.checkField){
                	var fun = this.control.MY.metadata.checkField;
                	if(fun.indexOf("function") == 0){
                		fun = "_fun=" + fun;
                	}
                	fun = "(" + fun + ")(data)";
                	try{
                		checkResult = eval(fun);
                	}catch(e){
                		alert("您的校验方法有语法错误！");
                		//2015-12-07 FrankCheng 修复异常拦截
                		checkResult = false;
                	}
                }
                if(_fun && checkResult == false && _fun != void 0){
                	//关闭遮罩层
                	document.getElementById("maskLayer").style.display ="none";
                	return;
                }
                
                if (this.control.param.parentAlias && this.control.param.queryObj && this.control.param.queryParam && this.control.param.queryParam.nodeid) {
                    data.nodeid = this.control.param.queryParam.nodeid;
                }
                //if (是自己挂接自己，而且是编辑操作){就强制删除nodeid
                //--用cpc_oper=addNode来区分是否编辑操作
                if (this.control.param.parentAlias && this.control.param.parentAlias == this.control.param.alias && data.nodeid && this.control.param.queryParam.cpc_oper != "addNode") {
                    delete data.nodeid;
                }
                //}
                if (this.control.param.parentAlias && this.control.param.parentAlias == this.control.param.alias && this.control.param.mid) {
                    data.nodeid = this.control.param.mid;
                }
                if (this.control.param.type == "mask") {
                    this.control.MY._metadata = FW.use().load("singleMetadata");
                    this.control.param = FW.use().load("singleParam");
                    this.control.MY.metadata = FW.use().load("singleDataMetadata");
                    FW.use().save("singleMetadata", null);
                    FW.use().save("singleParam", null);
                    FW.use().save("singleDataMetadata", null);
                }

                if ((this.control.param.queryParam && this.control.param.queryParam.cid) || data.cid) {
                    var code = this.control.update(data);
                } else {
                    var code = this.control.addNew(data);
                }
                if (code == "0") {
                    FW.alert("操作成功!");
                    var url = "";
                    for (var i in this.control.param) {
                        if (i == "queryParam") {
                            for (var j in this.control.param.queryParam) {
                                if (j == "cid") {
                                    continue;
                                }
                                if(typeof this.control.param.queryParam[j] == "object"){
                            		url += "&" + j + "=[" + this.control.param.queryParam[j].join(",") + "]";
                            	}else{
                            		url += "&" + j + "=" + this.control.param.queryParam[j];
                            	}
                            }
                        } else {
                            if (i == "queryObj" || i == "mid") {
                                continue;
                            } else {
                                url += "&" + i + "=" + this.control.param[i];
                            }
                        }
                    }
                    if (this.control.MY.metadata.parentAlias && this.control.MY.metadata.parentAlias == this.control.MY.metadata.alias) {
                        if (type) {
                            url += "&type=" + type;
                        } else {
                            url += "&type=single";
                        }
                    } else {
                    	//if(参数传入type就用之){
                        if (type) {
                            url += "&type=" + type;
                        } //}
                		//else{用堆栈返回
                		else {
                            var curCtr = FW.page.MY.curControl;
		                    var lastCtr = FW.page.getLastControl(curCtr.alias, curCtr.type);
		                    if (lastCtr && lastCtr.type) {
		                        url += "&type=" + lastCtr.type;
		                    }
                        }
                		//}
                    }
                    FW.page.createControl(url);
                }else if(code == 501){
                	alert("你正在设置多表关键配置信息 值不能为空！");
                }else if(code == 502){
                	alert("你正在设置多表关键配置信息 所配信息不符合标准或对应表不存在");
                }else if(code == 503){
                	alert("你所修改的字段为存在多表关系 无法进行修改");
                }else if(code == 504){
                	alert("你所设置的alias表必须为空表");
                }else if(code == 505){
                	alert("若想删除多表关键字 必须确保没有多表模型！");
                }else if(code == 506){
                	alert("你不能将多表关键表设置为多表模式！");
                }else if(code == 507){
                	alert("你正在修改多表关键表，此表一经创建及配置 无法再次修改！");
                }else if(code == 508){
                	alert("你正在操作关键表 此表只能添加数据！");
                }
                document.getElementById("maskLayer").style.display ="none";
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name TrigerEvent$goBack
            *@description 返回列表页，
            *增加功能，在type为空的情况下，从control中返回对应的type值
            *@param type 返回的使用的control的type，这个值在统一的btnEvent中体现
            */
            "goBack": function(type) {
                //防止被多次实例化时调用，比如在模型编辑的时候被调用 
                if (!this.control) {
                    return;
                }
                var url = "";
                if (this.control.param.type == "mask") {
                    this.control.MY._metadata = FW.use().load("singleMetadata");
                    this.control.param = FW.use().load("singleParam");
                    this.control.MY.metadata = FW.use().load("singleDataMetadata");
                    FW.use().save("singleMetadata", null);
                    FW.use().save("singleParam", null);
                    FW.use().save("singleDataMetadata", null);
                }
                for (var i in this.control.param) {
                    if (i == "type" || i == "queryObj") {
                        continue;
                    }
                    if (i == "queryParam") {
                        for (var j in this.control.param.queryParam) {
                            if (j == "cid") {
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
                if (this.control.MY.metadata.parentAlias && this.control.MY.metadata.parentAlias == this.control.MY.metadata.alias) {
                    url += "&type=single";
                } else {
                    url += "&type=list";
                }
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
            },
            /**
            *@function
            *@memberOf CMSMgrDefaultSingleViewDecorate
            *@name TrigerEvent$openMask
            *@description
            *@param alias
            */
            "openMask": function(alias) {
                var url = "alias=" + alias;
                url += "&type=mask";
                FW.page.createControl(url);
            }
        }
    },module);
    return FW;
});