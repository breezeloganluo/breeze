/**
* @namespace
* @name editGadgetTest 
* @version 0.01 罗光瑜 初始版本
* @description  gadget单元测试类的配套gadget                                
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./gadgettestMod");
    require("./fileselect");
    require("./textMod");
    FW.register({
        "name": "editGadgetTest",
        "param": {
            /**
            *@memberOf editGadgetTest
            *@name fileUrl
            *@description 构造的模板
            */
            "fileUrl": "./manager_auxiliary/template/templateTestJs.js"
        },
        /**
        *@function
        *@memberOf editGadgetTest
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
                view: {}
            }
            this.MY.fileSelect = FW.createApp("fileselect", "fileselect", pageParam);
            //创建gadgettestMod
            this.MY.textParser = FW.createApp("gadgettestMod", "gadgettestMod", this);
            //创建textmod
            this.MY.testMod = FW.createApp("textMod", "textMod", this);
            //显示主体
            this.showBaseListByUrl();
            //定义初始代码
            var _default = " //模拟桩\r\n";
            _default += "FW.regAPI({\r\n";
            _default += "   doServer: function($service, $package, $parram, $callback) {\r\n";
            _default += "       return {\r\n";
            _default += "           data:[{\"alias\":\"loanpupose\"}],\r\n";
            _default += "           code:0\r\n";
            _default += "       }\r\n";
            _default += "   },\r\n";
            _default += "   show:function(view,data){\r\n";
            _default += "       if (view == \"view_publicLoan\"){\r\n";
            _default += "           JSTest.assertEquals(200,data.loanlimit[1],\"检查借款限额\");\r\n";
            _default += "       }\r\n";
            _default += "   }\r\n";
            _default += "});\r\n";
            _default += "//初始输入\r\n";
            _default += "var pageParam = {\r\n";
            _default += "   id: 'TEST',\r\n";
            _default += "   dom: $(document.body),\r\n";
            _default += "   param: {\r\n";
            _default += "       who:\"im test\"\r\n";
            _default += "   }, //实际的参数\r\n";
            _default += "   view: {} //实际的视图内容\r\n";
            _default += "}\r\n";
            _default += "//运行\r\n";
            _default += "app = FW.createApp(\"myapp\", \"1-5\", pageParam);\r\n";
            this.MY.defaultCode = _default;
        },
        "public": {
            /**
            *@function
            *@memberOf editGadgetTest
            *@name public$showBaseListByUrl
            *@description 根据页面的url查询并显示基本列表页面
            */
            "showBaseListByUrl": function() {
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
                //}
                //调用contructHtmlText去解析结构
                this.API.private('constructUnitTest', text);
                //显示菜单
                this.API.private("showMenu");
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name public$saveFile
            *@description 保存测试用例到文件中
            */
            "saveFile": function() {
                //读取url地址 将文件保存在url地址中
                var fileUrl = FW.use().getParameter("fileUrl");
                if (fileUrl == null) {
                    alert("保存文件未定义");
                } else {
                    var fileArr = fileUrl.split("/");
                    var fileName = fileArr.pop();
                    var fileDir = "/" + fileArr.join("/");
                    var openFileName = this.MY.fileSelect.getFileName();
                    var openPath = this.MY.fileSelect.getPath();
                    this.MY.requirePath = openPath + "/" + openFileName;
                    this.MY.testName = openFileName.replace(".js", "");
                    this.MY.fileSelect.setFileName(fileName);
                    var jsFile = this.MY.textParser.createText(this.MY.contruct.testBody);
                    jsFile = jsFile.replace(/\/.*servicegadget/i, "servicegadget");
                    this.MY.fileSelect.setPath(fileDir);
                    this.MY.fileSelect.saveFile(jsFile);
                    this.MY.fileSelect.setFileName(openFileName);
                    this.MY.fileSelect.setPath(openPath);
                }
            }
        },
        "private": {
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$constructUnitTest
            *@description 解析文本，并根据被侧类来整合测试方法。
            *将结果类结构，保存到[MY.contruct]中
            *@param inText 输入的文本
            */
            "constructUnitTest": function(inText) {
                var fileDir = null;
                var fileName = null;
                //调用gadgettestMod解析
                this.MY.contruct = this.MY.textParser.createTestMod(inText);
                //if(解析为空值){用url找被测试类
                if (this.MY.contruct == null) {
                    //通过url获取本文件名和路径
                    var fileUrl = FW.use().getParameter("fileUrl");
                    //根据规则获取被测路径名和gadget名
                    if (fileUrl != null) {
                        var fileArr = fileUrl.split("/");
                        fileName = fileArr.pop();
                        var needChange = fileName.substr(0, 5);
                        var goToChange = needChange.replace("Test", "").toLowerCase();
                        fileName = fileName.replace(needChange, goToChange);
                        fileDir = "/" + fileArr.join("/");
                        fileDir = fileDir.replace("testgadget", "servicegadget");
                    }
                }
                //}
                //else if(不为空){通过解析类找被侧gadget
                else if (this.MY.contruct != null) {
                    //根据测试结构获取被测gadget名和路径
                    fileDir = this.MY.contruct.testPath;
                    fileDir = fileDir.replace("/" + this.MY.contruct.testName, "");
                    fileDir = fileDir.replace(".js", "");
                    fileName = this.MY.contruct.testName + ".js";
                }
                //}
                //调用textmod，解析被侧gadget结构
                this.MY.fileSelect.setFileName(fileName);
                this.MY.fileSelect.setPath(fileDir);
                var text = this.MY.fileSelect.queryFileContent();
                if (text == null) {
                    alert("被测文件不存在！");
                    return;
                }
                var textModContent = this.MY.testMod.createClassMod(text);
                //block(块){将被测函数整合到测试函数中
                //if(测试类不存在){创建空类
                if (this.MY.contruct == null) {
                    //创建空的测试类
                    this.MY.contruct = {};
                }
                //}
                if (typeof textModContent.param == "undefined" || typeof textModContent.param.classStruct == "undefined" || typeof textModContent.param.classStruct.functionFragment == "undefined") {
                    return;
                }
                this.MY.contruct.testBody = this.MY.contruct.testBody || [];
                //while(所有被测函数){整合到测试类中
                for (var i in textModContent.param.classStruct.functionFragment) {
                    //获取被侧函数
                    var fun = textModContent.param.classStruct.functionFragment[i];
                    //如果测试类没这个函数就加入到测试类中
                    var inside = false;
                    for (var j = 0; j < this.MY.contruct.testBody.length; j++) {
                        for (var k in this.MY.contruct.testBody[j]) {
                            if (k == fun.name) {
                                inside = true;
                            }
                        }
                    }
                    if (!inside) {
                        var newBody = {};
                        newBody[fun.name] = [];
                        this.MY.contruct.testBody.push(newBody);
                    }
                }
                //}
                //}
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$showMenu
            *@description 根据内存结构，显示左侧菜单
            *[MY.contruct]
            *[view.menu]
            */
            "showMenu": function() {
                //显示缓存中的数据
                this.API.show("menu", this.MY.contruct.testBody, "menuTarget");
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$showTestList
            *@description 显示测试列表页面
            *[view.list]
            *被左边菜单点击事件使用
            *@param oneFunInfo 一个测试函数的整体信息
            */
            "showTestList": function(oneFunInfo) {
                this.API.show("list", oneFunInfo, "listTarget");
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$showAddNewCase
            *@description 显示添加新case页面
            */
            "showAddNewCase": function() {
                this.API.show("case", null, "listTarget");
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$deleteOneCase
            *@description 删除一个case
            *[MY.contruct]
            *@param functionName 函数名
            *@param caseName case名，就是sig
            */
            "deleteOneCase": function(caseName) {
                //根据记录信息读取方法
                var fun = this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName];
                //遍历查找需要删除的用例并删除
                outer: for (var i = 0; i < fun.length; i++) {
                    for (var j in fun[i]) {
                        if (j == caseName) {
                            delete this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][i][j];
                            break outer;
                        }
                    }
                }
                //重新根据记录选择body下标和方法名显示case列表
                this.API.private("showTestList", this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName]);
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$addNewCase
            *@description 添加新case
            *FireEvent传入的是case的整体对象，即表单对象
            *@param caseObj case对象
            */
            "addNewCase": function(caseObj) {
                //添加临时代码
                for (var i in caseObj) {
                    caseObj[i].content = this.MY.defaultCode;
                }
                //保存新测试用例描述信息
                this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName].push(caseObj);
                //调用保存代码
                this.saveFile();
                //重新显示测试用例列表
                this.API.private("showTestList", this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName]);
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$updateCase
            *@description 修改case
            *FireEvent传入的是case的整体对象，即表单对象
            *@param caseObj case对象
            */
            "updateCase": function(caseObj) {
                //添加临时代码
                for (var i in caseObj) {
                    for (var j = 0; j < this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName].length; j++) {
                        if (this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][j][i]) {
                            this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][j][i].title = caseObj[i].title;
                            this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][j][i].desc = caseObj[i].desc;
                            this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][j][i].simulation = caseObj[i].simulation;
                            this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][j][i].input = caseObj[i].input;
                            this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][j][i].assert = caseObj[i].assert;
                        }
                    }
                }
                //调用保存代码
                this.saveFile();
                //重新显示测试用例列表
                this.API.private("showTestList", this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName]);
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$getCaseData
            *@description
            *@param dom 节点
            */
            "getCaseData": function(dom) {
                var data = {};
                var _dom = $(dom).parent();
                var name = $(_dom).find("input[name='name']").val().trim();
                if (name == null || name == "") {
                    alert("名称不可以为空");
                    return null;
                }
                if (!/[0-9a-zA-Z]*/.test(name)) {
                    alert("名称只能由英文字母和数字组成");
                    return null;
                }
                data.title = $(_dom).find("input[name='title']").val().trim();
                if (data.title == null || data.title == "") {
                    alert("测试标题不可以为空");
                    return null;
                }
                data.desc = $(_dom).find("textarea[name='desc']").val().trim();
                if (data.desc == null || data.desc == "") {
                    alert("测试描述不可以为空");
                    return null;
                }
                data.simulation = $(_dom).find("textarea[name='simulation']").val().trim();
                if (data.simulation == null || data.simulation == "") {
                    alert("模拟描述不可以为空");
                    return null;
                }
                data.input = $(_dom).find("textarea[name='input']").val().trim();
                if (data.input == null || data.input == "") {
                    alert("输入项描述不可以为空");
                    return null;
                }
                data.assert = $(_dom).find("textarea[name='assert']").val().trim();
                if (data.assert == null || data.assert == "") {
                    alert("校验内容描述不可以为空");
                    return null;
                }
                var _data = {};
                _data[name] = data;
                return _data;
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$showCode
            *@description 显示单个case的Code视图
            *[MY.contruct]
            *@param caseName 用例名称
            *@param caseNumber 用例下标
            */
            "showCode": function(caseName, caseNumber) {
                //记录测试用例名称
                this.MY.selectedCaseName = caseName;
                //记录测试用例下标
                this.MY.selectedCaseNumber = caseNumber;
                //显示代码内容
                var content = this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][caseNumber][caseName].content;
                this.API.show("code", null, "listTarget");
                var code_panel = $("#infoForm")[0];

                code_panel.value = content || this.MY.defaultCode;
                var editor = CodeMirror.fromTextArea(code_panel, {
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: "text/javascript",
                    smartIndent: true,
                    height: "800px",
                    autoMatchParens: true
                });
                this.API.private("bindEditorEvent", editor);

                code_panel.getValue = function() {
                    return editor.getValue();
                }
                code_panel.setValue = function(v) {
                    editor.setValue(v);
                }
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$saveOneCode
            *@description 保存单个case的函数代码
            */
            "saveOneCode": function() {
                var openDom = $("#infoForm");
                var code = openDom[0].getValue();
                this.MY.contruct.testBody[this.MY.selectedBodyNumber][this.MY.selectedFunctionName][this.MY.selectedCaseNumber][this.MY.selectedCaseName].content = code;
                this.saveFile();
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name private$bindEditorEvent
            *@description 绑定tab事件
            *@param editor
            */
            "bindEditorEvent": function(editor) {
                _this = this;
                editor.on("keydown",
                function(Editor, Eevent) {
                    if (83 == Eevent.keyCode) {
                        if (Eevent.ctrlKey || Eevent.altKey) {
                            _this.saveFile();
                        }
                    }
                });
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf editGadgetTest
            *@name FireEvent$menuSelect
            *@description 左边菜单的点击事件，选择某个函数的所有测试用例
            *@param dom 事件节点
            *@param bodyNumber 存放下标
            *@param functionName 方法名
            */
            "menuSelect": function(dom, bodyNumber, functionName) {
                //处理选中状态
                $(dom).parent().find("i").attr("class", "icon-remove~");
                $(dom).parent().find(".tree-selected").removeClass("tree-selected").addClass("tree-item-item");
                $(dom).find("i").attr("class", "icon-ok");
                $(dom).attr("class", "tree-item tree-selected");
                //记录当前选中body的下标
                this.MY.selectedBodyNumber = bodyNumber;
                //记录当前选中的方法名
                this.MY.selectedFunctionName = functionName;
                //若case为空则跳转到添加case页面 
                if (this.MY.contruct.testBody[bodyNumber][functionName].length <= 0) {
                    this.API.private("showAddNewCase");
                } else {
                    this.API.private("showTestList", this.MY.contruct.testBody[bodyNumber][functionName]);
                }
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name FireEvent$deleteCase
            *@description 删除一个case
            *@param sigName 用例标识
            */
            "deleteCase": function(sigName) {
                this.API.private("deleteOneCase", sigName);
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name FireEvent$showAddNewCase
            *@description 显示测试用例添加页面
            */
            "showAddNewCase": function() {
                this.API.private("showAddNewCase");
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name FireEvent$addNewCase
            *@description 页面表单的传入的新case保存起来，调用私有方法实现，
            *保存完要save
            *@param dom 节点
            */
            "addNewCase": function(dom) {
                //获取页面数据  组装成指定格式 放入缓存中
                var data = this.API.private("getCaseData", dom);
                if (data == null) {
                    return;
                }
                this.API.private("addNewCase", data);
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name FireEvent$updateCase
            *@description 页面表单的传入的新case保存起来，调用私有方法实现，
            *保存完要save
            *@param dom 节点
            */
            "updateCase": function(dom) {
                //获取页面数据  组装成指定格式 放入缓存中
                var data = this.API.private("getCaseData", dom);
                if (data == null) {
                    return;
                }
                this.API.private("updateCase", data);
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name FireEvent$showCode
            *@description 显示代码部分
            *@param caseName 用例名称
            *@param caseNumber 用例下标
            */
            "showCode": function(caseName, caseNumber) {
                this.API.private("showCode", caseName, caseNumber);
            },
            /**
            *@function
            *@memberOf editGadgetTest
            *@name FireEvent$saveCode
            *@description 页面点击的保存事件
            */
            "saveCode": function() {
                this.API.private("saveOneCode");
            }
        }
    });
    return FW;
});