/**
* @namespace
* @name SRSCreator 
* @version 0.01 罗光瑜 初始版本
* @description  进行需求分析的gadget              
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./editPage");
    FW.register({
        "name": "SRSCreator",
        "extends": ["editPage"],
        "param": {
            /**
            *@memberOf SRSCreator
            *@name listViewId
            *@description 这个值如果存在，说明是需求的列表处理，不进行正常的editpage的初始化工作，而是做页面的列表初始化工作
            */
            "listViewId": null,
            /**
            *@memberOf SRSCreator
            *@name fileUrl
            *@description 覆盖父类的默认参数
            */
            "fileUrl": "manager_auxiliary/template/templateSRS.jsp"
        },
        /**
        *@function
        *@memberOf SRSCreator
        *@name onCreate$onCreate
        *@description 根据参数listViewId判断是否要执行父类的onCreate方法
        */
        "onCreate": function() {
            if (this.param.listViewId == null) {
                this.API.father("onCreate");
            }
        },
        "public": {
            /**
            *@function
            *@memberOf SRSCreator
            *@name public$getShowObjStrt
            *@description 重载显示方法，判断在保存的时候，如果类型是0那么要将需求点插入到标签中
            *用this.MY.isSaving来判断是否是处于保存状态
            *@param showObj 参见父类方法
            *@param baseId 参见父类方法
            *@param subTypeObj 参见父类方法
            *@return 要显示对象的html字符串
            */
            "getShowObjStrt": function(showObj, baseId, subTypeObj) {
                //调用父类方法获取结果信息
                var result = this.API.father("getShowObjStrt", showObj, baseId, subTypeObj);
                //如果是0类型并且当前是父类保存方法的时候就插入注释的节点
                if (showObj.type == 0 && this.MY.isSaving) {
                    if (showObj.SRS != null && showObj.SRS.name != null) {
                        var srsObj = FW.use().toJSONString(showObj.SRS.SRS);
                        var srsStr = "<!--SRS(" + showObj.SRS.name + ")" + srsObj + "-->";
                        result = result.replace(/\<[^\>]+\>/i,
                        function(a, b) {
                            return a + "\n" + srsStr + "\n";
                        });
                    }
                }
                //最后返回结果
                return result;
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name public$showList
            *@description 显示需求列表列表页信息
            *在需求列表页被调用
            *@param data 列表页数据
            */
            "showList": function(data) {
                this.API.show(this.param.listViewId, data);
                $("#currDir").html(decodeURI(data.dir.replace(/@/g, "%")));
                this.MY.currDir = data.dir;
            }
        },
        "private": {
            /**
            *@function
            *@memberOf SRSCreator
            *@name private$parserHtml
            *@description 重载父类的parserHtml方法，在父类分析的基础上要把，需求点分析出来。
            *需求点的格式以注释为基础，如下：
            *《!--SRS(需求点标识){
            * json对象描述的需求
            *}--》
            *翻译出来的结果，也要在原来的结果中有所修改，增加需求描述的对象
            *{
            *        "type": 0,
            *        "content": "没有注释部分的需求内容",
            *        "SRS":解析上面json对象描述的需求
            *    };
            *@param jdom 参见父类描述
            *@return 单个html对象
            */
            "parserHtml": function(jdom) {
                //调用父类处理
                var result = this.API.father("parserHtml", jdom);
                //获取解析的文本字符串
                var orgStr = result.content;
                //设定分析的正则表达式
                var reg = /\<!--SRS\(([^\)]+)\)([\s\S]+?)--\>/i;
                //通过replace函数替换并获取到实际内容
                var srsObj = {}
                result.content = orgStr.replace(reg,
                function(a, b, c, d, e) {
                    srsObj.name = b;
                    srsObj.SRS = eval("(" + c + ")");
                    return "";
                });
                //返回实际结果
                result.SRS = srsObj;
                return result;
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name private$changeDisplayName
            *@description 这个函数给页面调用，因为在页面调用时，可能会对文件名做一些处理
            *缺省函数是做url的解码操作
            *@param name 原始输入的中文名
            */
            "changeDisplayName": function(name) {
                //解码并返回
                return decodeURI(name.replace(/@/ig, "%"));
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name private$changeInputName
            *@description 对输入的文件名进行转换，是给添加子目录的时候操作的
            *目前缺省函数是编码操作
            *@param name 原始的文件名
            */
            "changeInputName": function(name) {
                //直接返回编码内容
                return encodeURI(name).replace(/%/ig, "@");
            }
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$openAddObject
            *@description 通过方法打开一个新增对象的蒙版层，在这个页面中科选择相应的窗体内容
            */
            "openAddObject": function() {
                //打开对象创建蒙蔽层
                this.API.mask("newObjectSetting", null, 800, 600);
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$addNewObj
            *@description 根据mask的选项，添加一个新的对象，同时解除mask
            *@param selectid 页面上选中的id
            */
            "addNewObj": function(selectid) {
                //合成读取内容的正则表达式
                var reg = "##" + selectid + "##" + "([^@]+)" + "@@" + selectid + "@@";
                var regexp = new RegExp(reg);
                //用正则获取要读入的字符串
                var execResult = regexp.exec(this.view.newObjectSetting);
                if (execResult == null) {
                    alert("未找到对应的组件");
                    return;
                }
                //根据字符串合成要创建的对象
                var showObj = {
                    type: 0,
                    content: execResult[1]
                };
                //显示并关闭蒙版层
                this.addNewObj(showObj);
                this.API.unmask();
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$editSRS
            *@description 点击编辑按钮后，编辑这个文件
            *@param fileName 要编辑的文件名
            */
            "editSRS": function(fileName) {
                //合成访问地址
                var srsName = this.MY.currDir + "/" + fileName;
                var fileUrl = encodeURIComponent(srsName);
                //跳转跳转到SRSCreator.jsp
                window.location = "./SRSCreator.jsp?fileUrl=" + fileUrl;
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$saveOneObjSrsObj
            *@description 保存单个需求标题
            *@param inputId 输入框的id值
            */
            "saveOneObjSrsObj": function(inputId) {
                //获取保存对象在this.MY.srsObj中
                var srsObj = this.MY.srsObj;
                //获取页面输入的值
                var srsName = $("#" + inputId).val();
                //将该值保存到对象中
                srsObj.name = srsName;
                //成功提示
                alert('保存成功');
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$openOneObjSRSSingle
            *@description 打开一个添加或编辑需求的列表
            *需求的详细结构如下：
            *{
            *   name:"需求标题",
            *   desc:"需求描述"
            *}
            *是添加还是编辑区别在于传入的参数
            *@param srsIdx 需求索引，没有表示添加操作
            */
            "openOneObjSRSSingle": function(srsIdx) {
                //准备好编辑对象
                var editObj = {
                    name: "",
                    desc: "",
                    srsIdx: -1
                };
                //if (是编辑操作){设置编辑对象
                if (srsIdx != null) {
                    editObj = this.MY.srsObj.SRS[Number(srsIdx)];
                    editObj.srsIdx = srsIdx;
                }
                //}
                //显示视图，视图ID为srsSingleForm
                this.API.unmask();
                this.API.mask("srsSingleForm", editObj, 800, 600);
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$backList
            *@description 编辑框出来后，取消要回到列表蒙版层
            */
            "backList": function() {
                //关闭当前蒙版层
                this.API.unmask();
                //用蒙版层显示到页面上，视图id为oneObjSRSlist
                var srsObj = this.MY.srsObj;
                this.API.mask("oneObjSRSlist", srsObj, 800, 600);
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$addOneObjSRS
            *@description 添加一个需求列表信息,输入的是输入框id，注意每一个输入框的name属性，就是对应的键值名称
            *注意要返回上一个蒙版列表的
            *@param idArray 输入框的id数组
            *@param srsIdx 如果是编辑的话，表示修改的是第几个需求内容
            */
            "addOneObjSRS": function(idArray, srsIdx) {
                idArray = idArray.split(",");
                //获取要添加的对象
                var addingData = {};
                //for(每一个id数组){设置对应的值
                for (var i = 0; i < idArray.length; i++) {
                    var name = $("#" + idArray[i]).attr("name");
                    var value = $("#" + idArray[i]).val();
                    addingData[name] = value;
                }
                //}
                //将添加的值设置到对象中，注意原来的值没有就添加一个新的
                if (this.MY.srsObj.SRS == null || this.MY.srsObj.SRS.push == null) {
                    this.MY.srsObj.SRS = [];
                }
                srsIdx = Number(srsIdx);
                if ( - 1 == srsIdx) {
                    this.MY.srsObj.SRS.push(addingData);
                } else {
                    this.MY.srsObj.SRS[srsIdx] = addingData;
                }
                //调用事件，关闭并返回列表
                FireEvent(this.id + ".backList");
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$delOneObjsrs
            *@description 响应页面的事件，从数组中删除一个一个需求项目
            *@param srsidx 要删除的数组索引
            */
            "delOneObjsrs": function(srsidx) {
                //获取需求对象
                var srsObj = this.MY.srsObj.SRS;
                //删除对象
                srsidx = Number(srsidx);
                srsObj.splice(srsidx, 1);
                //alert提示
                FW.alert("删除成功");
                //返回重新显示列表
                FireEvent(this.id + ".backList");
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$openOneObjSRSList
            *@description 用事件打开一个本页面对象的需求列表
            *用蒙版层打开
            *打开的蒙版层是显示需求列表数据的，列表的格式如下：
            *{
            *   name:需求分类
            *  SRS:[
            *       {
            *        name:"需求标题"
            *        。。。。。
            *       }
            *  ]
            *}
            *打开列表的需求只关心需求的标题，其他部分的定义在新建需求中详细说明
            *说明：根据页面获取到被编辑对象的showObj，是根据其编辑部分的id获取的，不能根据直接索引，因为这里有可能会嵌套
            *@param dom 当前点击的按个a标签dom对象
            */
            "openOneObjSRSList": function(dom) {
                //根据dom找到编辑框，再找到其对应的id
                //--id就是真正的对象索引
                var arrayIdxStr = $(dom).parents(".widget-box:first").find(".widget-edit-position")[0].id;
                //合成获取对象的字符串
                var data = this.MY.showObj;
                var evalStr = arrayIdxStr;
                //用eval获取当前的对象
                var displayData = eval("(" + evalStr + ")");
                //获取需求列表对象
                var srsObj = displayData.SRS;
                //保存到变量中，便于后续处理
                if (srsObj == null) {
                    srsObj = displayData.SRS = {};
                }
                this.MY.srsObj = srsObj;
                //用蒙版层显示到页面上，视图id为oneObjSRSlist
                this.API.mask("oneObjSRSlist", srsObj, 800, 600);
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$openAddSRS
            *@description 打开一个新的页面输入对应需求名的蒙版层，这个是给文件列表页面调用的
            */
            "openAddSRS": function() {
                //打开蒙蔽层
                this.API.mask("mask_openSRS", null, 300, 200);
            },
            /**
            *@function
            *@memberOf SRSCreator
            *@name FireEvent$addSRS
            *@description 添加新需求，被蒙版层调用
            *记录需求名称，合成一个url参数直接跳转到需求编辑页面就可以，注意中文要进行编码转义处理
            *@param srsId 原型名称的输入框id
            */
            "addSRS": function(srsId) {
                //获取原型名称id
                var srsName = $("#" + srsId).val();
                //if(输入不合法){提示并退出
                if (srsName == null) {
                    //提示并退出
                    alert("请输入正确的原型名称");
                    return;
                }
                //}
                //合成转向SRSCreator.jsp的文件参数，fileUrl
                srsName = this.MY.currDir + "/" + this.API.private('changeInputName', srsName) + ".jsp";
                var fileUrl = encodeURIComponent(srsName);
                //跳转跳转到SRSCreator.jsp
                window.location = "./SRSCreator.jsp?fileUrl=" + fileUrl;
            }
        }
    });
    return FW;
});