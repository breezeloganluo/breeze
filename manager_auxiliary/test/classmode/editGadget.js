/**
* @namespace
* @name editGadget 
* @description  d 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    var formOper = require("breeze/framework/js/tools/FormOper");
    require("./textMod");
    require("./graphyFunMod");
    var Q = require("breeze/framework/js/tools/qunee-module");
    FW.register({
        "name": "editGadget",
        /**
        *@function
        *@memberOf editGadget
        *@name onCreate
        */
        "onCreate": function() {
            this.MY.textMod = FW.createApp("textMod", "textMod", this);
        },
        "public": {
            /**
            *@function
            *@memberOf editGadget
            *@name initNew
            */
            "initNew": function(txt) {
                var classMod = this.MY.classMod;
                if (/string/.test(typeof(txt))) {
                    classMod = this.MY.classMod = this.MY.textMod.createClassMod(txt);
                    if (!classMod) {
                        alert("文件解析失败！");
                        return null;
                    }
                }
                if (/object/.test(typeof(txt))) {
                    if (txt) {
                        classMod = this.MY.classMod = FW.createApp("classMod", "classMod", this);
                        classMod.setMod(txt);
                    }
                }

                var tree = this.MY.treeMod = FW.getAPP("fileMemberTree");
                tree.setClassMod(classMod);
                tree.showClass();
                var graphy = this.MY.graphyMod = FW.getAPP("funGraphy");
                graphy.setClassMod(classMod);
                this.showBase();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name newGadget
            */
            "newGadget": function() {
                var newGadget = {
                    name: "newGadget",
                    functionFragment: {
                        onCreate: {
                            type: "onCreate",
                            name: "onCreate",
                            fragments: [{
                                type: "normal",
                                command: "toDO"
                            }]
                        }
                    }
                }
                this.initNew(newGadget);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name showBase
            */
            "showBase": function() {
                this.API.show("baseInfo");
                var openDom = this.API.find("#infoForm");
                //合成数据描述
                var metadata = {
                    name: {
                        title: "类名",
                        type: "Text",
                        desc: "文件类类名"
                    },
                    "extends": {
                        title: "继承项",
                        type: "List",
                        valueRange: [{
                            name: {
                                title: "类名",
                                type: "Text",
                            }
                        }]
                    },
                    include: {
                        title: "引用包",
                        type: "List",
                        valueRange: [{
                            vName: {
                                title: "引用后变量名",
                                type: "Text"
                            },
                            vDir: {
                                title: "类路径",
                                type: "Text"
                            }
                        }]
                    },
                    comments: {
                        title: "类说明",
                        type: "TextArea"
                    }
                }
                //转化成数据
                var modData = this.MY.classMod.getMod();
                var data = {
                    name: modData.name,
                    include: modData.include,
                    comments: modData.comments,
                    "extends": []
                }

                for (var i = 0; modData["extends"] && i < modData["extends"].length; i++) {
                    var n = modData["extends"][i];
                    data["extends"].push({
                        name: n
                    });
                }
                //显示数据
                formOper.createFormByObjDesc(metadata, openDom, data);
                $("#actionName").html(data.name + ".js");
            },
            /**
            *@function
            *@memberOf editGadget
            *@name showAttribute
            */
            "showAttribute": function(attObj) {
                this.API.show("attInfo");
                var openDom = this.API.find("#infoForm");
                //将编辑数据，记录到form中
                openDom[0].attObj = attObj;
                //合成数据描述
                var metadata = {
                    name: {
                        title: "属性名",
                        type: "Text",
                        desc: "属性名称"
                    },
                    "content": {
                        title: "属性值",
                        type: "Text",
                        desc: "属性的初始值,全是字符串类型"
                    },
                    comments: {
                        title: "类说明",
                        type: "TextArea"
                    }
                }
                //转化成数据
                var data = attObj;
                //显示数据
                formOper.createFormByObjDesc(metadata, openDom, data);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name showFunFragment
            */
            "showFunFragment": function(fragmentObj, parent, funObj) {
                if (!this.MY.classMod) {
                    alert("请先选择Gadget");
                    return;
                }
                this.MY.graphyMod.destroy();

                this.API.show("FunFragment");
                //初始准备好数据
                var openDom = this.API.find("#infoForm");
                openDom[0].funObj = funObj;
                openDom[0].fragmentParent = parent;
                openDom[0].fragmentData = fragmentObj;
                //整理formOper的metadata
                var getMetadata = function(type) {
                    var metadata = {
                        type: {
                            title: "类型",
                            type: (type == "branchBlock") ? "ReadOnly": "Select",
                            valueRange: (type == "branchBlock") ? null: [{
                                "普通": "normal",
                                "分支": "branchList",
                                "循环": "cycle",
                                "代码块": "block"
                            }]
                        },
                        command: {
                            title: "主注释名称",
                            type: (type != "normal") ? "Hidden": "Text"
                        },
                        condiction: {
                            title: "条件",
                            type: (type == "normal" || type == "branchList") ? "Hidden": "Text"
                        },
                        doWhat: {
                            title: "做什么",
                            type: (type == "normal" || type == "branchList") ? "Hidden": "Text"
                        },

                        subCommand: {
                            title: "子注释",
                            type: "List",
                            valueRange: [{
                                type: {
                                    title: "类型",
                                    type: "Select",
                                    valueRange: [{
                                        "toDo": "++",
                                        "完成": "--"
                                    }]
                                },
                                content: {
                                    title: "内容",
                                    type: "Text"
                                }
                            }]
                        },
                        code: {
                            title: "代码片段",
                            type: (type != "branchList") ? "TextArea": "Hidden"
                        }
                    }
                    return metadata;
                };
                var metadata = getMetadata(fragmentObj.type);
                //转换函数片段数据				
                var data = {};
                for (var n in fragmentObj) {
                    var oneObj = fragmentObj[n];
                    data[n] = oneObj;
                }
                if (fragmentObj.type != "normal") {
                    var execResult = /\((.+?)\)\{(.*)/.exec(fragmentObj.command);
                    if (execResult != null) {
                        data.condiction = execResult[1];
                        data.doWhat = execResult[2];
                    } else {
                        if (/else/.test(fragmentObj.command)) {
                            data.condiction = "else";
                        }
                    }
                }
                console.log(data);
                //合成并显示数据
                var callBackFun = function(name, value, type) {
                    if (/select/i.test(type) && /data\.type/i.test(name)) {
                        var metadata = getMetadata(value);
                        var data = openDom[0].getData();
                        formOper.createFormByObjDesc(metadata, openDom, data, callBackFun);
                    }
                }
                formOper.createFormByObjDesc(metadata, openDom, data, callBackFun);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name newFunFragmentBA
            */
            "newFunFragmentBA": function(s) {
                //获取当前函数
                var openDom = this.API.find("#infoForm");
                var funObj = openDom[0].funObj;
                var parent = openDom[0].fragmentParent && openDom[0].fragmentParent.subList || funObj.fragments;
                var fragmentObj = openDom[0].fragmentData;

                var newFragement = {
                    type: 'normal',
                    command: 'toDo',
                    code: ''
                }

                if (fragmentObj.type == "branchBlock") {
                    newFragement.type = "branchBlock";
                    newFragement.subList = [{
                        type: 'normal',
                        command: 'toDo',
                        code: ''
                    }]
                }
                //从parent中查找，并插入
                for (var i = 0; i < parent.length; i++) {
                    if (parent[i] == fragmentObj) {
                        parent.splice(i + s, 0, newFragement);
                        break;
                    }
                }
                //跳转到新曾部分进行修改操作
                this.showFunFragment(newFragement, openDom[0].fragmentParent, funObj);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name newFunFragmentC
            */
            "newFunFragmentC": function() {
                //获取当前函数
                var openDom = this.API.find("#infoForm");
                var funObj = openDom[0].funObj;
                var parent = openDom[0].fragmentParent && openDom[0].fragmentParent.subList || funObj.fragments;
                var fragmentObj = openDom[0].fragmentData;

                if (fragmentObj.type == "normal") {
                    alert("该类型不允许添加子节点");
                    return;
                }

                var newFragement = {
                    type: 'normal',
                    command: 'toDo',
                    code: ''
                }

                if (fragmentObj.type == "branchList") {
                    newFragement.type = "branchBlock";
                    newFragement.subList = [{
                        type: 'normal',
                        command: 'toDo',
                        code: ''
                    }]
                }
                //从parent中查找，并插入
                if (!fragmentObj.subList) {
                    fragmentObj.subList = [];
                }

                fragmentObj.subList.push(newFragement);
                //跳转到新曾部分进行修改操作
                this.showFunFragment(newFragement, openDom[0].fragmentParent, funObj);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name showFileSelecte
            */
            "showFileSelecte": function() {
                this.MY.graphyMod && this.MY.graphyMod.destroy();
                this.API.show("appViewFileSelect");
                var fileOper = FW.getAPP("appViewFileSelect");
                fileOper.showInit();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name showFileSave
            */
            "showFileSave": function() {
                //整理窗口相关的数据
                if (!this.MY.classMod) {
                    alert("请先选择Gadget");
                    return;
                }
                this.API.show("view_fileSave");
                this.MY.graphyMod.destroy();
                var classMod = this.MY.classMod.getMod();
                var textMod = this.MY.textMod;
                var openDom = this.API.find("#infoForm");
                var fileOper = FW.getAPP("appViewFileSelect");
                //先整理要显示的dataform的metadata
                var metadata = {
                    path: {
                        title: "路径",
                        type: "Text",
                    },
                    name: {
                        title: "类名",
                        type: "ReadOnly",
                    },
                    code: {
                        title: "代码",
                        type: "TextArea"
                    }
                }
                //整理要显示的数据
                var data = {
                    path: fileOper.getPath(),
                    name: classMod.name + ".js",
                    code: textMod.getClassStr()
                }
                //显示到页面中
                formOper.createFormByObjDesc(metadata, openDom, data);
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf editGadget
            *@name saveBase
            */
            "saveBase": function() {
                this.saveBase();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name newAttribute
            */
            "newAttribute": function() {
                this.newAttribute();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name delAttribute
            */
            "delAttribute": function() {
                this.delAttribute();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name saveAttribute
            */
            "saveAttribute": function() {
                this.saveAttribute();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name showFunBase
            */
            "showFunBase": function() {
                var openDom = this.API.find("#infoForm");
                var oldData = openDom[0].funObj;
                this.showFunBase(oldData);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name saveFunBase
            */
            "saveFunBase": function() {
                this.saveFunBase();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name showFunGraphy
            */
            "showFunGraphy": function() {
                var openDom = this.API.find("#infoForm");
                var oldData = openDom[0].funObj;
                this.showFunGraphy(oldData);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name newFun
            */
            "newFun": function() {
                this.newFun();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name delFun
            */
            "delFun": function() {
                this.delFun();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name saveFunFragment
            */
            "saveFunFragment": function() {
                this.saveFunFragment();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name showFunEditor
            */
            "showFunEditor": function() {
                var openDom = this.API.find("#infoForm");
                var funObj = openDom[0].funObj;
                this.showFunEditor(funObj);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name saveFunStr
            */
            "saveFunStr": function() {
                this.saveFunStr();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name delFunFragment
            */
            "delFunFragment": function() {
                this.delFunFragment();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name saveFile
            */
            "saveFile": function() {
                this.saveFile();
            },
            /**
            *@function
            *@memberOf editGadget
            *@name back2Graphy
            */
            "back2Graphy": function() {
                var openDom = this.API.find("#infoForm");
                var funObj = openDom[0].funObj;
                this.showFunGraphy(funObj);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name newFunFragmentBefore
            */
            "newFunFragmentBefore": function() {
                this.newFunFragmentBA(0);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name newFunFragmentAfter
            */
            "newFunFragmentAfter": function() {
                this.newFunFragmentBA(1);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name newFunFragmentChild
            */
            "newFunFragmentChild": function() {
                this.newFunFragmentC();
            }
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf editGadget
            *@name getFile
            */
            "getFile": function(data) {
                this.initNew(data);
            },
            /**
            *@function
            *@memberOf editGadget
            *@name trigerChangeClass
            */
            "trigerChangeClass": function(cid) {
                if (cid == "base") {
                    this.MY.graphyMod && this.MY.graphyMod.destroy();
                    this.showBase();
                    return;
                }
                //处理属性值
                if (/^data\.attributeFragment/.test(cid)) {
                    this.MY.graphyMod.destroy();
                    var data = this.MY.classMod.getMod();
                    var processData = eval("(" + cid + ")");
                    this.showAttribute(processData);
                    return;
                }
                //处理函数
                if (/^data\.functionFragment/.test(cid)) {
                    this.MY.graphyMod.destroy();
                    var data = this.MY.classMod.getMod();
                    var processData = eval("(" + cid + ")");
                    this.showFunBase(processData);
                    return;
                }
            }
        }
    });
    return FW;
});