/**
* @namespace
* @name treeFileControl 
* @version 0.01 罗光瑜 初始化第一版本
* @description  模仿window的目录浏览器，这个类负责进行目录和文件的访问，而目录的访问模式采用treeView这个类，本类只负责相关文件中间操作区域的控制。
*接受两个全局变量去控制头部内容：
*fileGlobleSetting = [{//表示顶部菜单的功能图标设置
*			    name:"xxx",
*				icon:"./img/icon/srsview.png",
*				type:"file/tool",
*				initDir: "design/srs/",
*				clickSetting: {
*					"link": "点击自身的事件",
*					'newone':"./SRSCreator.jsp?fileUrl=[fileUrl]",
*					"编辑": "./SRSCreator.jsp?fileUrl=[fileUrl]"
*				}
*			}
*			]
*currGlobleSetting = [{//表示的可用工具列表
*			    name:"xxx",
*				icon:"./img/icon/srsview.png",
*				type:"file/tool",
*				initDir: "design/srs/",
*				clickSetting: {
*					"link": "点击自身的事件",
*					'newone':"./SRSCreator.jsp?fileUrl=[fileUrl]",
*					"编辑": "./SRSCreator.jsp?fileUrl=[fileUrl]"
*				}
*			}
*			]         
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./fileselect");
    require("./treeView");
    FW.register({
        "name": "treeFileControl",
        "param": {
            /**
            *@memberOf treeFileControl
            *@name treeViewAppid
            *@description 目录树appid
            */
            "treeViewAppid": "tree"
        },
        /**
        *@function
        *@memberOf treeFileControl
        *@name onCreate$onCreate
        *@description [功能]初始化所有信息
        *[接口.this.MY.fileOper]文件接口
        *[接口.this.MY.treeView]目录树接口
        *[接口.this.MY.controlTitle]{
        *  curSig:"当前的标识"
        *  sigList:{
        *     sig:{
        *        editObj:编辑对象，如果为空，就是自己
        *        name:显示到页面的字符串
        *     }
        *  }
        *}
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
            this.MY.fileOper = FW.createApp("fileselect", "fileselect", pageParam);
            //创建目录树对象
            this.MY.treeView = FW.getApp(this.param.treeViewAppid);
            //初始化头部
            var headData = fileGlobleSetting;
            this.showTopHead(headData);
            //初始化头部控制部分
            this.MY.controlTitle = {
                curSig: "main",
                sigList: {
                    main: {
                        name: "main"
                    }
                }
            }

            this.showControlTitle();
            //初始化初始可用复合工具
            window.curGlobleSetting = [];
            for (var i = 0; i < headData.length; i++) {
                if (headData[i].type == "file" || headData[i].type == "this" || headData[i].type == "selfedit") {
                    window.curGlobleSetting.push(headData[i]);
                }
            }
            //初始化访问首目录
            this.MY.initDir = "/";
            //调用初始化方法进行初始化
            var data = this.initFile(this.MY.initDir);
            this.showList(data);
        },
        "public": {
            /**
            *@function
            *@memberOf treeFileControl
            *@name public$initFile
            *@description [功能]访问首层目录信息，初始化目录树和主体内容
            *[思路]首层目录要手动获取，然后拿到结果后，初始化目录树
            *[接口.目录树的结构]
            *[
            *   {
            *        name:"显示名称",
            *        type:"item/folder",
            *        icon-class:"添加的icon的class样式",
            *        icon:"icon的样式内容，比如icon-music blue"，
            *        dir:"当前文件的目录"
            *        ]
            *   }
            *]
            *[接口.FileOper返回数据]
            *{
            *   filename:{
            *      dir:"F/D"
            *   ]
            *}
            *@param initDir 初始化目录信息
            */
            "initFile": function(initDir) {
                //访问获取远程目录
                this.MY.fileOper.setPath(initDir);
                var result = this.MY.fileOper.queryDir();
                //转换数据
                var firstList = this.API.private('changeData', result, initDir);
                //初始化目录树
                var _this = this;
                var initResultData = this.MY.treeView.init(firstList, {

                    'open-icon': 'icon-folder-open',
                    'close-icon': 'icon-folder-close'
                });
                //设置回调接口
                this.MY.treeView.setDataCallback(function(dirObj) {
                    return _this.getFileCallback(dirObj)
                });
                //设置事件处理接口
                this.MY.treeView.setEventCall(function(ex, info) {
                    _this.showList(info);
                });
                //返回初始化结果
                return initResultData;
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name public$getFileCallback
            *@description [功能]供文件类进行回调使用，获取下一层的文件目录信息
            *[思路]拿到输入的节点数据，然后发送远程文件，再进行显示
            *[接口.FileOper返回数据]
            *{
            *   filename:{
            *      dir:"F/D"
            *   ]
            *}
            *@param dirObj 目录对象，这是目录树那边进行回调时的当前节点的数据结构
            {
            name:"文件名",
            realName:"真实文件"
            dir:"文件目录",
            type:"folder",
            icon-class:"添加的icon的class样式",
            icon:"icon的样式内容，比如icon-music blue"
            }
            *@return 当前文件文件的目录树节点:
            [
            {
            name:文件名
            realName:真实文件名
            dir:合成后该文件的全路径名
            type:"item/folder"
            }
            ]
            */
            "getFileCallback": function(dirObj) {
                //合成访问路径
                var dir = dirObj.dir + "/" + dirObj.realName;
                //查询文件
                this.MY.fileOper.setPath(dir);
                var resultList = this.MY.fileOper.queryDir();
                //转换数据并返回
                var result = this.API.private('changeData', resultList, dir);
                return result;
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name public$showTopHead
            *@description [功能]显示顶部菜单的内容
            *[思路]根据传入的信息进行显示
            *@param topMenu [{
            name:"xxx",
            icon:"./img/icon/srsview.png",
            type:"file/tool",
            initDir: "design/srs/",
            clickSetting: {
            "link": "点击自身的事件",
            'newone':"./SRSCreator.jsp?fileUrl=[fileUrl]",
            "编辑": "./SRSCreator.jsp?fileUrl=[fileUrl]"
            }
            }
            ]
            */
            "showTopHead": function(topMenu) {
                //在数组前面添加一个新数据
                var showData = [{
                    name: "综合编辑器",
                    icon: "./img/icon/all.png",
                    type: "all"
                }];
                showData = showData.concat(topMenu);
                //直接显示
                this.API.show("topMenu", showData, "topMenu");
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name public$showControlTitle
            *@description [功能]显示头部部分的控制部分信息内容
            *[接口.this.MY.controlTitle]{
            *  curSig:"当前的标识"
            *  sigList:{
            *     sig:{
            *        editObj:编辑对象，如果为空，就是自己
            *        name:显示到页面的字符串
            *     }
            *  }
            *}
            */
            "showControlTitle": function() {
                //获取数据
                var showData = this.MY.controlTitle;
                //显示到页面上
                this.API.show("controlTitle", showData, "controlTitle");
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name public$showList
            *@description [功能]被左边目录树回调，显示对应的列表信息。
            *[接口.this.MY.curContentList]当前传入的参数要保存起来
            *[接口.this.MY.curDir]记录当前的路径
            *@param nodedata 这里传入的是treeview传入的数据结构，如下：
            {
            info[//这里表示被选中的节点，通常只有一个
            {
            name:名称，用于显示，可能会加入前缀的i标签,
            realName:真正名称,
            dir:所在路径,
            type:"item/folder"
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
            "showList": function(nodedata) {
                //保存参数的值，便于不传参数时用上次的值
                var hasparam = true;
                if (nodedata) {
                    this.MY.curContentList = nodedata;
                } else {
                    nodedata = this.MY.curContentList;
                    hasparam = false;
                }
                //整理数据到本点击节点信息
                var data = nodedata.info[0];
                //if (如果是文件类型){显示文件的视图
                if (data.type == "item") {
                    //显示显示单文件视图
                    this.API.show("itemShow", data);
                }
                //}
                //else{显示目录类型
                else {
                    //将当前目录记录this.my.curDir中
                    this.MY.curDir = nodedata.info[0].dir + "/" + nodedata.info[0].name;
                    this.MY.curDir = this.MY.curDir.replace(/[\\\/]+/g, "/");
                    //判断是否真的有儿子
                    if (data.additionalParameters == null || data.additionalParameters.children == null) {
                        return;
                    }
                    //整理目录列表
                    var list = data.additionalParameters.children;
                    //if(有参数传入){将所有子节点的选中状态设置成false
                    if (hasparam) {
                        //将所有选中状态置否
                        for (var n in list) {

                            list[n] && list[n].name && (list[n].selected = false);
                        }
                        list.selected = false;
                    }
                    //}
                    list.copycut = this.MY.copycut;
                    list.name = data.realName;
                    list.dir = data.dir.replace(/[\\\/]+/g, "/").replace(/\/$/i, "");
                    //显示目录视图
                    this.API.show("folderShow", list);
                }
                //}
            }
        },
        "private": {
            /**
            *@function
            *@memberOf treeFileControl
            *@name private$changeData
            *@description [功能]从fileOper中获取到的数据转换将自定义的数据转换成目录树所能理解的结构
            *另外，将文件的类型做一定的变换，变换的要求：
            *1.默认目录都是灰色，但是servicegadget和page是红色和粉红色
            *2.jsp，html是图片用叶子图标，图片文件用图片图标，js文件用图片图标，其他用默认图标
            *最后，要进行一次排序，将目录和文件分开顺序，目录排列在前面，文件排列在后面
            *@param filesData 从fileOper获取到的文件名:
            {
            fileName:{
            type:"F/D"
            }
            }
            *@param initDir 原始的目录
            *@return treeView能够理解的目录树结构
            [
            {
            name:"显示名称",
            type:"item/folder",
            icon-class:"添加的icon的class样式",
            icon:"icon的样式内容，比如icon-music blue"，
            dir:"当前文件的目录"
            ]
            }
            ]
            */
            "changeData": function(filesData, initDir) {
                //声明结果变量
                var resultList;
                var dirList = [],
                fileList = [];
                //while(所有filesData数据){进行转换
                for (var n in filesData) {
                    //如果WEB-INF就祛除掉
                    if (n == "WEB-INF" || n == "breeze" || n == "backup") {
                        continue;
                    }
                    //获取其中一个数据
                    var one = {
                        name: n,
                        realName: n,
                        type: ("F" == filesData[n].type) ? "item": "folder",
                        dir: initDir
                    }
                    //if (是目录){处理目录的特殊要求
                    if (one.type == "folder") {
                        if (/^[\\\/]*page[\\\/]*$/i.test(n)) {
                            one["icon-class"] = "red";
                        } else if (/servicegadget/i.test(n)) {
                            one["icon-class"] = "pink";
                        } else {
                            one["icon-class"] = "gray";
                        }
                        dirList.push(one);
                    }
                    //}
                    //else{
                    else {
                        if (/html$/i.test(one.name) || /jsp$/i.test(one.name) || /css$/i.test(one.name)) {
                            if (/html$/i.test(one.name) || /jsp$/i.test(one.name)) {
                                one.icon = "icon-leaf blue";
                            } else {
                                one.icon = "icon-leaf green";
                            }

                        } else if (/png$/i.test(one.name) || /jpg$/i.test(one.name) || /gif$/i.test(one.name)) {
                            one.icon = "icon-bar-chart red";
                        } else if (/js$/i.test(one.name) || /tpl$/i.test(one.name)) {
                            if (/js$/i.test(one.name)) {
                                one.icon = " icon-edit blue";
                            } else {
                                one.icon = " icon-edit green";
                            }
                        }

                        else {
                            one.icon = "icon-cogs";
                        }
                        fileList.push(one);
                    }
                    //}
                }
                //}
                //返回结果
                fileList.sort(function(a, b) {
                    return (a.realName > b.realName) ? 1 : -1;
                });
                dirList.sort(function(a, b) {
                    return (a.realName > b.realName) ? 1 : -1;
                });
                resultList = dirList.concat(fileList);
                return resultList;
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name private$formattime
            *@description [功能]格式化时间格式将20150901改成2015年09月01日
            *@param d 输入的时间字符串
            *@return 格式化好后的时间文本
            */
            "formattime": function(d) {
                var execResult = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/i.exec(d);
                if (execResult == null) {
                    return d;
                }
                return execResult[1] + "年" + execResult[2] + "月" + execResult[3] + "日&nbsp" + execResult[4] + ":" + execResult[5] + ":" + execResult[6];
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name private$changeDisplayName
            *@description [功能]在列表显示时，转换中文
            *@param src 输入的原始文件名
            *@return 转换成中文的文件名
            */
            "changeDisplayName": function(name) {
                //解码并返回
                return decodeURI(name.replace(/@/ig, "%"));
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name private$changeInputName
            *@description [功能]将输入的文件名进行编码
            *@param p1 toDo
            *@return 编码后的文件名
            */
            "changeInputName": function(name) {
                //直接返回编码内容
                return encodeURI(name).replace(/%/ig, "@");
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name private$changeDisplayDir
            *@description [功能]显示的当前菜单名要合并initDIr，合并完再进行编码
            *[接口.this.MY.initDir]
            *@param curDir 当前路径
            */
            "changeDisplayDir": function(curDir) {
                //合并路径
                var result = this.MY.initDir + curDir;
                result = result.replace(/[\\\/]+/ig, "/");
                result = result.replace(/[\\\/]+$/i, "");
                result = this.API.private('changeDisplayName', result);
                return result;
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$selectFile
            *@description [功能]选中某一个文件后，改变文件的内容，然后重新show
            *[思路]刚刚被显示的内容保存在内存中，根据传入的内容，改变对象的值
            *[接口.this.MY.curContentList]当前被保存起来的列表对象
            *[接口.selected=true]该值存在表示该文件对象是被选中的。
            *@param name 文件对象值
            */
            "selectFile": function(name) {
                //清除所有原先的值
                var data = this.MY.curContentList.info[0];
                if (data.additionalParameters == null || data.additionalParameters.children == null) {
                    return;
                }
                var list = data.additionalParameters.children;
                for (var n in list) {
                    if (list[n] && list[n].name) {
                        list[n].selected = false;
                    }
                }
                //根据传入名称，给对应的对象添加选中标记
                list[name].selected = true;
                list.selected = name;
                //重新显示
                this.showList();
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$copy
            *@description [功能]记录拷贝的文件内容
            *[思路]从内存中获取文件列表
            *[接口.this.MY.curContentList]当前被保存起来的列表对象
            *[接口.this.MY.copycut]{
            *  srcfile:"要拷贝的文件路径",
            *  type:"copy/cut"
            *}
            *@param name 要拷贝的文件名
            */
            "copy": function(name) {
                //获取文件路径
                var data = this.MY.curContentList.info[0].additionalParameters.children;
                var srcDir = data.dir + "/" + data.name;
                var srcFile = data[name].realName;
                //设置到内存中
                this.MY.copycut = {
                    dir: srcDir,
                    file: srcFile,
                    type: "copy"
                }
                this.showList();
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$cut
            *@description [功能]记录拷贝的文件内容
            *[思路]从内存中获取文件列表
            *[接口.this.MY.curContentList]当前被保存起来的列表对象
            *[接口.this.MY.copycut]{
            *  srcfile:"要拷贝的文件路径",
            *  type:"copy/cut"
            *}
            *@param name 要拷贝的文件名
            */
            "cut": function(name) {
                //获取文件路径
                var data = this.MY.curContentList.info[0].additionalParameters.children;
                var srcDir = data.dir + "/" + data.name;
                var srcFile = data[name].realName;
                //设置到内存中
                this.MY.copycut = {
                    dir: srcDir,
                    file: srcFile,
                    type: "copy"
                }
                this.showList();
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$parse
            *@description [功能]完成粘贴操作
            *[思路]先进行文件操作，然后左边树要重新初始化，再展开到当前
            *[接口.this.MY.curContentList]当前列表信息可获取目录信息
            *[接口.this.MY.copycut]记录拷贝粘贴的原信息
            */
            "parse": function() {
                //获取拷贝目标信息
                var tmp = this.MY.curContentList;
                var destDir = tmp.info[0].dir + "/" + tmp.info[0].name;
                destDir = destDir.replace(/[\\\/]+/g, "/");
                console.log(destDir);
                //获取拷贝源信息
                var srcInfo = this.MY.copycut;
                var destFile = srcInfo.file;
                if (destDir == srcInfo) {
                    destFile = "coopy_" + destFile;
                }
                console.log(srcInfo);
                var result = 0;
                //if(拷贝情况){进行拷贝
                if (srcInfo.type == "copy") {
                    //拷贝
                    this.MY.fileOper.setPath(srcInfo.dir);
                    result = this.MY.fileOper.copyFile(srcInfo.file, destDir, destFile);
                }
                //}
                //else{剪切情况
                else {
                    //剪切
                    this.MY.fileOper.setPath(srcInfo.dir);
                    result = this.MY.fileOper.moveFile(srcInfo.file, destDir, destFile);
                }
                //}
                //if(失败){提示并退出
                if (result && result.code != 0) {
                    //提示并退出
                    FW.alert("操作失败！");
                    return;
                }
                //}
                //提示操作成功
                alert("操作成功");
                //清除拷贝粘贴标识
                this.MY.copycut = null;
                //重新初始化
                this.initFile(this.MY.initDir);
                //展开到现在
                this.MY.treeView.expDir(destDir);
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$deleteFile
            *@description [功能]删除文件
            *[思路]获取到文件内容后，将文件删除，注意要让用户二次确认，删除后，为了要让之生效，还要重新初始化目录树以及展开到当前目录
            *@param name 传入的名称，注意，不是文件名，而是传入的对象的对象名data0，data1之类的
            */
            "deleteFile": function(name) {
                //获取要删除的文件
                var data = this.MY.curContentList.info[0].additionalParameters.children;
                var srcDir = data.dir + "/" + data.name;
                var srcFile = data[name].realName;
                //给出提示二次确认
                var _this = this;
                FW.confirm("您确认要进行删除",
                function(result) {
                    if (result) {
                        //实施删除
                        _this.MY.fileOper.setPath(srcDir);
                        _this.MY.fileOper.setFileName(srcFile);
                        _this.MY.fileOper.deleteFile();
                        //重新初始化并重新展开目录树
                        _this.initFile(_this.MY.initDir);
                        //展开到现在
                        _this.MY.treeView.expDir(srcDir);
                    }
                });
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$newDir
            *@description [功能]创建新目录
            *[思路]获取从页面输入的路径和名称，创建目录,需要重新初始化并展开
            *@param dir 页面上获取的路径
            */
            "newDir": function(dir) {
                //处理传入参数
                var newDirName = this.API.private('changeInputName', $('#newDirName').val());
                var newDir = dir + "/" + newDirName;
                this.MY.fileOper.setPath(newDir);
                var result = this.MY.fileOper.queryDir();
                if (result && result.code == 0) {
                    FW.alert("操作成功");
                }
                //取消蒙板层
                FW.unblockUI();
                //重新初始化并重新展开目录树
                this.initFile(this.MY.initDir);
                //展开到现在
                this.MY.treeView.expDir(dir);
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$showFileHistory
            *@description [功能]显示文件的所有历史文件
            *[接口.this.MY.curContentList]当前的列表页
            *@param name 选中文件的对象名
            */
            "showFileHistory": function(name) {
                //合成要读取的路径信息
                var data = this.MY.curContentList.info[0].additionalParameters.children;
                var srcDir = data.dir + "/" + data.name;
                var srcFile = data[name].realName;
                var destDir = "/backup/" + srcDir + "/" + srcFile;
                //读取目录信息
                this.MY.fileOper.setPath(destDir);
                var resultData = this.MY.fileOper.queryDir();
                //转成数组并排序
                var showData = [];
                for (var n in resultData) {
                    if (resultData[n].type && resultData[n].type == "F") {
                        showData.push(n);
                    }
                }
                showData.sort(function(a, b) {
                    return parseInt(b.replace(/\D/g, "")) - parseInt(a.replace(/\D/g, ""));
                });
                showData.dir = (srcDir + "/" + srcFile).replace(/[\\\/]+/g, "/");
                //显示列表
                this.API.show("fileHistory", showData);
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$recovery
            *@description [功能]恢复某个版本的文件，并重新返回原文件
            *[思路]传入的是当前文件名包括路径，以及被恢复的文件名。要根据这两项进行文件目录的处理
            *@param srcFile 源文件路径名
            *@param recoveryFile 要恢复的文件名
            */
            "recovery": function(srcFile, recoveryFile) {
                //获取源的文件和路径
                var exec = /([\s\S]+?)[\\\/]+([^\\\/]+$)/i.exec(srcFile);
                if (!exec) {
                    alert("历史文件错误无法恢复");
                    return;
                }
                var orgDir = exec[1];
                var orgFile = exec[2];
                //获取恢复的文件和路径
                var reDir = "/backup/" + srcFile;
                var reFile = recoveryFile;
                //进行拷贝操作
                this.MY.fileOper.setPath(orgDir);
                var result = this.MY.fileOper.copyFile(orgFile, reDir, reFile);
                //恢复显示
                if (!result || result.code != 0) {
                    FW.alert("版本恢复失败");
                    return;
                }
                this.showList();
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$openNewDir
            *@description [功能]显示添加目录的功能列表
            *[接口.this.MY.curContentList]
            */
            "openNewDir": function() {
                //获取当前路径
                var data = this.MY.curContentList.info[0].additionalParameters.children;
                var srcDir = data.dir + "/" + data.name;
                //将添加的蒙板层显示出来
                this.API.mask("newDir", srcDir, "400", "220");
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$openNewFile
            *@description [功能]打开新的文件夹
            */
            "openNewFile": function() {
                //获取当前路径
                var data = this.MY.curContentList.info[0].additionalParameters.children;
                var srcDir = data.dir + "/" + data.name;
                //将添加的蒙板层显示出来
                this.API.mask("newFile", srcDir, "400", "220");
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$goEdit
            *@description [功能]继承旧功能，该方法用于跳转到新的编辑页面
            *[接口.fileGlobleSetting ]{
            *				exp:".js",
            *				initDir: "",
            *				clickSetting: {
            *					"link": "点击自身的事件",
            *					'newone':"./gadgetCreator.jsp?fileUrl=[fileUrl]",
            *					"编辑": "./gadgetCreator.jsp?fileUrl=[fileUrl]"
            *				}
            *			}
            *@param fileName 文件名
            *@param pidx 要处理的工具索引
            */
            "goEdit": function(fileName, pidx) {
                //合成被打开的文件路径字符串
                var data = this.MY.curContentList.info[0].additionalParameters.children;
                var dir = data.dir + "/" + data.name + "/" + fileName;
                //进行编码
                var enUrl = encodeURIComponent(dir);
                //合成url
                var url = curGlobleSetting[pidx].clickSetting["编辑"].replace("[fileUrl]", enUrl);
                //跳转
                window.open(url);
                //关闭
                FW.unblockUI();
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$goTools
            *@description [功能]跳入一个工具编辑器中
            *@param idx 传入的工具索引，注意，全局索引中添加了一个全部工具，这是内部添加上的，这里传入的参数是包含了这个内部工具的
            */
            "goTools": function(idx) {
                //获取正确的索引
                var realIdx = idx - 1;
                //if(全局情况){把所有文件形式工具加入当前工具
                if (realIdx == -1) {
                    //将内部可用的文件编辑器加入
                    window.curGlobleSetting = [];
                    for (var i = 0; i < fileGlobleSetting.length; i++) {
                        if (fileGlobleSetting[i].type == "file" || fileGlobleSetting[i].type == "this" || fileGlobleSetting[i].type == "selfedit") {
                            window.curGlobleSetting.push(fileGlobleSetting[i]);
                        }
                    }
                    this.MY.initDir = "/";
                    //修改左上角图标
                    this.API.show("menuTitle", {
                        icon: "./img/icon/all.png",
                        name: "综合编辑器"
                    },
                    "menuTitle");
                }
                //}
                //else if(普通文件形式){仅仅加入该工具
                else if (fileGlobleSetting[realIdx].type == "file" || fileGlobleSetting[realIdx].type == "selfedit") {
                    //只加入当前的
                    window.curGlobleSetting = [fileGlobleSetting[realIdx]];
                    this.MY.initDir = fileGlobleSetting[realIdx].initDir;
                    //修改左上角图标
                    this.API.show("menuTitle", fileGlobleSetting[realIdx], "menuTitle");
                }
                //}
                //else{直接页面跳转，并退出
                else {
                    //直接跳转并结束
                    window.open(fileGlobleSetting[realIdx].toolsUrl);
                }
                //}
                //重新初始化
                var data = this.initFile(this.MY.initDir);
                this.showList(data);
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$newFile
            *@description [功能]添加新文件
            *[思路]合成具体的文件名，通过url传递到被编辑的逻辑页面中完成
            *[接口.合成hash的json格式]{
            *  gadget:"gadget名称",
            *  file:"url地址"
            *}
            *[接口.this.MY.controlTitle]{
            *  curSig:"当前的标识"
            *  sigList:{
            *     sig:{
            *        editObj:编辑对象，如果为空，就是自己
            *        name:显示到页面的字符串
            *     }
            *  }
            *}
            *@param dir 传入的文件路径
            *@param cidx 当前编辑索引号
            */
            "newFile": function(dir, cidx) {
                //合成被打开的文件路径字符串
                var fName = this.API.private('changeInputName', $('#newFileName').val());
                var file = this.MY.initDir + dir + "/" + fName + curGlobleSetting[cidx].exp;
                var file = file.replace(/[\\\/]+/ig, "/");
                //if(类型是file类型){
                if (curGlobleSetting[cidx].type == "file") {
                    //进行编码
                    var enUrl = encodeURIComponent(file);
                    //合成url
                    var url = curGlobleSetting[cidx].clickSetting["newone"].replace("[fileUrl]", enUrl);
                    //跳转
                    window.open(url);
                }
                //}
                //else{
                else {
                    //合成url的hash
                    var hashObj = {
                        gadget: curGlobleSetting[cidx].gadget,
                        file: file
                    }
                    var hashStr = FW.use().toJSONString(hashObj);
                    window.location.hash = encodeURIComponent(hashStr);
                    //创建对应gadget实例
                    var gadgetName = curGlobleSetting[cidx].gadget;
                    var app = FW.createApp(name, gadgetName, this);
                    //重新显示控制title部分
                    var name = $('#newFileName').val();
                    this.MY.controlTitle.curSig = name;
                    this.MY.controlTitle.sigList[name] = {
                        name: name,
                        editObj: app
                    }
                    this.showControlTitle();
                }
                //}
                //去除蒙板层
                FW.unblockUI();
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$go2dir
            *@description [功能]根据传入的dir路径进行实际的跳转
            *[思路]条用左边菜单树功能实现跳转目录
            *@param dir 跳转的目录
            */
            "go2dir": function(dir) {
                //toDo
                this.MY.treeView.expDir(dir);
            },
            /**
            *@function
            *@memberOf treeFileControl
            *@name FireEvent$selectTitleControl
            *@description [功能]头部控制器中选中一个控制的事件
            *[接口.this.MY.controlTitle]{
            *  curSig:"当前的标识"
            *  sigList:{
            *     sig:{
            *        editObj:编辑对象，如果为空，就是自己
            *        name:显示到页面的字符串
            *     }
            *  }
            *}
            *@param sig 选中的标识
            */
            "selectTitleControl": function(sig) {
                //获取选中对象
                var selectedObj = this.MY.controlTitle.sigList[sig];
                if (selectedObj == null) {
                    FW.alert("选择的内容不存在");
                    return;
                }
                //改变this.MY.controlTitle值
                this.MY.controlTitle.curSig = sig;
                //重新显示头部控制
                this.showControlTitle();
                //block(块){显示对应控制内容
                //if(没有editObj){显示主目录
                if (selectedObj.editObj == null) {
                    //重新初始化
                    this.initFile(this.MY.initDir);
                    //展开到目录
                    this.MY.treeView.expDir(this.MY.curDir);
                }
                //}
                //else{显示对应对象的内容
                else {
                    //获取app对象
                    var app = selectedObj.editObj;
                    //显示内容
                    if (app == null) {
                        FW.alert("访问app没有找到");
                    }
                    app.initShow();
                }
                //}
                //}
            }
        },
        view: {
            'itemShow': require("./resource/treeFileControl/itemShow.tpl"),
            'folderShow': require("./resource/treeFileControl/folderShow.tpl"),
            'newDir': require("./resource/treeFileControl/newDir.tpl"),
            'fileHistory': require("./resource/treeFileControl/fileHistory.tpl"),
            'newFile': require("./resource/treeFileControl/newFile.tpl"),
            'topMenu': require("./resource/treeControl/topMenu.tpl"),
            'menuTitle': require("./resource/treeFileControl/menuTitle.tpl"),
            'controlTitle': require("./resource/treeFileControl/controlTitle.tpl")
        }

    },
    module);
    return FW;
});