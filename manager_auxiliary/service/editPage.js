/**
* @namespace
* @name editPage 
* @description  undefined 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./fileselect");
    FW.register({
        "name": "editPage",
        "param": {
            /**
            *@memberOf editPage
            *@name helperId
            *@description 辅助接点id
            */
            "helperId": "helper",
            /**
            *@memberOf editPage
            *@name fileUrl
            *@description 文件路径
            */
            "fileUrl": "manager_auxiliary/template/template1.html"
        },
        /**
        *@function
        *@memberOf editPage
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {
            //创建文件对象
            var pageParam = {
                id: 'fileselect',
                dom: this.dom,
                param: {
                    viewid: null
                },
                //实际的参数
                view: {}
                //实际的视图内容
            }
            this.MY.fileSelect = FW.createApp("fileselect", "fileselect", pageParam);
            var fileUrl = FW.use().getParameter("fileUrl");
            //读取文件
            this.load4file(fileUrl);
        },
        "public": {
            /**
            *@function
            *@memberOf editPage
            *@name public$showObj
            *@description 显示页面布局以及对应内容
            *注意，这里，行列有对应的id关系，其dom表单的id和内部显示对象有直接关联关系，其关系为
            *o[1][2]等等
            *@param objid 可选参数，不填显示全部，填写行则显示一样，填写列则显示一列
            */
            "showObj": function(objid) {
                //处理baseid；
                this.MY.showObj.baseId = "";
                //显示全部
                this.API.show("layout", this.MY.showObj, "spanContain");
                //设定动态效果
                $('.widget-container-span').sortable({
                    connectWith: '.widget-container-span',
                    items: '> .widget-box',
                    opacity: 0.8,
                    revert: true,
                    forceHelperSize: true,
                    placeholder: 'widget-placeholder',
                    forcePlaceholderSize: true,
                    tolerance: 'pointer'
                });
                $('.widget-container-span').sortable({
                    connectWith: '.widget-container-span',
                    items: '> .widget-box',
                    opacity: 0.8,
                    revert: true,
                    forceHelperSize: true,
                    placeholder: 'widget-placeholder',
                    forcePlaceholderSize: true,
                    tolerance: 'pointer'
                });

                $(".widget-box").mouseover(function() {
                    if (this.status != "edit") {
                        $(this).find(".widget-header").show();
                        $(this).removeClass("transparent");
                    }

                });
                $(".widget-box").mouseout(function() {
                    $(this).find(".widget-header").hide();
                    $(this).addClass("transparent");
                });
                //绑定初始化编辑器
                $(".widget-edit").each(function() {
                    var code_panel = $(this).find(".editor")[0];
                    var editor = CodeMirror.fromTextArea(code_panel, {
                        lineNumbers: true,
                        matchBrackets: true,
                        mode: "text/javascript",
                        smartIndent: true,
                        height: "800px",
                        autoMatchParens: true
                    });
                    code_panel.getValue = function() {
                        return editor.getValue();
                    }
                    code_panel.setValue = function(v) {
                        editor.setValue(v);
                    }
                    code_panel.editor = editor;
                });
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$closeEdit
            *@description 关闭处于编辑状态的widget
            *@param dom widget-box的那个标签dom
            */
            "closeEdit": function(dom) {
                //修改箭头
                dom.find(".icon-chevron-down").attr("class", "icon-chevron-up")
                //隐藏编辑框
                dom.find(".widget-edit-position").hide();
                $(".widget-edit").hide();
                //修改内存
                this.MY.currEdit = null;
                dom[0].status = null;
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$getEditObjStrt
            *@description 获取这个对象编辑状态的值
            *@param showObj showObj
            *@return 编辑状态的编辑字符串
            */
            "getEditObjStrt": function(showObj) {
                //if(静态内){直接返回
                if (showObj.type == 0) {
                    //直接返回内容
                    return showObj.content;
                }
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$setEditObjStrt
            *@description toDo
            *@param showObj 显示对象
            *@param valStr 显示的字符串
            */
            "setEditObjStrt": function(showObj, valStr) {
                //if(静态html情况){直接设置
                if (showObj.type == 0) {
                    //直接设置
                    showObj.content = valStr;
                }
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$showLayout
            *@description 根据系统的选项判断，是否显示布局信息
            */
            "showLayout": function() {
                //获取选项状态标签
                var operDom = $("#displayLayout")[0];
                //if(选中布局控制器){显示布局
                if (operDom.checked) {
                    //设置为边框
                    $(".widget-container-span").addClass("redborder");
                }
                //}
                //else{取消布局
                else {
                    //取消边框
                    $(".widget-container-span").removeClass("redborder");
                }
                //}
                //获取选项状态标签
                operDom = $("#displayRowCtr")[0];
                //if(选中行控制器){显示行控制器
                if (operDom.checked) {
                    //block(块){设置显示行控制器
                    //获取根节点
                    var allCtrRow = $("#spanContain > .row-fluid > .rowControl");
                    //block(each){显示每一个第一层
                    allCtrRow.each(function() {
                        //显示自己
                        $(this).show();
                        $(this).css("width", $(this).parents(".row-fluid").css("width"));
                        //将内层的所有控制器全部隐藏
                        var child = $(this).parent(".row-fluid:first").find(".widget-container-span .rowControl");
                        child.hide();
                    });
                    //}
                    //}
                }
                //}
                //else{取消布局
                else {
                    //取消边框
                    $(".rowControl").hide();
                }
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$addLayout
            *@description 依据外面传入的数组对象，创建一个布局
            *@param layoutSetting 布局数组
            *@return 成功true，失败及布局数据不正确，false
            */
            "addLayout": function(layoutSetting) {
                //检查布局
                var count = 0;
                for (var i = 0; i < layoutSetting.length; i++) {
                    count += parseInt(layoutSetting[i]);
                }
                if (count != 12) {
                    return false;
                }
                //重新解析页面当前最新情况
                var jdom = $("#spanContain");
                this.MY.showObj = this.API.private('parserLine', jdom);
                //创建新布局对象
                var oneLine = [];
                for (var i = 0; i < layoutSetting.length; i++) {
                    var oneCol = [];
                    oneCol.spanx = layoutSetting[i];
                    oneLine.push(oneCol);
                }
                //插入到页面最后
                this.MY.showObj.push(oneLine);
                //显示到页面
                this.showObj();
                this.showLayout();
                //返回值
                return true;
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$moveRow
            *@description 移动行向上或则向下移动行
            *@param rowId 移动行的id
            *@param direction 移动方向-1向前，1向后
            */
            "moveRow": function(rowId, direction, changeObj) {
                //重新获取页面数据
                if (changeObj == null) {
                    var jdom = $("#spanContain");
                    this.MY.showObj = this.API.private('parserLine', jdom);
                    changeObj = this.MY.showObj;
                }
                //block(块){处理是否子递归情况
                //声明备用对象
                //--递进对象
                //--递归对象
                //--递归交换序号
                var nextObj = this.MY.showObj;
                var nextChangeObj = null;
                var nextRowId = null;
                //声明正则
                var reg = /(.+?)(\[\d+\])\.content/ig;
                var regRes = reg.exec(rowId.replace("row", ""));
                //while(正则存在){处理递归对象
                while (regRes != null) {
                    //获取下层递归对象
                    nextChangeObj = eval("(nextObj" + regRes[1] + ")");
                    //获取下层参数值
                    nextRowId = regRes[2];
                    //获取递进对象
                    nextObj = eval("(nextObj" + regRes[0] + ")");
                    //下一次匹配
                    regRes = reg.exec(rowId.replace("row", ""));
                }
                //}
                //}
                //if(需要递归){
                if (nextChangeObj && nextRowId) {
                    this.moveRow(nextRowId, direction, nextChangeObj);
                    return;
                }
                //}
                //获取当前的行值
                var execResult = /\d+/i.exec(rowId);
                if (execResult == null) {
                    alert("行号不正确");
                    return;
                }
                var lid = parseInt(execResult[0]);
                //if(已经在最前但还要向前){对应提示并退出
                if (lid + direction < 0) {
                    //提示并退出
                    alert("已经最上了，不能再移动");
                    return;
                }
                //}
                //else if(已经最后，还要向后){提示并向前
                else if (lid + direction >= changeObj.length) {
                    //提示并退出
                    alert("已经最下面，不能再移动");
                    return;
                }
                //}
                //交换值
                var tmp = changeObj[lid];
                changeObj[lid] = changeObj[lid + direction];
                changeObj[lid + direction] = tmp;
                //重新显示
                this.showObj();
                this.showLayout();
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$parserText
            *@description 从输入参数中读取文件，并解析返回可显示的字符串，同时，将编辑题结构写入this.MY中
            *编辑体结构如下：
            *[
            *  [         //第一行
            *      [    //第一列
            *          {  //第一行第一列的第一个显示实体
            *                   type:0,//0:statichtml 1:gadget 2:jsp include 3:嵌套布局
            *                   content:"不同情况下结构不一样"
            *          }
            *       ]
            *  ]
            *]
            *注意，在列的数组上有一个属性：spanx表示这个列的跨度
            *type=0时
            *content:字符串
            *type=1时
            *content={
            *  name:""//gadget名称
            *  url:"gadget位置"
            *  view:{
            *      "viewid":"view 字符串"
            *  },
            *  tpl:{
            *      "viewid":view的字符串
            *  }
            *}
            *当type=3时
            *content:[]//递归
            *@param text 输入的是要解析的jsp文本
            *@return 用于显示的字符串
            */
            "parserText": function(text) {
                //声明结果变量
                var resultText = null;
                //获取样式
                this.API.private('parserCss', text);
                //去除脚本
                var dealText = this.API.private('removeScript', text);
                //将剩余部分插入标签
                $("#" + this.param.helperId).html(dealText);
                //寻找编辑部分节点
                var dealJDom = $(".span12");
                //if(找不到){提示找不到
                if (dealJDom.length == 0) {
                    //alert提示
                    alert("未找到编辑节点");
                    return null;
                }
                //}
                //else{解析整个文本内容，并记录到this.MY.showObj中
                else {
                    //处理编辑上面找到的编辑部分节点
                    dealJDom = $(dealJDom[0]);
                    dealJDom[0].id = "spanContain";
                    //用分析部分节点，调用行解析，开始分析整个文本变成对象
                    this.MY.showObj = this.API.private('parserLine', dealJDom);
                }
                //}
                //清除所有内容
                dealJDom.html("");
                //获取大的html标签字符串
                resultText = $("#" + this.param.helperId).html();
                //使用后清除
                $("#" + this.param.helperId).html("");
                //返回这个标签
                return resultText;
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$removeRow
            *@description 根据id移除一行
            *@param rowId 对应行的id值
            *@param removeParent 可选，如果删除的是子布局的行，要用到
            */
            "removeRow": function(rowId, removeParent) {
                //重新获取页面数据
                if (removeParent == null) {
                    var jdom = $("#spanContain");
                    this.MY.showObj = this.API.private('parserLine', jdom);
                    removeParent = this.MY.showObj;
                }
                //声明备用对象
                //--递进对象
                //--递归对象
                //--递归交换序号
                var nextObj = this.MY.showObj;
                var nextChangeObj = null;
                var nextRowId = null;
                //声明正则
                var reg = /(.+?)(\[\d+\])\.content/ig;
                var regStr = rowId.replace("row", "");
                var regRes = reg.exec(regStr);
                //while(正则存在){处理递归对象
                while (regRes != null) {
                    //获取下层递归对象
                    nextChangeObj = eval("(nextObj" + regRes[1] + ")");
                    //获取下层参数值
                    nextRowId = regRes[2];
                    //获取递进对象
                    nextObj = eval("(nextObj" + regRes[0] + ")");
                    //下一次匹配
                    regRes = reg.exec(regStr);
                }
                //}
                //if(需要递归){
                if (nextChangeObj && nextRowId) {
                    this.removeRow(nextRowId, nextChangeObj);
                    return;
                }
                //}
                var removeIdx = parseInt(/\d+/i.exec(rowId)[0]);
                removeParent.splice(removeIdx, 1);
                //重新显示
                this.showObj();
                this.showLayout();
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$moveInner
            *@description 真正的移入函数，将外部一行布局，移入到某一个列，并放置到这列的最后
            *@param goid 要移入的那行的id值，其中包含了对象索引信息
            *@param moveinidx 要移入的下一行的索引
            */
            "moveInner": function(goid, moveinidx) {
                //重新将页面信息刷入内存
                var jdom = $("#spanContain");
                this.MY.showObj = this.API.private('parserLine', jdom);
                var row = this.MY.showObj;
                //block(块){获取操作的上层对象
                //准备好本块要处理的参数
                var parentObj = null;
                var myIdx = null;
                //准备使用子行的正则
                var execResult = /(.+)\[(\d+)\]\.content\[0\]/i.exec(goid);
                //if(匹配的上){获取上层和索引
                if (execResult != null) {
                    //eval获取上层对象
                    parentObj = eval("(" + execResult[1] + ")");
                    myIdx = parseInd(execResult[2]);
                }
                //}
                //else{按照第一行直接处理
                else {
                    //直接获取上级对象和索引
                    parentObj = row;
                    myIdx = parseInt(/\d+/i.exec(goid)[0]);
                }
                //}
                //}
                //获取下一行的被插入的列对象
                if (parentObj.length <= myIdx + 1) {
                    alert("没有下一行了，不能移动");
                    return;
                }
                var inserCol = parentObj[myIdx + 1][parseInt(moveinidx)];
                //合成要插入的对象
                var myLine = eval("(" + goid + ")");
                //实现插入动作
                inserCol.push({
                    "type": 3,
                    "content": [myLine]
                });
                //调用函数删除行
                //--原来删除行已经带上显示功能，因此不用显示了
                this.removeRow(goid, row);
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$getShowObjStrt
            *@description 根据不同的对象类型，返回对应使用对象的显示字符串
            *@param showObj 显示对象
            *@param baseId 基础id便于嵌套的递归输出
            *@param subTypeObj 递归时，用的视图名
            *@return 要显示对象的html字符串
            */
            "getShowObjStrt": function(showObj, baseId, subTypeObj) {
                //处理baseId
                if (!baseId) {
                    baseId = "";
                }
                //if(文本类型){处理文本
                if (showObj.type == 0) {
                    //返回文本
                    return showObj.content;
                }
                //}
                //else if(gadget类型){处理gadget类型
                //toDo
                //}
                //else if(jspInclude类型){处理JSPinclude类型
                //toDo
                //}
                //else{嵌套布局
                else {
                    //递归的show可以获取对应的字符串
                    var showContent = showObj.content;
                    showContent.baseId = baseId;
                    return this.API.show(subTypeObj, showContent, "_");
                }
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$save2file
            *@description 将编辑好后的内容保存到文件中
            *这个函数要做两个事情
            *1.要把原来的文件用于编辑的部分找出来
            *2.要根据编辑的结果还原编辑内容然后将其塞入院文件中
            *最后才是保存文件
            *@param srcText 原始的文件文本
            */
            "save2file": function(srcText) {
                //block(块){查找源文件被编辑部分
                //用正则找到标签起始位置
                var reg = /<div[^>]+?span12[^>]+>/i;
                var execResult = reg.exec(srcText);
                if (execResult == null) {
                    alert("执行失败，文本标签未找到匹配编辑文本");
                    return;
                }
                var cIdx = execResult.index + execResult[0].length;
                //获取前半段
                var rsHead = srcText.substring(0, cIdx);
                //获取剩余部分
                var next = srcText.substr(cIdx);
                //预置标签计数器
                var divcount = 0;
                var cEIdx = 0;
                reg = /(<\s*div[^>]*?>)|(<\s*\/\s*div\s*>)/ig;
                //while(计数器为0){不断查找位置
                while (true) {
                    //匹配下一个标签或者闭合标签
                    execResult = reg.exec(next);
                    //if(标签){计数器加1
                    if (execResult[1] != "" && execResult[1] != null) {
                        //计数器加1
                        divcount++;
                    }
                    //}
                    //else if(闭合标签){计数器减1
                    else {
                        //计数器-1
                        divcount--;
                    }
                    //}
                    //判断计数器归0退出
                    if (divcount == -1) {
                        cEIdx = execResult.index;
                        break;
                    }
                }
                //}
                //获取下半段字符串
                var rsEnd = next.substr(cEIdx);
                //}
                //block(块){合成编辑后的字符串
                //重新将页面信息刷入内存
                var jdom = $("#spanContain");
                this.MY.showObj = this.API.private('parserLine', jdom);
                this.showObj();
                //直接通过show方法获取字符串
                //--因为有些时候要区分是在保存文件还是普通的显示，所以这里要加一个全局的变量表示
                this.MY.isSaving = true;
                var editStr = this.API.show("result", this.MY.showObj, "_");
                this.MY.isSaving = false;
                //}
                //block(块){文件保存
                //合成写入文件
                var resultText = rsHead + editStr + rsEnd;
                //保存文件
                this.MY.fileSelect.saveFile(resultText);
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$load4file
            *@description 从页面上加载文件，并显示到页面上
            *@param url 文件的url地址
            */
            "load4file": function(url) {
                //block(块){读取文件
                //读取文件
                var text = null;
                //if (传入的url不为空){获取文件信息
                if (url != null) {
                    var fileArr = url.split("/");
                    var fileName = fileArr.pop();
                    var fileDir = "/" + fileArr.join("/");
                    this.MY.fileSelect.setFileName(fileName);
                    this.MY.fileSelect.setPath(fileDir);
                    text = this.MY.fileSelect.queryFileContent();
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
                //用读取的text内容设置到内存文本内容变量中
                this.MY.fileText = text;
                //}
                //block(块){文本解析
                //调用方法进行文本解析
                var displayText = this.parserText(text);
                //}
                //block(块){显示
                //显示到自己的下面
                $("#" + this.id).html(displayText);
                //调用方法显示
                this.showObj(null);
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name public$addNewObj
            *@description 添加一个新的对象，该方法将在第一行的第一列最后面添加一个新的对象元素，并且显示到页面上
            *对象的类型结构说明，请参见parserText说明
            *@param addingObj 被加入的对象，如果没有，则加入默认的对象
            */
            "addNewObj": function(addingObj) {
                //获取页面上对象编辑区的容器对象
                var jdom = $("#spanContain");
                //重新解析页面对象
                this.MY.showObj = this.API.private('parserLine', jdom);
                //声明创建对象
                var oneObj = null;
                //if(参数传入为空){创建默认对象
                if (addingObj == null) {
                    //创建一个将要被创建的页面对象
                    var oneObj = {
                        "type": 0,
                        "content": "这是新建的html内容，可以编辑修改"

                    };
                }
                //}
                //else{参数传入的对象就是要创建的对象
                else {
                    //将参数传入对象赋值给要创建对象
                    oneObj = addingObj;
                }
                //}
                //将被创建对象加到第一行第一列后
                this.MY.showObj[0][0].push(oneObj);
                //显示到页面上
                this.showObj();
                this.showLayout();
            }
        },
        "private": {
            /**
            *@function
            *@memberOf editPage
            *@name private$removeScript
            *@description 简单过滤文件，将文件中的多余标签去除，如脚本，jsp脚本
            *返回过滤后脚本
            *@param jspStr jsp文件
            *@return 过滤后的字符串
            */
            "removeScript": function(jspStr) {
                //去除jsp脚本部分
                jspStr = jspStr.replace(/<%[^=][\s\S]+?%>/ig, "");
                //去除html标签
                jspStr = jspStr.replace(/<[\/\s]?html.*?>/ig, "");
                jspStr = jspStr.replace(/<!DOCTYPE.+?>/, "");
                //去除整个head部分
                jspStr = jspStr.replace(/<head[\s\S]+?<\/\s*head\s*>/ig, "");
                //去除body标签
                jspStr = jspStr = jspStr.replace(/<\/?\s*body.*?>/ig, "");
                //去除脚本语句
                jspStr = jspStr.replace(/<script[\s\S]+?((<\/\s*script\s*>)|(\/\s*>))/ig, "");
                //返回
                return jspStr;
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$parserHtml
            *@description 解析html的体对象
            *@param jdom 要解析的对象dom
            *@return 单个html对象
            */
            "parserHtml": function(jdom) {
                //获取内部的html并返回
                var result = jdom.prop('outerHTML');
                return {
                    "type": 0,
                    "content": result
                };
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$parserGadget
            *@description 解析gadget对象
            *@param jdom gadget对象dom
            *@return gadget的显示对象
            */
            "parserGadget": function(jdom) {
                //toDo
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$parserJSPInclude
            *@description 解析jsp的包含对象类
            *@param jdom html dom
            *@return jsp的包含对象类
            */
            "parserJSPInclude": function(jdom) {
                //toDo
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$parserSublayout
            *@description 解析子分类
            *@param jdom 解析子分类
            *@return 子分类的显示对象
            */
            "parserSublayout": function(jdom) {
                //创建结果对象
                var result = {
                    "type": 3
                }
                //递归，重新解析儿子
                result.content = [this.API.private('parserColumn', jdom)];
                return result;
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$parserColumn
            *@description 解析列，将每一列解析出来,当前的列是列的那个dom
            *@param jdom 对应列的dom
            *@return 列里面的所有内容，是一个数组
            */
            "parserColumn": function(jdom) {
                //准备好结果对象
                _this = this;
                var result = [];
                //获取直接直接点
                var children = jdom.children();
                //block(each){提取对象
                children.each(function() {
                    //解析class看看是span几
                    var classStr = $(this).attr("class");
                    var spanxArr = /span(\d\d?)/ig.exec(classStr);
                    if (spanxArr == null) {
                        return null;
                    }
                    var spanx = spanxArr[1];
                    //调用parserObj获取对象值
                    var oneRs = _this.API.private('parserPageObj', $(this));
                    oneRs.spanx = spanx;
                    //将该值放入结果对象中
                    oneRs && result.push(oneRs);
                });
                //}
                //返回结果
                return result;
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$parserPageObj
            *@description 解析页面样本内容，该方法已经没有层次递进，只是进行判断，
            *该方法是获取到列里面的其中一个直接子节点的dom
            *如果有FWApp属性，那么就是gadget
            *如果有JSPInclude属性，那么就是jspinclude
            *如果又是清除行的html那么就是嵌套的情况
            *其他的就是普通货色了
            *@param jdom 传入的是spanx对象
            *@return 显示对象数组
            */
            "parserPageObj": function(jdom) {
                //声明结果以及相关常量
                var _this = this;
                var result = [];
                //获取直接直接点
                var children = jdom.children();
                //block(each){遍历每一个
                children.each(function() {
                    //获取每一个儿子
                    var myJdom = $(this);
                    //声明临时结果
                    var oneObj = null;
                    //if (如果是编辑器就跳过){
                    if (myJdom.hasClass("widget-edit")) {
                        //跳过
                        return;
                    }
                    //}
                    //else if(已经widget的情况){从内存中找，直接返回
                    else if (myJdom.hasClass("widget-box")) {
                        //获取对象路径
                        var objExt = myJdom[0].id;
                        var app = _this.MY.showObj;
                        //设置到结果中
                        if (app != null && objExt != null) {
                            oneObj = eval("(" + objExt + ")");

                        }
                    }
                    //}
                    //else if(是gadget){处理gadget
                    else if (myJdom.hasClass("FWApp")) {
                        //调用对应方法，并返回
                        oneObj = _this.API.private('parserHtml', myJdom);
                    }
                    //}
                    //else if(是jspinclude){处理jspinclude
                    else if (myJdom.hasClass("JSPInclude")) {
                        //调用对应的方法并返回
                        oneObj = _this.API.private('parserJSPInclude', myJdom);
                    }
                    //}
                    //else if(是嵌套布局){处理嵌套布局
                    else if (myJdom.hasClass("row-fluid")) {
                        //调用对应的方法
                        oneObj = _this.API.private('parserSublayout', myJdom);
                    }
                    //}
                    //else{静态html情况
                    else {
                        //返回静态的对象
                        oneObj = _this.API.private('parserHtml', myJdom);
                    }
                    //}
                    //增加结果
                    oneObj && result.push(oneObj);
                });
                //}
                //返回结果
                return result;
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$loadCss
            *@description 动态的加载css文件
            *@param src css路径
            */
            "loadCss": function(src) {
                $("<link>").attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: src
                }).appendTo("head");
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$parserCss
            *@description 加载css文件
            *@param text 整个jsp文档
            */
            "parserCss": function(text) {
                //加载的正则匹配
                var reg = /<\s*link.+?href\s*=\s*["']([^"']+)["'].+?>/ig;
                var execArr = reg.exec(text);
                //while(能匹配上){解析每个css
                while (execArr != null) {
                    //获取src和校验
                    if (!/stylesheet/.test(execArr[0])) {
                        execArr = reg.exec(text);
                        continue;
                    }
                    var src = execArr[1];
                    //block(块){排除bootstrap的重复样式
                    if (/assets\/css/i.test(src)) {
                        execArr = reg.exec(text);
                        continue;
                    }
                    if (/codemirror/i.test(src)) {
                        execArr = reg.exec(text);
                        continue;
                    }
                    //}
                    //整理加载路径
                    var src = src.replace("${B}", Cfg.baseUrl);
                    //动态加载css
                    this.this.API.private('loadCss', src);
                    //继续正则匹配下一个
                    execArr = reg.exec(text);
                }
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name private$parserLine
            *@description 解析行，当前在行标签内，就是row-fluid内
            *该方法直接解析标签的儿子就可以了。
            *这个函数被parserText调用，这个函数将返回行对象，而整个对象结构，请参见parserText的说明
            *另外，由于页面的拖动行为，是不会反向通知内存结构的，所以在改变页面结构行为的操作时，比如，创建行，创建列，保存文件等，都会调用该方法，而该方法在这个时候，在解析对象的时候，不会从页面解析，而是根据id到内存中读取内容，直接返回。
            *@param jdom 对应一行的dom
            *@return 一行内的对象
            */
            "parserLine": function(jdom) {
                //准备好结果对象
                var result = [];
                _this = this;
                //获取儿子
                var childeren = jdom.children();
                //block(each){遍历所有儿子并处理
                childeren.each(function() {
                    //提出不是行的情况
                    if (!$(this).hasClass("row-fluid")) {
                        return null;
                    }
                    //调用解析列进行处理
                    var one = _this.API.private('parserColumn', $(this));
                    //加入到结果中
                    one && result.push(one);
                });
                //}
                //返回结果
                return result;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$removeObj
            *@description 删除一个gadget元素
            *@param dom 点击的节点
            */
            "removeObj": function(dom) {
                //移除某个元素
                $(dom).parents(".widget-box:first").remove();
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$setEdit
            *@description 设置是否打开编辑框，原来打开的就关闭原来关闭的就打开
            *@param dom 点击按钮的那个dom
            */
            "setEdit": function(dom) {
                //设置箭头按钮
                var tmpDom = $(dom).children("i");
                //if(上箭头){打开操作
                if (tmpDom.attr("class") == "icon-chevron-up") {
                    //关闭之前的
                    var pre = this.MY.curEdit;
                    if (pre) {

                        this.closeEdit(pre);
                    }
                    //转换箭头
                    tmpDom.attr("class", "icon-chevron-down");
                    //计算坐标
                    $(dom).parents(".widget-box:first").find(".widget-edit-position").show();

                    var top = $(dom).parents(".widget-box:first").find(".widget-edit-position").offset().top;
                    //获取被编辑对象，然后获取其html内容
                    var dataEvalStr = $(dom).parents(".widget-box:first").find(".widget-edit-position")[0].id;
                    var data = this.MY.showObj;
                    var obj = eval("(" + dataEvalStr + ")");
                    var str = this.getEditObjStrt(obj);
                    //获取编辑框
                    var edit = $(".widget-edit");
                    edit.show();
                    var code_panel = edit.find(".editor")[0];
                    code_panel.setValue(str);
                    edit.css("position", "absolute");
                    edit.css("top", top);
                    edit.css("left", "0px");
                    //设置相应状态
                    $(dom).parents(".widget-box:first")[0].status = "edit";
                    //记录当前widgets
                    this.MY.curEdit = $(dom).parents(".widget-box:first")
                }
                //}
                //else{关闭操作
                else {
                    this.closeEdit($(dom).parents(".widget-box:first"));
                }
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$closeEdit
            *@description 事件处理，关闭当前的编辑框
            *@param dom 当前被点击的按钮
            */
            "closeEdit": function(dom) {
                //获取widget-box
                var dd = $(dom).parents(".widget-box:first");
                //调用关闭方法
                this.closeEdit(dd);
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$saveEdit
            *@description 保存编辑框上的内容，并且将代码效果直接刷新到页面上
            *@param dom 按钮所在的dom
            */
            "saveEdit": function(dom) {
                //block(块){获取编辑结果
                //获取codeerdom
                var editor = $(".widget-edit").find(".editor")[0];
                //获取字符串
                var editText = editor.getValue();
                //}
                //获取操作对象
                var data = this.MY.showObj;
                var editStr = $(dom).parents(".widget-edit-position:first")[0].id;
                var editObj = eval("(" + editStr + ")");
                //保存设置
                this.setEditObjStrt(editObj, editText);
                //block(块){刷新内容
                //获取显示字符串
                var showStr = this.getShowObjStrt(editObj);
                //重现刷新内容
                $(dom).parents(".widget-box:first").find(".widget-main").html(showStr);
                //重新定位
                var top = $(dom).parents(".widget-edit-position:first").offset().top;
                var relTop = parseInt(top) + parseInt($(dom).parents(".widget-edit-position:first").css("height"));
                $(".widget-edit").css("top", relTop + "px");
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$cancelMask
            *@description 取消mask
            */
            "cancelMask": function() {
                //取消蒙版
                this.API.unmask();
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$addLayout
            *@description 页面上点击响应添加的点击事件
            */
            "addLayout": function() {
                //获取输入值
                var layoutStr = $("#layoutsetting").val();
                //分解成数组
                var layoutArr = layoutStr.split("+");
                //调用添加布局
                var result = this.addLayout(layoutArr);
                //if(成功){取消蒙版
                if (result) {
                    //取消蒙版
                    this.API.unmask();
                }
                //}
                //else{提示失败
                else {
                    //提示并取消
                    alert('格式不正确');
                    return;
                }
                //}
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$showLayout
            *@description 显示行控制器
            */
            "showLayout": function() {
                //调用方法显示布局
                this.showLayout();
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$addNewShowObj
            *@description 创建新的对象
            */
            "addNewShowObj": function() {
                //调用共有方法实现
                this.addNewObj();
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$openAddLayout
            *@description 打开加入一行的蒙板层
            */
            "openAddLayout": function() {
                //打开蒙版层
                this.API.mask("newLayoutSetting", null, 600, 400);
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$moveUpRow
            *@description 行向上移动
            *@param dom 点击的那个的dom
            */
            "moveUpRow": function(dom) {
                //获取标签id
                var rowId = $(dom).parents(".row-fluid:first")[0].id;
                //调用方法实施移动
                this.moveRow(rowId, -1);
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$moveDownRow
            *@description 向下移动一行
            *@param dom 控制的dom
            */
            "moveDownRow": function(dom) {
                //获取标签id
                var rowId = $(dom).parents(".row-fluid:first")[0].id;
                //调用方法实施移动
                this.moveRow(rowId, 1);
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$goInnerRowCtr
            *@description 显示内层行控制器
            *@param dom 当前行控制器
            */
            "goInnerRowCtr": function(dom) {
                //查找内层
                var ctr = $(dom).parents(".row-fluid:first").find(" > .widget-container-span > .row-fluid > .rowControl");
                if (ctr.length == 0) {
                    alert("没有内层了");
                    return;

                }
                if ($(dom).parents(".rowControl:first")[0] == ctr[0]) {
                    alert("没有内层了");
                    return;
                }
                //隐藏当前层
                $(dom).parents(".rowControl:first").hide();
                //显示内层
                ctr.show();
                ctr.css("width", ctr.parents(".row-fluid:first").css("width"));
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$goOurterRowCtr
            *@description 转外层控制器
            *@param dom 点击的那个按钮dom
            */
            "goOurterRowCtr": function(dom) {
                //查找内层
                var ctr = $(dom).parents(".row-fluid:first").parents(".row-fluid:first").find(" >.rowControl");
                if (ctr.length == 0) {
                    alert("没有外层了");
                    return;

                }
                if ($(dom).parents(".rowControl:first")[0] == ctr[0]) {
                    alert("没有外层了");
                    return;
                }
                //隐藏当前层
                $(dom).parents(".rowControl:first").hide();
                //显示外层
                ctr.show();
                ctr.css("width", ctr.parents(".row-fluid:first").css("width"));
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$removeRow
            *@description 删除一个行
            *@param dom 当前行控制器dom
            */
            "removeRow": function(dom) {
                //获取dom
                var row = $(dom).parents(".row-fluid:first");
                this.removeRow(row[0].id);
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$openMoveInnerSelect
            *@description 弹出选择移入选择器
            *@param dom 行控制器的那个dom
            */
            "openMoveInnerSelect": function(dom) {
                //获取行对象
                //--暂时不支持嵌套内移动
                var nextDom = $(dom).parents(".row-fluid:first").next(".row-fluid");
                if (nextDom.length == 0) {
                    alert("下面没有节点，不能移动");
                    return;
                }

                if ($(dom).parents(".row-fluid")[0] == nextDom[0]) {
                    alert("下面没有节点，不能移动");
                    return;
                }
                nextDom = $(nextDom[0]);
                var colDom = nextDom.children(".widget-container-span");
                var maskData = [];
                colDom.each(function() {
                    var id = this.id;
                    var classStr = $(this).attr("class");
                    maskData.push(/\d+/.exec(classStr)[0]);
                });
                maskData.goId = $(dom).parents(".row-fluid:first")[0].id;
                //打开蒙版
                this.API.mask("moveInnerSelect", maskData, 400, 200);
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$moveInner
            *@description 外部调用接口，用于时间
            *@param goid 要移入的id信息，包含了对象路径
            *@param colIdx 要移入的下一行第几个列
            */
            "moveInner": function(goid, colIdx) {
                //调用函数实现移入
                this.moveInner(goid, colIdx);
                this.API.unmask();
            },
            /**
            *@function
            *@memberOf editPage
            *@name FireEvent$save2file
            *@description 页面事件，保存文件
            */
            "save2file": function() {
                //调用公有方法保存文件
                this.save2file(this.MY.fileText);
            }
        }
    });
    return FW;
});