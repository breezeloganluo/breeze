/**
* @namespace
* @name editHtml 
* @version 0.01 罗光瑜 2015-05-01初始化
* @description  编辑html的gadget                                                                             
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./fileselect");
    FW.register({
        "name": "editHtml",
        "param": {
            /**
            *@memberOf editHtml
            *@name fileUrl
            *@description 默认的模板
            */
            "fileUrl": "./manager_auxiliary/template/templateHTML.html",
            /**
            *@memberOf editHtml
            *@name maskid
            *@description 蒙版层的id
            */
            "maskid": "mask",
            /**
            *@memberOf editHtml
            *@name fixPreviewDomain
            *@description 用固定前缀的域名表示这个域名是要被判断是否可以替换成且是可以用模拟数据的url
            */
            "fixPreviewDomain": "dev.joinlinking.com",
            /**
            *@memberOf editHtml
            *@name simulationUrl
            *@description 用于模拟的url
            */
            "simulationUrl": "page.joinlinking.com"
        },
        /**
        *@function
        *@memberOf editHtml
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {
            //创建文件对象
            var pageParam = {
                id: 'fileselect',
                dom: this.dom,
                param: {
                    viewid: "--"
                },
                //实际的参数
                view: {}
                //实际的视图内容
            }
            //设定提示转向
            this.MY.parent = (parent != window);
            if (this.MY.parent) {
                if (parent.FW.getApp("htmledit").getShowStatus() == "fullEdit") {
                    this.MY.parent = false;
                }
            }

            this.MY.fileSelect = FW.createApp("fileselect", "fileselect", pageParam);
            //读取文件
            this.showPageFromUrl();
        },
        "public": {
            /**
            *@function
            *@memberOf editHtml
            *@name public$showSubTips
            *@description 帮组儿子显示提示内容
            *@param tipsStr 提示内容
            */
            "showSubTips": function(tipsStr) {
                //显示子内容
                this.API.show(tipsStr, null, "tips");
            },
            /**
            *@function
            *@memberOf editHtml
            *@name public$addTplMenu
            *@description 被儿子调用，用于显示由儿子整合的resource信息，整合好好后，将刷新菜单
            *@param tplObj tpl对象
            */
            "addTplMenu": function(tplObj) {
                //整合数据到this.MY.page
                for (var n in tplObj) {
                    if (this.MY.page.gadget[n]) {
                        if (!this.MY.page.tpl) {
                            this.MY.page.tpl = {};
                        }
                        this.MY.page.tpl[n] = tplObj[n];
                    }
                }
                this.API.private('showMenu');
            },
            /**
            *@function
            *@memberOf editHtml
            *@name public$getShowStatus
            *@description 为外部调用，获取当前窗口的状态，注意，如果没有状态，默认就是全展开的状态
            *@return 当前状况状态this.MY.showStatus的值
            */
            "getShowStatus": function() {
                //如果为空则返回窗口状态
                return this.MY.showStatus || "fullCtr";
            },
            /**
            *@function
            *@memberOf editHtml
            *@name public$showPageFromUrl
            *@description 1.根据url读取文件
            *2.将文件显示到指定的页面上
            *[this.MY.url]记录要保存的url
            *[this.MY.page]=[
            *{
            *   base:实际的文本内容
            *   cfg:配置内容
            *   css:{
            *        cssName:"xxx"
            *   },
            *   js:{
            *        xxxJS:""
            *   },
            *  jsp:{
            *      xxx.jsp:"路径"
            *  },
            *  gadget:{
            *      xxx.js"路径"
            *  },
            *  rs:{
            *     xxx.js:"resource的路径"
            *  },
            *  tpl{
            *    resourceName:"xxtpl"
            *  },
            *  servicedata:{
            *       serviceName:{
            *            文件名：对应路径
            *       }
            *  }
            *}
            *]
            *本函数，由3个子函数处理：
            *1.文件处理
            *2.文本解析
            *3.显示逻辑
            */
            "showPageFromUrl": function() {
                //获取url参数
                var fileUrl = FW.use().getParameter("fileUrl");
                //block(代码块){构造文件对象读取对象
                var text = null;
                //if (传入的url不为空){获取文件信息
                if (fileUrl != null) {
                    //读取文件
                    var fileArr = fileUrl.split("/");
                    var fileName = fileArr.pop();
                    var fileDir = "/" + fileArr.join("/");
                    this.MY.fileSelect.setFileName(fileName);
                    this.MY.fileSelect.setPath(fileDir);
                    this.MY.jspFileName = fileName;
                    this.MY.jspPath = fileDir;
                    text = this.MY.fileSelect.queryFileContent();
                    $("#aliasTitle").html("[" + fileName + "]");
                }
                //}
                //else{就是url不存在了，要退货
                else {
                    //退出
                    alert("文件地址为空");
                    return;
                }
                //}
                //if(文件本身不存在){读取默认文件
                if (text == null) {
                    //重新设置文件
                    var dfileArr = this.param.fileUrl.split("/");
                    var dfileName = dfileArr.pop();
                    var dfileDir = "/" + dfileArr.join("/");
                    this.MY.fileSelect.setFileName(dfileName);
                    this.MY.fileSelect.setPath(dfileDir);
                    text = this.MY.fileSelect.queryFileContent();
                    //文件设置复位，便于后续保存
                    this.MY.fileSelect.setFileName(fileName);
                    this.MY.fileSelect.setPath(fileDir);
                }
                //}
                //if (文件还是为空){这说明出错了
                if (text == null) {
                    //alert错误并退出
                    alert("文件读取失败");
                    return;
                }
                //}
                //}
                //调用contructHtmlText去解析结构
                this.API.private('contructHtmlText', text);
                //调用showStruct去将内容显示到页面上
                this.API.private('showMenu');
                this.API.private('showOneHTML', this.MY.page.base);
                if (this.MY.parent) {
                    this.API.private('showCtr', false);
                }
            }
        },
        "private": {
            /**
            *@function
            *@memberOf editHtml
            *@name private$showOneConfig
            *@description 根据输入的对象，显示配置内容
            *@param cfgObj 配置对象
            */
            "showOneConfig": function(cfgObj) {
                //改变当前类型
                this.MY.type = "cfg";
                //显示对应的配置信息
                this.API.show("cfgEdit", cfgObj, "mainedit");
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$showOneJS
            *@description 显示脚本内容
            *@param js 显示脚本文本
            */
            "showOneJS": function(js) {
                //toDo
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$showOneCss
            *@description 根据样式文本，显示文本内容
            *@param cssText 文本内容
            */
            "showOneCss": function(cssText) {
                //toDo
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$contructHtmlText
            *@description 这个页面根据传入的html文本，将构造内存的结构类
            *构造的类结构参照：
            *构造的类结构，参见showPageFromUrl方法
            *@param htmlText html文本
            *@return 构造好的内存结构
            */
            "contructHtmlText": function(htmlText) {
                //设置基本内容
                this.MY.page = {
                    base: htmlText,
                    cfg: cfg,
                    css: {},
                    js: {},
                    jsp: {},
                    gadget: {},
                    rs: {}
                }
                //解析配置信息
                var cfg = null;
                var execResult = /<!--@config@([^-]*)-->/i.exec(htmlText);
                if (execResult != null) {
                    var cfgStr = execResult[1];
                    cfg = eval("(" + cfgStr + ")");
                    for (var i in cfg) {
                        if (i == "[img]") {
                            this.MY.page.img = cfg[i];
                        }
                    }
                    this.MY.page.cfg = cfg;
                }
                //解析css
                var exp = /<(\w+)[^>]+?href\s*=\s*["']([^"']+)["']/ig;
                while (true) {
                    var oneResult = exp.exec(htmlText);
                    if (oneResult == null) {
                        break;
                    }
                    var label = oneResult[1];
                    var href = oneResult[2];
                    if (/^link$/i.test(label)) {
                        var fileArray = href.split(/[\\\/]/);
                        var file = fileArray.pop();
                        this.MY.page.css[file] = href;
                    }
                }
                //解析js
                exp = /<(\w+)[^>]+?src\s*=\s*["']([^"']+)["']/ig;
                while (true) {
                    var oneResult = exp.exec(htmlText);
                    if (oneResult == null) {
                        break;
                    }
                    var label = oneResult[1];
                    var src = oneResult[2];
                    if (/^script$/i.test(label)) {
                        var fileArray = src.split(/[\\\/]/);
                        var file = fileArray.pop();
                        this.MY.page.js[file] = src;
                    }
                }
                //解析include的jsp
                //--<jsp:include page="../page/allhead.jsp"/>
                exp = /<jsp\s*:\s*include\s*page\s*=\s*["']([^"']+)["']/ig;
                while (true) {
                    var oneResult = exp.exec(htmlText);
                    if (oneResult == null) {
                        break;
                    }

                    var src = oneResult[1];

                    var fileArray = src.split(/[\\\/]/);
                    var file = fileArray.pop();
                    this.MY.page.jsp[file] = src;

                }
                //解析使用gadget,和re的情况
                exp = /seajs\.use\s*\(\[([^\]]+)]/ig;
                var oneResult = exp.exec(htmlText);
                if (oneResult != null) {

                    var allgadget = oneResult[1].split(/['",]/);
                    for (var i = 0; i < allgadget.length; i++) {
                        if (allgadget[i] == "") {
                            continue;
                        }
                        var src = allgadget[i];

                        var fileArray = src.split(/[\\\/]/);
                        var file = fileArray.pop();
                        if (/resource/.test(file)) {
                            this.MY.page.rs[file] = src;
                        } else {
                            this.MY.page.gadget[file] = src;
                        }
                    }

                }
                //解析servicecall标签
                exp = /<breeze:service\s*servicename=['"]([\w\.]+)["'][^>]*>/ig;
                var oneResult = exp.exec(htmlText);

                if (oneResult != null) {
                    var serviceName = oneResult[1];
                    var allStr = oneResult[0];
                    this.MY.page.servicedata = {};
                    var dir = "/simulateservice/" + serviceName + "/";
                    exp = /simulateFile=['"](\w+)['"]/ig;
                    var fileExecResult = exp.exec(allStr);
                    var fileName = "default.js";
                    if (fileExecResult != null) {
                        fileName = fileExecResult[1] + ".js";
                    }

                    if (this.MY.page.servicedata[serviceName] == null) {
                        this.MY.page.servicedata[serviceName] = {};
                    }

                    this.MY.page.servicedata[serviceName][fileName] = dir + fileName;
                }

                return this.MY.page;
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$showMenu
            *@description 根据分解的构造结果，显示菜单内容
            *页面目录结构如下：
            *{
            *				  t_cid:{
            *				    name:t_displayName,
            *				    type:'item'/'folder',
            *				    cid:t_cid,
            *				    additionalParameters:{
            *				      children:{
            *				         t_cid:xxxx
            *				      }
            *				    }
            *				  }
            */
            "showMenu": function() {
                this.API.show("menuContent", null, "leftMenu");
                initMenu(window.jQuery);
                //block(块){
                tree_data = {};
                var orgData = this.MY.page;
                //构造基本块
                tree_data["base"] = {
                    name: "基本信息",
                    type: "item",
                    cid: "base"
                }
                //构造配置部分
                if (orgData.cfg) {
                    tree_data["cfg"] = {
                        name: "配置",
                        type: "item",
                        cid: "cfg"
                    }
                }
                //构建图片组建部分
                if (orgData && orgData.img) {
                    tree_data["img"] = {
                        name: "img",
                        type: "item",
                        cid: "img"
                    }
                }
                //构造rs部分
                if (orgData && orgData.rs) {
                    tree_data["rs"] = {
                        name: "rs",
                        type: "folder",
                        cid: "rs",
                        additionalParameters: {
                            children: {}
                        }
                    }
                    var c = tree_data["rs"].additionalParameters.children;
                    for (var n in orgData.rs) {
                        c["rs." + n] = {
                            name: n,
                            type: "item",
                            cid: "rs." + n
                        }
                    }
                }
                //构造css部分
                if (orgData && orgData.css) {
                    tree_data["css"] = {
                        name: "css",
                        type: "folder",
                        cid: "css",
                        additionalParameters: {
                            children: {}
                        }
                    }
                    var c = tree_data["css"].additionalParameters.children;
                    for (var n in orgData.css) {
                        c["css." + n] = {
                            name: n,
                            type: "item",
                            cid: "css." + n
                        }
                    }
                }
                //构造js部分
                if (orgData && orgData.js) {
                    tree_data["js"] = {
                        name: "js",
                        type: "folder",
                        cid: "js",
                        additionalParameters: {
                            children: {}
                        }
                    }
                    var c = tree_data["js"].additionalParameters.children;
                    for (var n in orgData.js) {
                        c["js." + n] = {
                            name: n,
                            type: "item",
                            cid: "js." + n
                        }
                    }
                }
                //构造jsp部分
                if (orgData && orgData.jsp) {
                    tree_data["jsp"] = {
                        name: "jsp",
                        type: "folder",
                        cid: "jsp",
                        additionalParameters: {
                            children: {}
                        }
                    }
                    var c = tree_data["jsp"].additionalParameters.children;
                    for (var n in orgData.jsp) {
                        c["jsp." + n] = {
                            name: n,
                            type: "item",
                            cid: "jsp." + n
                        }
                    }
                }
                //构造gadget部分
                if (orgData && orgData.gadget) {
                    tree_data["gadget"] = {
                        name: "gadget",
                        type: "folder",
                        cid: "gadget",
                        additionalParameters: {
                            children: {}
                        }
                    }
                    var c = tree_data["gadget"].additionalParameters.children;
                    for (var n in orgData.gadget) {
                        c["gadget." + n] = {
                            name: n,
                            type: "item",
                            cid: "gadget." + n
                        }
                    }
                }
                //构造tpl部分
                if (orgData && orgData.tpl) {
                    tree_data["tpl"] = {
                        name: "tpl",
                        type: "folder",
                        cid: "tpl",
                        additionalParameters: {
                            children: {}
                        }
                    }
                    var c = tree_data["tpl"].additionalParameters.children;
                    for (var n in orgData.tpl) {
                        c["tpl." + n] = {
                            name: n,
                            type: "folder",
                            cid: "tpl." + n,
                            additionalParameters: {
                                children: {}
                            }
                        }
                        var d = c["tpl." + n].additionalParameters.children;
                        for (var nn in orgData.tpl[n]) {
                            d["tpl." + n + "." + nn] = {
                                name: nn,
                                type: "item",
                                cid: "tpl." + n + "." + nn
                            }
                        }
                    }
                }
                //构造servicedata部分
                //--构造servicecall的模拟数据部分
                if (orgData && orgData.servicedata) {
                    tree_data["servicedata"] = {
                        name: "servicedata",
                        type: "folder",
                        cid: "servicedata",
                        additionalParameters: {
                            children: {}
                        }
                    }
                    var c = tree_data["servicedata"].additionalParameters.children;
                    for (var n in orgData.servicedata) {
                        c["servicedata." + n] = {
                            name: n,
                            type: "folder",
                            cid: "servicedata." + n,
                            additionalParameters: {
                                children: {}
                            }
                        }
                        var d = c["servicedata." + n].additionalParameters.children;
                        for (var nn in orgData.servicedata[n]) {
                            d["servicedata." + n + "." + nn] = {
                                name: nn,
                                type: "item",
                                cid: "servicedata." + n + "." + nn
                            }
                        }
                    }
                }
                //}
                //显示类的树数据
                var DataSourceTree = function(options) {
                    this._data = options.data;
                    this._delay = options.delay;
                }

                DataSourceTree.prototype.data = function(options, callback) {
                    var self = this;
                    var $data = null;

                    if (! ("name" in options) && !("type" in options)) {
                        $data = this._data;
                        //the root tree
                        callback({
                            data: $data
                        });
                        return;
                    } else if ("type" in options && options.type == "folder") {
                        if ("additionalParameters" in options && "children" in options.additionalParameters) $data = options.additionalParameters.children;
                        else $data = {}

                    }

                    if ($data != null)

                    setTimeout(function() {
                        callback({
                            data: $data
                        });
                    },
                    parseInt(Math.random() * 500) + 200);
                }
                var treeDataSource = new DataSourceTree({
                    data: tree_data
                });
                //栏目树生成
                this.API.find('#nodeTree').ace_tree({
                    dataSource: treeDataSource,
                    multiSelect: false,
                    loadingHTML: '<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
                    'open-icon': 'icon-minus',
                    'close-icon': 'icon-plus',
                    'selectable': true,
                    'selected-icon': 'icon-ok',
                    'unselected-icon': 'icon-remove~'
                });
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$showOneHTML
            *@description 显示html编辑内容
            *结合状态，为this.MY.type=base
            *@param showText 显示文本内容
            */
            "showOneHTML": function(showText) {
                this.MY.type = "base";
                //显示编辑试图
                this.API.show("textEdit", null, "mainedit");
                //初始化文本编辑器
                var code_panel = this.API.find("#infoForm")[0];
                code_panel.value = showText;

                var editor = CodeMirror.fromTextArea(code_panel, {
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: "text/html"
                });

                code_panel.getValue = function() {
                    return editor.getValue();
                }
                code_panel.setValue = function(v) {
                    editor.setValue(v);
                }
                code_panel.editor = editor;
                //设置函数字符串
                code_panel.setValue(showText);
                this.API.private('bindEditorEvent', editor);

                this.MY.oldCode = showText;
                var _this = this;
                $(window).bind('beforeunload',function(){
                    if(editor.getValue() != _this.MY.oldCode) return "您输入的内容尚未保存，确定离开此页面吗？";
                });
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$bindEditorEvent
            *@description 给一个编辑器绑定对应的事件
            *@param editor 编辑器对象
            */
            "bindEditorEvent": function(editor) {
                _this = this;
                //block(块){初始化提示内存信息
                //设定block内容
                this.MY.tips = this.MY.tips || {
                    label: {
                        html: "<html></html>",
                        head: "<head></head>",
                        body: "<body></body>",
                        title: "<title></title>",
                        link: "<link ></link>",
                        div: "<div ></div>",
                        img: "<img ></img>",
                        br: "<br/>",
                        p: "<p></p>",
                        dl: "<dl ></dl>",
                        dt: "<dt ></dt>",
                        dd: "<dd ></dd>",
                        ul: "<ul ></ul>",
                        ol: "<ol ></ol>",
                        lii: "<li ></li>",
                        a: "<a ></a>",
                        table: "<table ></table>",
                        tr: "<tr ></tr>",
                        td: "<td ></td>",
                        form: "<form ></form>",
                        input: "<input ></input>",
                        botton: "<botton ></botton>",
                        script: "<script ></script>",
                        iframe: "<iframe ></iframe>",
                        "jsp:include": "<jsp:include page=\"\"/>",
                        "breeze:service": "<breeze:service servicename=\"[package.servicename]\" param=\"{['key]':'[value]'}\" simulateFile=\"[模拟数据名]\"></breeze:service>",
                        "breeze:arr": "<breeze:arr idx='[0]'></breeze:arr>",
                        "breeze:fun": "<breeze:fun funexp='[key]'/>"

                    },
                    attrName: {
                        "rel": "rel=\"\"",
                        "href": "href=\"\"",
                        "id": "id=\"\"",
                        "class": "class=\"\"",
                        "style": "style=\"\"",
                        "type": "type=\"\"",
                        "reserve": "reserve=\"\"",
                        "name": "name=\"\"",
                        "src": "src=\"\"",
                        "onclick": "onclick=\"\"",
                        "onload": "onload=\"\"",
                        "onresize": "onresize=\"\"",
                        "onblur": "onblur=\"\"",
                        "onchange": "onchange=\"\"",
                        "onsubmit": "onsubmit=\"\"",
                        "onkeydown": "onkeydown=\"\"",
                        "onkeypress": "onkeypress=\"\"",
                        "onkeyup": "onkeyup=\"\"",
                        "ondblclick": "ondblclick=\"\"",
                        "ondrag": "ondrag=\"\"",
                        "ondragend": "ondragend=\"\"",
                        "ondragenter": "ondragenter=\"\"",
                        "ondragleave": "ondragleave=\"\"",
                        "ondragover": "ondragover=\"\"",
                        "ondragstart": "ondragstart=\"\"",
                        "ondrop": "ondrop=\"\"",
                        "onmousedown": "onmousedown=\"\"",
                        "onmousemove": "onmousemove=\"\"",
                        "onmouseout": "onmouseout=\"\"",
                        "onmouseover": "onmouseover=\"\"",
                        "onmouseup": "onmouseup=\"\"",
                        "onmousewheel": "onmousewheel=\"\"",
                        "onscroll": "onscroll=\"\"",
                        "touchstart": "touchstart=\"\"",
                        "touchmove": "touchmove=\"\"",
                        "touchend": "touchend=\"\"",
                        "appid": "APPID=\"\"",
                        "resid": "RESID=\"\""
                    },
                    attrValue: {
                        "FireEvent": "FireEvent",
                        "fireEvent": "FireEvent"
                    },
                    style: {
                        "border:solid": "border:solid;",
                        "border:none": "border:none;",
                        "border:hidden": "border:hidden;",
                        "border-color": "border-color:上右下左;",
                        "border-width": "border-width:;",
                        "clear": "clear;",
                        "float": "float;",
                        "margin:": "margin:上右下左;",
                        "margin-bottom": "margin-bottom:px;",
                        "margin-left": "margin-left:px;",
                        "margin-right": "margin-right:px;",
                        "margin-top": "margin-top:px;",
                        "padding:": "padding:上右下左;",
                        "padding-bottom": "padding-bottom:px;",
                        "padding-left": "padding-left:px;",
                        "padding-right": "padding-right:px;",
                        "padding-top": "padding-top:px;",
                        "background:": "background:;",
                        "color:": "color:;",
                        "display:none": "display:none;",
                        "display:block": "display:block;",
                        "display:inline": "display:inline;",
                        "font:normal": "font:normal;",
                        "font:italic": "font:italic;",
                        "font:inherit": "font:inherit;",
                        "font:oblique": "font:oblique;",
                        "font-size:": "font-size:;",
                        "text-align:left": "text-align:left;",
                        "text-align:right": "text-align:right;",
                        "text-align:center": "text-align:center;",
                        "text-align:justify": "text-align:justify;",
                        "text-align:inherit": "text-align:inherit;",
                        "vertical-align:baseline": "vertical-align:baseline;",
                        "vertical-align:sub": "vertical-align:sub;",
                        "vertical-align:super": "vertical-align:super;",
                        "vertical-align:top": "vertical-align:top;",
                        "vertical-align:text-top": "vertical-align:text-top;",
                        "vertical-align:middle": "vertical-align:middle;",
                        "vertical-align:bottom": "vertical-align:bottom;",
                        "vertical-align:text-bottom": "vertical-align:text-bottom;",
                        "position:static": "position:static;",
                        "position:absolute": "position:absolute;",
                        "position:fixed": "position:fixed;",
                        "position:relative": "position:relative;",
                        "left:": "left:px;",
                        "top:": "top:px;",
                        "width:": "width:px;",
                        "height:": "heitht:px;"
                    },
                    "class": {
                        FWApp: "FWApp ",
                        FWRES: "FWRES\" APPID=\"\"  RESID=\""
                    },
                    template: {
                        "for": "for (var i=0;i<data.length;i++){-->\n<!--$}-->",
                        "if": "if (data != null){-->\n<!--$}-->",
                        "${p:": "${p:('functionName',p1,data.xxx)}"
                    },
                    jsp: {
                        "page contenttyp": "page contentType=\"text/html; charset=UTF-8\" language=\"java\"  pageEncoding=\"UTF-8\"%>",
                        "page import": "page import=\"\"%>",
                        "taglib": "taglib uri=\"http://breeze.joinlinking.com/tag\" prefix=\"breeze\" %>"
                    },
                    "import": {
                        "java.util.*": "java.util.*",
                        "java.util.regex.*": "java.util.regex.*",
                        "com.breezefw.framework.init.service.Log4jInit": "com.breezefw.framework.init.service.Log4jInit",
                        "com.breeze.support.tools.*": "com.breeze.support.tools.*",
                        "com.breeze.support.cfg.*": "com.breeze.support.cfg.*",
                        "com.breeze.base.db.*": "com.breeze.base.db.*",
                        "java.io.*": "java.io.*",
                        "com.breeze.framwork.databus.ContextTools": "com.breeze.framwork.databus.ContextTools",
                        "com.breezefw.shell.ServiceDescTools": "com.breezefw.shell.ServiceDescTools",
                        "com.breeze.framwork.databus.BreezeContext": "com.breeze.framwork.databus.BreezeContext",
                        "java.sql.*": "java.sql.*"
                    }
                }
                //}
                //block(块){
                editor.on("beforeChange",
                function(Editor, changes) {
                    //if(tab键按下){进行尝试性补全
                    if (changes.text[0] == '\t') {
                        //获取一行字符
                        var line = editor.getLine(changes.to.line);
                        //if (在字符末尾，或者空格后面插入){进行冒泡处理
                        if (line.length != 0 && (line.length == changes.from.ch || /[^\w]/.test(line.charAt(changes.from.ch)))) {
                            //获取tab左边字符
                            var dealWord = null;
                            var domain = null;
                            var leftLine = line.substring(0, changes.from.ch);
                            var execResult = /<%@([\s\w]+)$/i.exec(leftLine);
                            //if(是jsp标识情况){处理jsp
                            if (execResult != null) {
                                domain = "jsp";
                                dealWord = execResult[1];
                            }
                            //}
                            //else if (是<xx){标签名
                            if (dealWord == null) {
                                execResult = /(<[\w:]+)$/i.exec(leftLine);
                                if (execResult != null) {
                                    domain = "label";
                                    dealWord = execResult[1];
                                }
                            }
                            //}
                            //else if (gadget声明){
                            if (dealWord == null) {
                                execResult = /<!--@(\w+@?)$/i.exec(leftLine);
                                if (execResult != null) {
                                    domain = "gadget";
                                    dealWord = execResult[1];
                                }
                            }
                            //}
                            //else if(模板视图语法声明){
                            if (dealWord == null) {
                                execResult = /<!--\$(\w+)$/i.exec(leftLine);
                                if (execResult != null) {
                                    domain = "template";
                                    dealWord = execResult[1];
                                } else {
                                    execResult = /\$\{p:/i.exec(leftLine);
                                    if (execResult != null) {
                                        domain = "template";
                                        dealWord = execResult[0];
                                    }
                                }
                            }
                            //}
                            //else if (seajs声明){
                            if (dealWord == null) {
                                execResult = /sea/i.exec(leftLine);
                                if (execResult != null) {
                                    domain = "seajs";
                                    dealWord = "sea";
                                }
                            }
                            //}
                            // else if(标签内的属性名){
                            if (dealWord == null) {
                                execResult = /<\w+\s*[^>]*\s(\w+)$/i.exec(leftLine);
                                if (execResult != null) {
                                    domain = "attrName";
                                    dealWord = execResult[1];
                                }
                            }
                            //}
                            //else if (属性的值){
                            if (dealWord == dealWord) {
                                execResult = /<\w+\s*[^>]*\s(\w+)="([^"]+)$/i.exec(leftLine);
                                if (execResult != null) {
                                    //设置普通属性
                                    if ("class" != execResult[1] && "style" != execResult[1]) {
                                        domain = "attrValue";
                                        dealWord = execResult[2];
                                    } else if ("style" == execResult[1]) {
                                        domain = "style";
                                        var styleWord = execResult[2];
                                        execResult = /[\w:-]+$/.exec(styleWord);
                                        if (execResult != null) {
                                            dealWord = execResult[0];
                                        }
                                    } else if ("class" == execResult[1]) {
                                        domain = "class";
                                        var styleWord = execResult[2];
                                        execResult = /[\w]+$/.exec(styleWord);
                                        if (execResult != null) {
                                            dealWord = execResult[0];
                                        }
                                    }
                                }
                            }
                            //}
                            //else if (匹配java import的情况){
                            if (dealWord === null) {
                                execResult = /<%@page\s+import="([^"]+)$/i.exec(leftLine);
                                if (execResult != null) {
                                    domain = "import";
                                    dealWord = execResult[1];
                                }
                            }
                            //}
                            //else{没有匹配上
                            if (dealWord == null) {
                                return null;
                            }
                            //}
                            //获取被补全内容
                            var filterS = _this.API.private("changeTips", dealWord, domain) || "";
                            //补全字符
                            var newFrom = (filterS == "") ? changes.from: {
                                ch: changes.from.ch - dealWord.length,
                                line: changes.from.line
                            }
                            if (changes.from.xRel) {
                                newFrom.xRel = changes.from.xRel
                            }

                            changes.update(newFrom, changes.to, [filterS], changes.origin);
                            return;
                        }
                        //}
                    }
                    //}
                    //else if (空格键被按){提示信息还原
                    else if (changes.text[0] == ' ') {
                        //直接还原
                        _this.API.private("showTips", null);
                    }
                    //}
                });
                //}
                //ctr-s按下后处理
                editor.on("keydown",
                function(Editor, Eevent) {
                    if (83 == Eevent.keyCode) {
                        if (Eevent.ctrlKey || Eevent.altKey) {
                            _this.API.private('saveHTML');
                        }
                    }
                });
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$showTips
            *@description 根据数组，显示要显示的提示内容，该函数用于过滤要显示的内容，将非字符部分过滤掉，然后再显示
            *@param showArray 原始要显示的内容
            */
            "showTips": function(showArray) {
                //转换数组
                var data = [];
                for (var i = 0; showArray && i < showArray.length; i++) {
                    var oneStr = showArray[i].replace(/[^\w-:]/ig, "");
                    data.push(oneStr);
                }
                //显示到页面
                if (this.MY.parent) {
                    var str = this.API.show("tipsContent", data, "_");
                    parent.FW.getApp("htmledit").showSubTips(str);
                } else {
                    this.API.show("tipsContent", data, "tips");
                }
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$changeTips
            *@description 输入提示内容，返回补全内容，以及修改相关的提示部分
            *@param words 提示内容
            *@param domain 是那个领域的内容
            */
            "changeTips": function(words, domain) {
                //结果数组
                var resultArray = [];
                var result = null;
                //if(标签){找到标签部分
                if ("label" == domain) {
                    //for (所有label对象){
                    for (var n in this.MY.tips.label) {
                        //if (和名字相符且是前缀){
                        if (("<" + n).indexOf(words) == 0) {
                            //加入到结果数组
                            resultArray.push("<" + n);
                            result = this.MY.tips.label[n];
                        }
                        //}
                    }
                    //}
                    //if(数组为1){
                    if (resultArray.length == 1) {
                        // 获取并返回
                        return result;
                    }
                    //}
                }
                //}
                //else if (是属性名类型){
                else if ("attrName" == domain || "attrValue" == domain || "style" == domain || "template" == domain || "class" == domain || "jsp" == domain || "import" == domain) {
                    //for (所有label对象){
                    for (var n in this.MY.tips[domain]) {
                        //if (和名字相符且是前缀){
                        if (n.indexOf(words) == 0) {
                            //加入到结果数组
                            resultArray.push(n);
                            result = this.MY.tips[domain][n];
                        }
                        //}
                    }
                    //}
                    //if(数组为1){
                    if (resultArray.length == 1) {
                        // 获取并返回
                        return result;
                    }
                    //}
                }
                //}
                //else if (gadget的情况){
                else if ("gadget" == domain) {
                    var result = words + "@{param1:'paramvalue'}-->";
                    if (/@$/i.test(words)) {
                        result = words + "{param1:'paramvalue'}-->";
                    }
                    return result;
                }
                //}
                //else if (seajs){
                else if ("seajs" == domain) {
                    var result = "seajs.config({\r\nbase: '${B}'\r\n});\r\nseajs.use(['/servicegadget/xxx/yyy'], function(a) {\r\na.go('${S}');\r\nwindow.FW = a;\r\n});";
                    return result;
                }
                //}
                //block(块){处理数组多1的情况
                //显示到页面
                this.API.private('showTips', resultArray);
                //声明返回变量
                var returnStr = words;
                //for(当前输入值长度到第一个数组元素的长度){
                for (var i = words.length; resultArray && resultArray.length && resultArray.length > 1 && i < resultArray[0].length; i++) {
                    var allEquals = true;
                    //for(遍历数组所有元素){
                    for (var j = 1; j < resultArray.length; j++) {
                        //if(和第一个字符元素比较是不相等){
                        if (resultArray[j].charAt(i) != resultArray[0].charAt(i)) {
                            //  合成上一个字符串内容并返回
                            return returnStr;
                        }
                        //}
                    }
                    //}
                    returnStr += resultArray[0].charAt(i);
                }
                //}
                //}
                return null;
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$showCtr
            *@description 根据参数控制显示还是隐藏控制台
            *@param isDisplay true为显示，否则就隐藏
            */
            "showCtr": function(isDisplay) {
                //if(要显示){进行显示
                if (isDisplay) {
                    //直接用jquery控制隐藏所有控制内容
                    $(".textctrclose").show();
                    $(".textctropen").hide();
                    $("#mainedit").css("width", "80%");
                    this.MY.showStatus = "fullCtr";
                }
                //}
                //else {隐藏
                else {
                    //直接用jquery控制隐藏所有控制内容
                    $(".textctrclose").hide();
                    $(".textctropen").show();
                    $("#mainedit").css("width", "100%");
                    this.MY.showStatus = "fullEdit";
                }
                //}
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$openCreator
            *@description 对外打开一个creator，即其他编辑器
            *@param creatorName 编辑器名称
            *@param fileUrl 要编辑文件地址
            */
            "openCreator": function(creatorName, fileUrl) {
                //合成creator的url
                var url = "./" + creatorName + "Creator.jsp?fileUrl=" + encodeURIComponent(fileUrl);
                //显示视图
                this.API.show("otherEdit", url, "mainedit");
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$saveHTML
            *@description 保存文档内容
            */
            "saveHTML": function() {
                //读取html内容
                var code_panel = this.API.find("#infoForm")[0];
                var htnml = code_panel.getValue();
                //重新解析
                if (!this.MY.parent) {
                    this.API.private('contructHtmlText', htnml);
                    this.API.private('showMenu');
                }
                this.MY.fileSelect.setFileName(this.MY.jspFileName);
                this.MY.fileSelect.setPath(this.MY.jspPath);
                this.MY.fileSelect.saveFile(htnml);
                this.MY.oldCode = htnml;
                alert("文件保存成功");
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$showImgEditor
            *@description 图片编辑功能
            *@param pics 图片列表
            */
            "showImgEditor": function(pics) {
                var _this = this;
                //改变当前类型
                this.MY.type = "img";
                //根据路径读取文件列表
                this.MY.fileSelect.setPath(pics);
                var fileList = this.MY.fileSelect.showQueryDir(true);
                //处理路径
                if (fileList != null && fileList.length && fileList.length > 0) {

                    for (var i = 0; i < fileList.length; i++) {
                        fileList[i].picUrl = this.MY.page.img + "/" + fileList[i].picUrl;
                        //补全信息
                        this.MY.tips.attrValue = this.MY.tips.attrValue || {};
                        this.MY.tips.attrValue[fileList[i].alt] = "${B}" + fileList[i].picUrl;
                    }
                }
                //显示内容
                this.API.show("imgEdit", fileList, "mainedit");
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
                            file_size_limit: "2 MB",
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
                                //成功后将文件移动到制定路径下
                                var _alt = /\d+.\w+$/.exec(picUrl)[0];
                                ImgArr[0] = {
                                    picUrl: picUrl,
                                    alt: _alt
                                };
                                if (!/[\u4e00-\u9fa5]/.test(file.name)) {
                                    _alt = file.name;
                                }
                                //设置路径
                                _this.MY.fileSelect.setPath("/");
                                //请求jsp
                                _this.MY.fileSelect.moveFile(picUrl, _this.MY.page.img, _alt);
                                //重新显示页面
                                _this.API.private("showImgEditor", pics);
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
                            button_text: '<span class="button">选择本地图片 <span class="buttonSmall">(单图最大为 2 MB，支持多选)</span></span>',
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
            },
            /**
            *@function
            *@memberOf editHtml
            *@name private$getPreviewUrl
            *@description 获取预览的jsp页面，注意，判断域名是否以dev开头，如果以dev开头，那么就要自动替换成page
            */
            "getPreviewUrl": function() {
                //读取地址栏url
                var url = window.location.toString();
                //获取本jsp的url地址
                //--用变量this.MY.jspFileName和this.MY.jspPath
                //--这个地址合成后，是相对应用根路径的
                var jspUrl = this.MY.jspPath + '/' + this.MY.jspFileName;
                //if(前缀是dev.joinking.com){使用模拟页面模式
                if (url.indexOf(this.param.fixPreviewDomain) >= 0) {
                    //block(块){获取应用名称
                    //合成正则表达式
                    //--这种情况下域名是固定的，用固定的域名合成正则
                    var exp = /[^\/]+\/([^\/]+)\//i;
                    //取出应用前缀
                    var execResult = exp.exec(url);
                    if (execResult == null) {
                        FW.alert("固定前缀url有问题：" + url);
                        return null;
                    }
                    var appPrefix = execResult[1];
                    //合成url并返回
                    var resultUrl = "http://" + this.param.simulationUrl + "/" + appPrefix + "/" + jspUrl;
                    //}
                    //合成url并返回
                    return resultUrl;
                }
                //}
                //else{使用普通模式
                else {
                    //合成相对路径的url并返回
                    //--相对路径，就是由当前编辑页面，向上走一层到应用根路径
                    var resultUrl = "../" + jspUrl;
                    return resultUrl;
                }
                //}
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf editHtml
            *@name FireEvent$menuSelect
            *@description 点击菜单后的方法
            *@param type toDo
            */
            "menuSelect": function(type) {
                //if(不需要改变){退出
                if (this.MY.type == type) {
                    return;
                }
                //}
                //if (是基本信息){显示基本信息
                if (type == "base") {
                    this.API.private('showOneHTML', this.MY.page.base);
                }
                //}
                //if (是配置){显示配置
                if (type == "cfg") {
                    this.API.private('showOneConfig', this.MY.page.cfg);
                }
                //}
                //if(是img){
                if (type == "img") {
                    this.API.private('showImgEditor', this.MY.page.img)
                }
                //}
                //if(是css){
                if (type.indexOf("css") == 0 && type.length > 3) {
                    this.MY.type = type;
                    var fileKey = type.substr(4);
                    var fileName = this.MY.page.css[fileKey];
                    if (fileName == null) {
                        FW.alert("样式文件：" + fileKey + "未找到");
                    }
                    if (this.MY.page.cfg) {
                        for (var n in this.MY.page.cfg) {
                            fileName = fileName.replace(n, this.MY.page.cfg[n]);
                        }
                    }
                    this.API.private('openCreator', "css", fileName);
                }
                //}
                //if(是js){
                if (type.indexOf("js") == 0 && type.indexOf("jsp") != 0 && type.length > 2) {
                    this.MY.type = type;
                    var fileKey = type.substr(3);
                    var fileName = this.MY.page.js[fileKey];
                    if (fileName == null) {
                        FW.alert("脚本文件：" + fileKey + "未找到");
                        return;
                    }
                    if (this.MY.page.cfg) {
                        for (var n in this.MY.page.cfg) {
                            fileName = fileName.replace(n, this.MY.page.cfg[n]);
                        }
                    }
                    this.API.private('openCreator', "js", fileName);
                }
                //}
                //if (是jsp){
                if (type.indexOf("jsp.") == 0) {
                    this.MY.type = type;
                    var fileKey = type.substr(4);
                    var fileName = this.MY.page.jsp[fileKey];
                    if (fileName == null) {
                        FW.alert("脚本文件：" + fileKey + "未找到");
                        return;
                    }
                    if (this.MY.page.cfg) {
                        for (var n in this.MY.page.cfg) {
                            fileName = fileName.replace(n, this.MY.page.cfg[n]);
                        }
                    }
                    this.API.private('showCtr', false);
                    this.API.private('openCreator', "html", fileName);
                }
                //}
                //if (是gadget){
                if (type.indexOf("gadget.") == 0) {
                    this.MY.type = type;
                    var fileKey = type.substr(7);
                    var fileName = this.MY.page.gadget[fileKey];
                    if (fileName == null) {
                        FW.alert("脚本文件：" + fileKey + "未找到");
                        return;
                    }
                    if (this.MY.page.cfg) {
                        for (var n in this.MY.page.cfg) {
                            fileName = fileName.replace(n, this.MY.page.cfg[n]);
                        }
                        fileName += ".js";
                    }
                    this.API.private('showCtr', false);
                    this.API.private('openCreator', "gadget", fileName);
                }
                //}
                //if (是gadget){
                if (type.indexOf("rs.") == 0) {
                    this.MY.type = type;
                    var fileKey = type.substr(3);
                    var fileName = this.MY.page.rs[fileKey];
                    if (fileName == null) {
                        FW.alert("脚本文件：" + fileKey + "未找到");
                        return;
                    }
                    if (this.MY.page.cfg) {
                        for (var n in this.MY.page.cfg) {
                            fileName = fileName.replace(n, this.MY.page.cfg[n]);
                        }
                        fileName += ".js";
                    }
                    this.API.private('showCtr', true);
                    this.API.private('openCreator', "rs", fileName);
                }
                //}
                //if (是tpl){
                if (type.indexOf("tpl.") == 0) {
                    this.MY.type = type;
                    var fileArr = type.split(".");
                    if (fileArr.length != 3) {
                        return;
                    }
                    var fileKey = fileArr[2];
                    var fileName = this.MY.page.tpl[fileArr[1]][fileKey];
                    if (fileName == null) {
                        FW.alert("脚本文件：" + fileKey + "未找到");
                        return;
                    }
                    if (this.MY.page.cfg) {
                        for (var n in this.MY.page.cfg) {
                            fileName = fileName.replace(n, this.MY.page.cfg[n]);
                        }
                    }
                    this.API.private('showCtr', true);
                    this.API.private('openCreator', "html", fileName);
                }
                //}
                //if(处理servicedata){解析servciedata的选择，并进行跳转，用js编辑器
                if (type.indexOf("servicedata") == 0) {
                    this.MY.type = type;
                    var fileKey = type.substr(12);
                    var fileKeyArr = fileKey.split('.');
                    var lastFileNameArr = [];
                    lastFileNameArr[1] = fileKeyArr.pop();
                    lastFileNameArr[0] = fileKeyArr.pop();

                    var fileName = this.MY.page.servicedata[fileKeyArr.join('.')];
                    if (fileName == null) {
                        FW.alert("脚本文件：" + fileKeyArr.join('.') + "未找到");
                        return;
                    }
                    fileName = fileName[lastFileNameArr.join('.')];
                    if (fileName == null) {
                        FW.alert("脚本文件：" + fileKey + "未找到");
                        return;
                    }
                    if (this.MY.page.cfg) {
                        for (var n in this.MY.page.cfg) {
                            fileName = fileName.replace(n, this.MY.page.cfg[n]);
                        }
                    }
                    this.API.private('openCreator', "js", fileName);
                }
                //}
            },
            /**
            *@function
            *@memberOf editHtml
            *@name FireEvent$saveCfg
            *@description 保存配置信息
            */
            "saveCfg": function() {
                //block(jquery each){便利表单直接保存
                var result = {};
                var lastName = "--";
                $("#cfgForm").find("input").each(function() {
                    if (this.name == "name") {
                        lastName = this.value;
                    } else {
                        result[lastName] = this.value;
                    }
                });
                //}
                //保存结果
                this.MY.page.cfg = result;
                alert("保存成功");
                //修改基本信息
                this.MY.page.base = this.MY.page.base.replace(/<!--@config@[^-]+-->/i,
                function() {
                    return "<!--@config@" + FW.use().toJSONString(result) + "-->"
                });
            },
            /**
            *@function
            *@memberOf editHtml
            *@name FireEvent$addCfg
            *@description 添加新的配置信息
            */
            "addCfg": function() {
                //添加配置信息
                this.MY.page.cfg.newName = "填写新的值";
                //重新显示
                this.API.private('showOneConfig', this.MY.page.cfg);
                var newcfg = this.MY.page.cfg;
                //修改基本信息
                this.MY.page.base = this.MY.page.base.replace(/<!--@config@[^-]+-->/i,
                function() {
                    return "<!--@config@" + FW.use().toJSONString(newcfg) + "-->"
                });
            },
            /**
            *@function
            *@memberOf editHtml
            *@name FireEvent$delCfg
            *@description 删除配置
            *@param pid pid
            */
            "delCfg": function(pid) {
                //删除内存
                var cfg = this.MY.page.cfg;
                delete cfg[pid];
                this.API.private('showOneConfig', this.MY.page.cfg);
                var newCfg = this.MY.page.cfg;
                //修改基本信息
                this.MY.page.base = this.MY.page.base.replace(/<!--@config@[^-]+-->/i,
                function() {
                    return "<!--@config@" + FW.use().toJSONString(newCfg) + "-->"
                });
            },
            /**
            *@function
            *@memberOf editHtml
            *@name FireEvent$saveHTML
            *@description 将内容保存起来
            */
            "saveHTML": function() {
                this.API.private('saveHTML');
            },
            /**
            *@function
            *@memberOf editHtml
            *@name FireEvent$hideCtr
            *@description 响应页面上的事件，隐藏所有控制内容
            */
            "hideCtr": function() {
                //调用私有隐藏方法，进行隐藏
                this.API.private('showCtr', false);
            },
            /**
            *@function
            *@memberOf editHtml
            *@name FireEvent$showCtr
            *@description 在页面上显示控制台
            */
            "showCtr": function() {
                //调用私有的showCtr方法实现
                this.API.private('showCtr', true);
            },
            /**
            *@function
            *@memberOf editHtml
            *@name FireEvent$preview
            *@description 预览页面，调用私有的getPreview方法获取预览url，然后页面跳转过去
            */
            "preview": function() {
                //调用私有的getPreviewUrl获取预览地址
                var url = this.API.private('getPreviewUrl');
                //用window.open打开新地址
                if (url == null) {
                    return;
                }
                window.open(url);
            }
        }
    });
    return FW;
});