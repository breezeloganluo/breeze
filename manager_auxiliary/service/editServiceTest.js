/**
* @namespace
* @name editServiceTest 
* @version 0.01 罗光瑜 初始第一个个版本
* @description  这是一个service针对service的单元测试编辑器，这个编辑器实现了service的编辑以及对数据库的导入导出的功能。           
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./fileselect");
    FW.register({
        "name": "editServiceTest",
        "param": {
            /**
            *@memberOf editServiceTest
            *@name fileUrl
            *@description 默认文件url地址
            */
            "fileUrl": "./manager_auxiliary/template/templateTestService.js"
        },
        /**
        *@function
        *@memberOf editServiceTest
        *@name onCreate$onCreate
        *@description
        */
        "onCreate": function() {
            //重新初始化this.MY
            this.MY = {};
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

            this.MY.fileSelect = FW.createApp("fileselect", "fileselect", pageParam);
            //获取目录树对象
            this.MY.treeView = FW.getApp(this.param.treeViewAppid);
            //读取文件
            this.initText();
            this.initShow();
        },
        "public": {
            /**
            *@function
            *@memberOf editServiceTest
            *@name public$initShow
            *@description [功能]在已经获取完文本数据这些都准备好后，进行最原始的显示
            */
            "initShow": function() {
                //显示左边菜单
                this.showMenu(this.MY.content);
                //显示最基本的右边内容
                this.showBase();
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name public$initText
            *@description [功能]根据url的hash中的参数读取测试文件,并放入内存中
            *[思路]显示的时候，实际显示的具体内容
            *[接口this..MY.fileSelect.setFileName]=设置要查询的文件名
            *[接口this..MY.fileSelect.setPath]=设置要查询的文件名的路径
            *[接口this..MY.fileSelect.queryFileContent]=进行文件内容查询
            *[接口this..MY.content]=实际测试文件内容的内侧存放地址。
            *[接口.hash的json格式]{
            *  gadget:"gadget名称",
            *  file:"url地址"
            *}
            */
            "initText": function() {
                //获取url参数
                var allHash = window.location.hash;
                if (allHash == null || allHash == "" || allHash == "#") {
                    FW.alert("请输入文件路径");
                    return;
                }
                allHash = allHash.replace(/^#/i, "");
                allHash = decodeURIComponent(allHash);
                var urlObj = eval("(" + allHash + ")");
                var fileUrl = urlObj.file;
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
                    //$("#aliasTitle").html("[" + fileName + "]");
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
                this.MY.content = eval("(" + text + ")");
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name public$showBase
            *@description [功能]显示基本内容，就是service和package的编辑框
            */
            "showBase": function() {
                //直接显示
                this.API.show("baseView", this.MY.content);
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name public$showMenu
            *@description [功能]直接初始化父亲部分的目录树
            *[思路]用父亲本身的目录树进行初始化
            *[接口.目录树初始化的数据结构]
            *            [
            *            {
            *            name:"显示名称",
            *            type:"item/folder",
            *            itemid:"点击标识"
            *            children:[儿子的内容，循环上面父亲的结构
            *            ]
            *            }
            *            ]
            *[接口.目录树初始化的数据]{
            *      基本信息:"存放被测试的service和package,itemid是base",
            *      数据库设置:"链接到基本数据库设置页面,itemid是database"
            *      用例:[
            *           case1:"case1的数据，itemid是case+id"
            *      ]
            *}
            *[接口.this.MY.treeView]左边treeView的数据
            *@param data 完整的结构数据，即实际的测试记录文件
            */
            "showMenu": function(data) {
                //整理目录树数据
                var treeData = [{
                    name: "基本信息",
                    type: "item",
                    itemid: "base"
                },
                {
                    name: "数据库设置",
                    type: "item",
                    itemid: "database"
                },
                {
                    name: "用例",
                    type: "folder",
                    children: []
                }

                ];

                for (var i = 0; i < data.testcase.length; i++) {
                    treeData[2].children.push({
                        name: data.testcase[i].caseName,
                        type: "item",
                        itemid: "case_" + i
                    });
                }
                //目录树初始化
                this.MY.treeView.init(treeData);
                //绑定点击事件
                var _this = this;
                this.MY.treeView.setEventCall(function(ex, info) {
                    _this.treeMenuClick(info);
                });
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name public$treeMenuClick
            *@description [功能]给左边树点击后回调的函数
            *@param nodedata 这里传入的是treeview传入的数据结构，如下：
            {
            info[//这里表示被选中的节点，通常只有一个
            {
            name:名称，用于显示，可能会加入前缀的i标签,
            type:"item/folder",
            itemid:"被选中的节点id，其值，参见showMenu函数"
            additionalParameters:{有儿子就有这个节点
            children:{
            data0:{
            //这里开始就是一个独立儿子的结构
            }
            }
            }
            }
            ]
            }
            如果这个数据没有，则表示用this.MY.curContentList
            */
            "treeMenuClick": function(nodedata) {
                //获取itemid值
                var itemid = nodedata.info[0].itemid;
                //if(基本信息情况){显示基本情况
                if (itemid == "base") {
                    //显示基本信息
                    this.showBase();
                }
                //}
                //else if(点击数据库情况){显示数据库部分
                else if (itemid == "database") {
                    //显示数据库部分
                    this.showDatabase();
                }
                //}
                //else if(case情况){显示case
                else if (/case_\d+/i.test(itemid)) {
                    //显示这个case
                    this.showCase(itemid);
                }
                //}
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name public$showDatabase
            *@description [功能]显示当前这个service当前所需要的记录的数据库信息，包括数据编辑功能
            *[思路]这是主显示窗口，给出主架构，具体显示的内容，调用子方法实现
            */
            "showDatabase": function() {
                //显示主框架
                this.API.show("databaseMain", null);
                //显示主框架下缺省的内容
                this.API.private('showDatabaseSelected');
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name public$showCase
            *@description [功能]显示某个case的基本信息
            *[思路]这里只显示基本的架构，也是tag分页方式显示，具体每个tag由私有方法决定
            *[接口.this.MY.content.testcase]总的内部数据在这里
            *[接口.view.caseView]总的内部数据在这里
            *@param caseitem 这是在showMenu函数中定义的每个case的id方式，详细请参考showMenu函数
            */
            "showCase": function(caseitem) {
                //获取本case数据
                var execResult = /case_(\d+)/i.exec(caseitem);
                if (execResult == null) {
                    FW.alert("没找到用例：" + caseitem);
                    return;
                }
                var idx = execResult[1];
                var caseData = this.MY.content.testcase[idx];

                if (caseData == null) {
                    FW.alert("没找到用例：" + caseitem);
                }
                caseData.idx = idx;
                //显示基本信息
                this.API.show("caseView", caseData);
            }
        },
        "private": {
            /**
            *@function
            *@memberOf editServiceTest
            *@name private$showDatabaseSelected
            *@description [功能]显示基本的被选中的表
            */
            "showDatabaseSelected": function() {
                //直接将当前的数据显示出去
                this.API.show("databaseSelected", this.MY.content.tables, "database_home_show");
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name private$showDatabaseAll
            *@description [功能]到后台获取当前所有表的表名，并将表和当前已选中表整合显示到页面上
            *[接口.service.db.getAllTable.return]={
            *   code:0,
            *   data:[
            *       {
            *            name:'表名'
            *       }
            *   ]
            *}
            *[接口.showdata][
            *   {
            *          name:"表名",
            *          selected:"是否选中"
            *   }
            *]
            */
            "showDatabaseAll": function() {
                //获取所有数据
                //--用同步方法
                var doServerResult = this.API.doServer("getAllTable", "db");
                if (doServerResult == null || doServerResult.code != 0 || !doServerResult.data || doServerResult.data.length == 0) {
                    FW.alert("查询表名失败");
                    return;
                }
                var allTable = doServerResult.data;
                //排序
                allTable.sort(function(a, b) {
                    return (a.name > b.name) ? 1 : -1;
                });
                //block(块){合成显示数据
                //将选中表名合成一个","为间隔符的字符串，为选中字符串
                var selectedTable = this.MY.content.tables.join(",");
                //while(所有表){
                for (var i = 0; i < allTable.length; i++) {
                    //if(属于选中字符的子串){标识出选中
                    if (selectedTable.indexOf(allTable[i].name) >= 0) {
                        //设置成选中
                        allTable[i].selected = true;
                    }
                    //}
                }
                //}
                //}
                //显示内容
                this.API.show("databaseAllTable", allTable, "database_all_show");
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name private$showDatabaseTable
            *@description [功能]显示其中一个表的所有数据
            *[接口.service.db.getOneTable.param]{
            *  name:"表名"
            *}
            *[接口.service.db.getOneTable.return]{
            *  code:0.
            *  data:[
            *      {
            *          字段名:'字段值'
            *      }
            *  ]
            *}
            *@param tableName 显示表名
            */
            "showDatabaseTable": function(tableName) {
                //获取表数据
                var tableData = this.API.doServer("getOneTable", "db", {
                    name: tableName
                });
                if (!tableData || tableData.code == null || tableData.code != 0) {
                    FW.alert("获取表数据失败");
                    return;
                }
                if (!tableData.data) {
                    tableData.data = [];
                }
                //显示到页面上
                this.API.show("databaseOneTable", tableData.data, "database_home_show");
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name private$showCaseMemSession
            *@description [功能]显示测试用例的内存和session内容
            *[接口.this.MY.content.testcase]某一个测试用例
            *[接口.view.caseMemSession]基础的视图名
            *@param idx 要显示的case数组索引
            */
            "showCaseMemSession": function(idx) {
                //获取数据
                var displayCase = this.MY.content.testcase[idx];
                //显示出来
                this.API.show("caseMemSession", displayCase, "case_session_show");
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$saveBase
            *@description [功能]保存基本信息
            *[思路]用最基本的FW.use().getFormValue去获取表单的值
            *@param formid 要读取的表单的id值
            */
            "saveBase": function(formid) {
                //获取表单的值
                var formValue = FW.use().getFormValue(formid);
                //修改值
                if (formValue.servicename == "" || formValue.servicename == null) {
                    FW.alert("请填写servicename");
                }
                if (formValue.package == "" || formValue.package == null) {
                    FW.alert("请填写包名");
                }
                this.MY.content.servicename = formValue.servicename;
                this.MY.content.package = formValue.package;
                //重新显示
                this.showBase();
                FW.alert("基本信息设置成功");
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$showDatabaseAll
            *@description [功能]显示所有表
            */
            "showDatabaseAll": function() {
                //调用私用方法显示所有表
                this.API.private('showDatabaseAll');
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$addDBSelected
            *@description [功能]添加关注的数据库表名
            *@param name 要关注的表名称
            */
            "addDBSelected": function(name) {
                //添加关注
                this.MY.content.tables.push(name);
                //重新显示
                this.API.private('showDatabaseAll');
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$showDatabaseSelected
            *@description [功能]显示选中信息
            */
            "showDatabaseSelected": function() {
                //显示
                this.API.private('showDatabaseSelected');
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$removeDBSelected
            *@description [功能]取消关注
            *@param idx 被删除的索引
            *@param refresh 是否刷新，true刷新，否则不刷新
            */
            "removeDBSelected": function(idx, refresh) {
                //查找数据并删除
                this.MY.content.tables.splice(idx, 1);
                //重新显示
                if (refresh) {
                    this.API.private('showDatabaseSelected');
                }
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$showDatabaseTable
            *@description [功能]调用私有方法，显示一个具体的表信息
            *@param tableName 表名
            */
            "showDatabaseTable": function(tableName) {
                //toDo
                this.API.private('showDatabaseTable', tableName);
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$modifyCaseMem
            *@description [功能]修改某个case的内存信息
            *[原理]页面的key和value是用id值memset[原来的key]key和memset[原来的key]value来标识，在事件处理中直接用jquery去获取对应的值。
            *[接口.this.MY.content.testcase]这里描述内部全局变量定义
            *@param idx 所在case的索引
            *@param oldKey 原来的key
            */
            "modifyCaseMem": function(idx, oldKey) {
                //获取要修改的testcase
                var thisCase = this.MY.content.testcase[idx];
                //从页面上获取新的key和新的value
                var newKey = $("#memset" + oldKey + "key").val();
                if (newKey == null) {
                    FW.alert("key不允许为空");
                    return;
                }
                newKey = newKey.replace(/(^\s*)|(\s*$)/i, "");
                if (newKey == "") {
                    FW.alert("key不允许为空");
                    return;
                }

                var newValue = $("#memset" + oldKey + "value").val();
                if (newValue == null) {
                    FW.alert("value不允许为空");
                    return;
                }
                newValue = newValue.replace(/(^\s*)|(\s*$)/i, "");
                if (newValue == "") {
                    FW.alert("value不允许为空");
                    return;
                }
                //if(key没有修改){直接找出原来的值进行修改
                if (oldKey == newKey) {
                    //直接找出原来的值进行修改
                    thisCase.globel[oldKey] = newValue;
                }
                //}
                //else{删除原来的值然后再添加新值
                else {
                    //删除原来的值然后再添加新值
                    delete thisCase.globel[oldKey];
                    thisCase.globel[newKey] = newValue;
                }
                //}
                //重新显示
                FW.alert("全局变量修改成功");
                this.API.private('showCaseMemSession', idx);
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$showCaseMemSession
            *@description [功能]触发显示内存部分设置
            *[思路]调用私有方法实现
            *@param idx 要显示的case索引
            */
            "showCaseMemSession": function(idx) {
                //toDo
                this.API.private('showCaseMemSession', idx);
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$modifyCaseSession
            *@description [功能]修改某个case的内存信息
            *[原理]页面的key和value是用id值sessionset[原来的key]key和sessionset[原来的key]value来标识，在事件处理中直接用jquery去获取对应的值。
            *[接口.this.MY.content.testcase]这里描述内部全局变量定义
            *@param idx 所在case的索引
            *@param oldKey 原来的key
            */
            "modifyCaseSession": function(idx, oldKey) {
                //获取要修改的testcase
                var thisCase = this.MY.content.testcase[idx];
                //从页面上获取新的key和新的value
                var newKey = $("#sessionset" + oldKey + "key").val();
                if (newKey == null) {
                    FW.alert("key不允许为空");
                    return;
                }
                newKey = newKey.replace(/(^\s*)|(\s*$)/i, "");
                if (newKey == "") {
                    FW.alert("key不允许为空");
                    return;
                }

                var newValue = $("#sessionset" + oldKey + "value").val();
                if (newValue == null) {
                    FW.alert("value不允许为空");
                    return;
                }
                newValue = newValue.replace(/(^\s*)|(\s*$)/i, "");
                if (newValue == "") {
                    FW.alert("value不允许为空");
                    return;
                }
                newValue = newValue.replace(/"/ig, "'");
                //if(key没有修改){直接找出原来的值进行修改
                if (oldKey == newKey) {
                    //直接找出原来的值进行修改
                    thisCase.session[oldKey] = newValue;
                }
                //}
                //else{删除原来的值然后再添加新值
                else {
                    //删除原来的值然后再添加新值
                    delete thisCase.session[oldKey];
                    thisCase.session[newKey] = newValue;
                }
                //}
                //重新显示
                FW.alert("session设置修改成功");
                this.API.private('showCaseMemSession', idx);
            },
            /**
            *@function
            *@memberOf editServiceTest
            *@name FireEvent$addCaseMemSession
            *@description [功能]添加一个新的内存或者session设置
            *[思路]是添加session还是添加mem通过传入的参数决定
            *@param idx 要添加的索引
            *@param name globel/session
            */
            "addCaseMemSession": function(idx, name) {
                //添加数据
                this.MY.content.testcase[idx][name]["newone"] = "new one value"
                //重新显示
                this.API.private('showCaseMemSession', idx);
            }
        },
        view: {
            'baseView': require("./resource/editServiceTest/baseView.tpl"),
            'databaseMain': require("./resource/editServiceTest/databaseMain.tpl"),
            'databaseSelected': require("./resource/editServiceTest/databaseSelected.tpl"),
            'databaseAllTable': require("./resource/editServiceTest/databaseAllTable.tpl"),
            'databaseOneTable': require("./resource/editServiceTest/databaseOneTable.tpl"),
            'caseView': require("./resource/editServiceTest/caseView.tpl"),
            'caseMemSession': require("./resource/editServiceTest/caseMemSession.tpl")
        }

    },
    module);
    return FW;
});