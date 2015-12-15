/**
* @namespace
* @name treeFileSelect 
* @version 0.01 罗光瑜 初始版本
* @description  这给类因为还是存粹的文件操作，所以最后决定还是用白箱复用的方式引用
*该类继承了FileOper实际上父类就包含了所有的文件操作功能。    
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./fileselect");
    require("./treeView");
    FW.register({
        "name": "treeFileSelect",
        "extends": ["fileselect"],
        "param": {
            /**
            *@memberOf treeFileSelect
            *@name initDir
            *@description 默认的其实目录
            */
            "initDir": ".",
            /**
            *@memberOf treeFileSelect
            *@name listApp
            *@description 要处理listApp的id值，默认没有
            */
            "listApp": null,
            /**
            *@memberOf treeFileSelect
            *@name operType
            *@description 处理的操作类型，是目录操作还是文件操作
            */
            "operType": "dir"
        },
        /**
        *@function
        *@memberOf treeFileSelect
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {
            //if (文件是目录操作情况){
            if (this.param.operType == "dir") {
                //设定最初的目录信息
                this.MY.data = {
                    dir: fileGlobleSetting && fileGlobleSetting.initDir || this.param.initDir
                }
                //初始化openStatus
                this.MY.openStatus = {};
                //初始化左边文件列表对象
                this.MY.dirFile = {};
                //初始化文件操作app
                this.MY.listApp = FW.getApp(this.param.listApp);
                //调用公有方法showQueryDir显示初始的目录信息
                this.showQueryDir();
            }
            //}
        },
        "public": {
            /**
            *@function
            *@memberOf treeFileSelect
            *@name public$showList
            *@description 显示需求列表列表页信息
            *在需求列表页被调用
            *@param data 列表页数据
            */
            "showList": function(data) {
                data.sort();
                this.API.show(this.param.listViewId, data);
                $("#currDir").html(decodeURI(data.dir.replace(/@/g, "%")));
                $("#fileOper").show();
                this.MY.currDir = data.dir;
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name public$showFileHistory
            *@description 显示文件的历史版本信息，需要从后台服务器中读取相关的文件列表。
            *@param fileName 文件名
            */
            "showFileHistory": function(fileName) {
                //合成正式的历史版本的路径名
                var path = "/backup/" + fileName;
                //用文件对象查询文件列表
                this.setPath(path);
                var listResult = this.queryDir();
                //if(无返回结果){alert提示并退出
                if (!listResult) {
                    //显示失败
                    FW.alert("该文件没有历史信息");
                    return;
                }
                //}
                //显示儿子列表
                this.API.show("view_fileHistory", listResult);
                $("#currDir").html(decodeURI(fileName.replace(/@/g, "%")));
                $("#fileOper").hide();
            }
        },
        "private": {
            /**
            *@function
            *@memberOf treeFileSelect
            *@name private$changeLetter
            *@description 因为id不能有.和/所以有这两个字符的要转义
            *@param letter 要转义的字符
            *@return 转义后的字符
            *@example changeLetter(".asd/ddd")
            */
            "changeLetter": function(letter) {
                //如果输入的是一个数组，那么先合并数组
                if (letter.join) {
                    letter = letter.join("");
                }
                //直接用replace函数加正则表达式替换
                return letter.replace(/[\.\/%@]/ig, "_");
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name private$showDir
            *@description 重载显示方法，该方法会被递归式的调用，同时该方法要仅仅显示目录部分，而文件列表将记录到变量this.MY.dirFile变量中，其格式为
            *{
            *  [dir]:[文件列表]
            *}
            *@param data 列表数据
            */
            "showDir": function(data) {
                //获取循环列表
                var list = data.fileList;
                //初始化目录列表和文件列表
                var dlist = [];
                dlist.dir = data.dir;
                var flist = [];
                flist.dir = data.dir;
                //for(所有列表){分开文件和目录赋值
                for (var n in data.fileList) {
                    if (data.fileList[n].type == 'D') {
                        dlist.push(n);
                    } else {
                        flist.push(n);
                    }
                }
                //}
                console.log(data);
                //block(块){处理显示目标
                var target = null;
                //if (./SRS/){显示目标为空
                if (data.dir == this.param.initDir) {
                    target = null;
                }
                //}
                //else{显示目标为dir值
                else {
                    target = this.API.private('changeLetter', data.dir);
                    if ($("#" + target)[0] == null) {
                        target = null;
                    }
                }
                //}
                //}
                //显示目录列表
                this.API.show(this.param.viewid, dlist, target);
                //记录文件列表
                this.MY.dirFile[data.dir] = flist;
                //显示列表
                if (this.MY.listApp) {
                    this.MY.listApp.showList(flist);
                }
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name private$changeDisplayName
            *@description 这个函数给页面调用，因为在页面调用时，可能会对文件名做一些处理
            *缺省函数是做url的解码操作
            *@param name 原始输入的文件名
            *@return 处理后的文件名
            */
            "changeDisplayName": function(name) {
                //解码并返回
                return decodeURI(name.replace(/@/ig, "%"));
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name private$changeInputName
            *@description 对输入的文件名进行转换，是给添加子目录的时候操作的
            *目前缺省函数是编码操作
            *@param name 原始的文件名
            *@return 编码后的文件名
            */
            "changeInputName": function(name) {
                //直接返回编码内容
                return encodeURI(name).replace(/%/ig, "@");
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name private$changeHistoryF
            *@description 转换原始文件名，将文件名中的用户信息和时间信息展开
            *@param f 文件名
            */
            "changeHistoryF": function(f) {
                //正则解析
                var execResult = /([\w@]*)(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/i.exec(f);
                //返回结果
                if (execResult) {
                    var result = decodeURIComponent(execResult[1].replace(/@/ig, "%"));
                    if (result == "") {
                        result = "[本地账号]"
                    } else {
                        result = "[" + result + "]";
                    }
                    result += "&nbsp;&nbsp;";
                    result += execResult[2] + "年" + execResult[3] + "月" + execResult[4] + "日" + "&nbsp;" + execResult[5] + ":" + execResult[6] + ":" + execResult[7];
                    return result;
                }
                return f;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$clickSub
            *@description 点击加号或者减号时调用。
            *如果加号就展开子节点，如果减号就收起
            *内部有一个变量this.MY.openStatus记录展开收起情况
            *如果展开，这个变量记录的每个目录的展开情况，如下：
            *{
            *  [节点dir]:"onep/close"
            *}
            *如果已经保存过数据，就不再保存，否则要到后台调用重新打开
            *@param clickDir 点击打开的dir
            *@param dom 当前a标签节点
            */
            "clickSub": function(clickDir, dom) {
                //获取内存状态值
                var status = this.MY.openStatus[clickDir];
                //if (值不存在){调用父类showQueryDir方法查询并显示子目录
                if (status == null) {
                    //设置目录
                    this.MY.data.dir = clickDir;
                    //调用方法
                    this.showQueryDir();
                    //修改状态值
                    this.MY.openStatus[clickDir] = "open";
                    if (dom) {
                        dom.innerHTML = "-";
                    }
                    this.API.find("#container_" + this.API.private('changeLetter', clickDir)).show();
                }
                //}
                //else if(状态是open){隐藏节点
                else if (status == "open") {
                    //隐藏节点
                    this.API.find("#container_" + this.API.private('changeLetter', clickDir)).hide();
                    //修改状态值
                    this.MY.openStatus[clickDir] = "close";
                    if (dom) {
                        dom.innerHTML = "+";
                    }
                }
                //}
                //else{ 显示节点
                else {
                    //显示节点
                    this.API.find("#container_" + this.API.private('changeLetter', clickDir)).show();
                    //修改状态值
                    this.MY.openStatus[clickDir] = "open";
                    if (dom) {
                        dom.innerHTML = "-";
                    }
                }
                //}
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$clickDir
            *@description 点击到某个目录时显示这个目录的内容
            *@param dir dir节点信息
            */
            "clickDir": function(dir) {
                //获取节点对象
                var showData = this.MY.dirFile[dir];
                //if(对象不存在){调用clickSub方法展开子节点
                if (showData == null) {
                    FireEvent(this.id + ".clickSub", dir);
                }
                //}
                //else{显示对象
                else {
                    this.MY.data.dir = dir;
                    if (this.MY.listApp) {
                        this.MY.listApp.showList(showData);
                    }
                }
                //}
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$openAddSubDir
            *@description 添加一个当前节点下的子节点
            */
            "openAddSubDir": function() {
                this.API.mask("mask_openSubDir", null, 300, 200);
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$addSubDir
            *@description 蒙版层的确定按钮调用
            *添加子节点
            *@param textDomId 文本框的id
            */
            "addSubDir": function(textDomId) {
                //根据id获取其输入的值
                var inputtext = $("#" + textDomId).val();
                //if(输入的值不合法){直接退出
                if (inputtext == null) {
                    alert("请输入正确的目录名称");
                    return;
                }
                //}
                //编码转换目录名
                inputtext = this.API.private('changeInputName', inputtext);
                //根据父类设置的当前文件信息this.MY.data.dir,合成新的目录
                var newDir = this.MY.data.dir + "/" + inputtext;
                //调用父类方法showQueryDir创建目录
                this.MY.data.dir = newDir;
                this.showQueryDir();
                //刷新本页面
                window.location.reload();
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$openAddFile
            *@description 打开一个新的页面输入对应文件名的蒙版层，这个是给文件列表页面调用的
            */
            "openAddFile": function() {
                //打开蒙蔽层
                this.API.mask("mask_openFile", null, 300, 200);
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$addFile
            *@description 添加新需求，被蒙版层调用
            *记录需求名称，合成一个url参数直接跳转到需求编辑页面就可以，注意中文要进行编码转义处理
            *@param fileId 原型名称的输入框id
            */
            "addFile": function(fileId) {
                //获取原型名称id
                var fileName = $("#" + fileId).val();
                //if(输入不合法){提示并退出
                if (fileName == null) {
                    //提示并退出
                    alert("请输入正确的文件名名称");
                    return;
                }
                //}
                //合成转向SRSCreator.jsp的文件参数，fileUrl
                fileName = this.MY.currDir + "/" + this.API.private('changeInputName', fileName) + (fileGlobleSetting.exp || ".jsp");
                var fileUrl = encodeURIComponent(fileName);
                //跳转跳转到SRSCreator.jsp
                window.location = fileGlobleSetting.clickSetting.newone.replace("[fileUrl]", fileUrl);
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$deleteFile
            *@description 删除文件
            *@param fileName 文件名
            */
            "deleteFile": function(fileName) {
                //设置参数
                this.setPath(this.MY.currDir);
                this.setFile(fileName);
                //删除文件
                this.deleteFile();
                //刷新文件列表
                var showData = this.queryDir();
                var refreshData = [];
                for (var n in showData) {
                    if (showData[n].type == 'D') {
                        continue;
                    }
                    refreshData.push(n);
                }
                refreshData.dir = this.MY.currDir;
                this.showList(refreshData);
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$openRename
            *@description 打开重命名窗口
            *@param fileName 文件名
            */
            "openRename": function(fileName) {
                //打开重命名的窗口
                this.API.mask("mask_rnFile", fileName, 200, 100);
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$reName
            *@description 重命名
            */
            "reName": function() {
                //获取旧的文件名
                var oldName = $("#mask_oldName").val();
                var newName = $("#mask_newName").val() + (fileGlobleSetting.exp || ".jsp");
                if (oldName == newName) {
                    FW.alert("原名和新名不能相同");
                    return;
                }
                this.setPath(this.MY.currDir);
                var data = this.moveFile(oldName, this.MY.currDir, newName);
                alert("文件重命名成功");
                //刷新文件
                var showData = this.queryDir();
                var refreshData = [];
                for (var n in showData) {
                    if (showData[n].type == 'D') {
                        continue;
                    }
                    refreshData.push(n);
                }
                refreshData.dir = this.MY.currDir;
                this.showList(refreshData);
                this.API.unmask();
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$filePaste
            *@description 粘贴文件
            */
            "filePaste": function() {
                //if(没有拷贝或剪切){退出
                if (!this.MY.copycut) {
                    //退出
                    FW.alert("请先拷贝或者剪切");
                    return;
                }
                //}
                //整理参数
                var destDir = this.MY.currDir;
                var destFile = this.MY.copycut.sFileName;
                var srcDir = this.MY.copycut.sFileDir;
                var srcFile = this.MY.copycut.sFileName;
                var type = this.MY.copycut.type;
                if (destDir == srcDir) {
                    destFile = "copy_" + destFile;
                }
                //根据不同类型进行调用
                this.setPath(destDir);
                if (type == 'copy') {

                    this.copyFile(srcFile, destDir, destFile);
                } else {
                    this.moveFile(srcFile, destDir, destFile);
                }
                //刷新列表
                var showData = this.queryDir();
                var refreshData = [];
                for (var n in showData) {
                    if (showData[n].type == 'D') {
                        continue;
                    }
                    refreshData.push(n);
                }
                refreshData.dir = this.MY.currDir;
                this.showList(refreshData);
                //alert提示结果
                alert("操作成功");
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$fileCopyCut
            *@description 复制文件,记录到
            *[this.MY.copycut]={
            *   sFileName:原文件,
            *   sFileDir:原路径,
            *   type:"copy/cut"
            *}
            *@param fileName 要复制的文件名
            *@param type 操作类型,是copy还是cut
            */
            "fileCopyCut": function(fileName, type) {
                //记录相关数据
                this.MY.copycut = {
                    sFileName: fileName,
                    sFileDir: this.MY.currDir,
                    type: type
                }
                //提示结果
                FW.alert("操作成功");
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$showFileHistory
            *@description 显示文件历史列表
            *@param f toDo
            */
            "showFileHistory": function(f) {
                //获取全部文件名
                var fullName = this.MY.currDir + "/" + f;
                fullName = fullName.replace(/^\W+/, "");
                //调用公有方法显示历史列表
                this.showFileHistory(fullName);
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$editHistoryFile
            *@description 编辑历史文件，注意，基本路径的获取，是从父类的getPath中获取不是从本类中获取
            *@param fileName 文件名
            *@param operName 操作名，即外部程序定义的操作信息
            */
            "editHistoryFile": function(fileName, operName) {
                //合成访问地址
                var srsName = this.getPath() + "/" + fileName;
                var fileUrl = encodeURIComponent(srsName);
                //跳转跳转到SRSCreator.jsp
                var url = fileGlobleSetting.clickSetting[operName].replace("[fileUrl]", fileUrl);
                window.open(url, "_blank");
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$editCurr
            *@description 点击编辑按钮后，编辑这个文件
            *@param fileName 要编辑的文件名
            *@param operName 操作名，即外部程序定义的操作信息
            */
            "editCurr": function(fileName, operName) {
                //合成访问地址
                var srsName = this.MY.currDir + "/" + fileName;
                var fileUrl = encodeURIComponent(srsName);
                //跳转到SRSCreator.jsp
                var url = fileGlobleSetting.clickSetting[operName].replace("[fileUrl]", fileUrl);
                window.open(url, "_blank");
            },
            /**
            *@function
            *@memberOf treeFileSelect
            *@name FireEvent$restoreFile
            *@description 还原文件，调用的是父类的copy方法。
            *copy的原文件和目标文件都从客户端传入的文件中以及父类的getPath方法中获取。
            *@param fName 传入的文件名
            */
            "restoreFile": function(fName) {
                //获取原路径，从父类getPath中
                var sorcePath = this.getPath();
                //合成原路径文件全名，即当前备份部分的
                var sorcFile = fName;
                //合成目标路径和名称
                var exec = /^[\\\/]*backup(.+?[\\\/])([\w\.]+)$/.exec(sorcePath);
                if (!exec) {
                    FW.alert("无法解析目标文件，还原失败");
                    return;
                }
                var distPath = exec[1];
                var distFile = exec[2];
                //调用父类方法进行拷贝
                this.copyFile(sorcFile, distPath, distFile);
                //提示还原成功并返回原文件
                FW.alert("文件还原成功");
            }
        }
    },
    module);
    return FW;
});