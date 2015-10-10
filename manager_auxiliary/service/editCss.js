/**
* @namespace
* @name editCss 
* @version 0.01 罗光瑜 2015-05-01初始化
* @description  编辑html的gadget                            
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./fileselect");
    FW.register({
        "name": "editCss",
        "param": {
            /**
            *@memberOf editCss
            *@name fileUrl
            *@description 默认的模板
            */
            "fileUrl": "./manager_auxiliary/template/templateCSS.css",
            /**
            *@memberOf editCss
            *@name maskid
            *@description 蒙版层的id
            */
            "maskid": "mask"
        },
        /**
        *@function
        *@memberOf editCss
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

            this.MY.fileSelect = FW.createApp("fileselect", "fileselect", pageParam);
            //读取文件
            this.showPageFromUrl();
        },
        "public": {
            /**
            *@function
            *@memberOf editCss
            *@name public$showPageFromUrl
            *@description 1.根据url读取文件
            *2.将文件显示到指定的页面上
            *[this.MY.url]记录要保存的url
            *[this.MY.page]=文本内容
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
                this.API.private('contructCssText', text);
                //调用showStruct去将内容显示到页面上
                this.API.private('showOneCss');
            }
        },
        "private": {
            /**
            *@function
            *@memberOf editCss
            *@name private$bindEditorEvent
            *@description 给一个编辑器绑定对应的事件
            *@param editor 编辑器对象
            */
            "bindEditorEvent": function(editor) {
                _this = this;
                //block(块){初始化提示内存信息
                //设定block内容
                this.MY.tips = {

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
                    }
                }
                //}
                //处理提示框是否隐形
                if (this.MY.parent) {
                    $("#tipsContain").hide();
                }
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
                            var execResult = /(\{[\w\s-;:]+)$/i.exec(leftLine);
                            //if (是<xx){标签名
                            if (execResult != null) {
                                domain = "style";
                                dealWord = execResult[1];
                                execResult = /[\w-]+$/i.exec(leftLine);
                                if (execResult != null) {
                                    dealWord = execResult[0];
                                }
                            }
                            //}
                            //else if (gadget声明){
                            if (dealWord == null) {
                                execResult = /<!--@(\w+)$/i.exec(leftLine);
                                if (execResult != null) {
                                    domain = "gadget";
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
                            _this.API.private('saveCSS');
                        }
                    }
                });
            },
            /**
            *@function
            *@memberOf editCss
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
            *@memberOf editCss
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
                else if ("attrName" == domain || "attrValue" == domain || "style" == domain || "template" == domain) {
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
                    return result;
                }
                //}
                //else if (seajs){
                else if ("seajs" == domain) {
                    var result = "seajs.config({\nbase: '${B}'\n});\nseajs.use(['/servicegadget/xxx/yyy'], function(a) {\na.go('${S}');\nwindow.FW = a;\n});";
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
            *@memberOf editCss
            *@name private$contructCssText
            *@description 这个页面根据传入的html文本，将构造内存的结构类
            *构造的类结构参照：
            *构造的类结构，参见showPageFromUrl方法
            *@param cssText html文本
            *@return 构造好的内存结构
            */
            "contructCssText": function(cssText) {
                //设置基本内容
                this.MY.page = cssText;

                return this.MY.page;
            },
            /**
            *@function
            *@memberOf editCss
            *@name private$showOneCss
            *@description 根据样式文本，显示文本内容
            */
            "showOneCss": function() {
                var showText = this.MY.page;
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
            },
            /**
            *@function
            *@memberOf editCss
            *@name private$saveCSS
            *@description 保存css文件
            */
            "saveCSS": function() {
                //读取html内容
                var code_panel = this.API.find("#infoForm")[0];
                var css = code_panel.getValue();
                //重新解析
                this.API.private('contructCssText', css);

                this.MY.fileSelect.saveFile(css);
                alert("文件保存成功");
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf editCss
            *@name FireEvent$saveCSS
            *@description 将内容保存起来
            */
            "saveCSS": function() {
                this.API.private('saveCSS');
            }
        }
    });
    return FW;
});