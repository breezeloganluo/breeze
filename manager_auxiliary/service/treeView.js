/**
* @namespace
* @name treeView 
* @version 0.01 罗光瑜 初始化版本
* @description  对ace的treeview进行了一次封装，这次封装会让使用更加方便，和更加好的完成模块化的工作。使得本模块支持更方便的格式设置方式，支持动态绑定点击事件。支持动态获取子节点数据     
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "treeView",
        "param": {
            /**
            *@memberOf treeView
            *@name multiSelect
            *@description treeview初始化参数，是否支持多选
            */
            "multiSelect": false,
            /**
            *@memberOf treeView
            *@name loadingHTML
            *@description 加载的html图标
            */
            "loadingHTML": '<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
            /**
            *@memberOf treeView
            *@name open-icon
            *@description treeview初始化参数open-icon
            */
            "open-icon": 'icon-minus',
            /**
            *@memberOf treeView
            *@name close-icon
            *@description 'close-icon': 'icon-plus',
            */
            "close-icon": 'icon-plus',
            /**
            *@memberOf treeView
            *@name selectable
            *@description treeview初始化参数，是否可选
            */
            "selectable": true,
            /**
            *@memberOf treeView
            *@name selected-icon
            *@description treeview初始化参数selected-icon选中后图标
            */
            "selected-icon": 'icon-ok',
            /**
            *@memberOf treeView
            *@name unselected-icon
            *@description treeview的初始化参数'unselected-icon': 'icon-remove'
            */
            "unselected-icon": 'icon-remove'

        },
        /**
        *@function
        *@memberOf treeView
        *@name onCreate$onCreate
        *@description [功能]初始化一个treeview的内容，他初始化基本的脚步，然后调用init去初始化，类似show方法，显示具体内容。
        *[接口.this.MY.DataSourceTree]
        *[接口.this.MY.getData]处理数据的回调函数
        */
        "onCreate": function() {
            //if(没有加载treevew基本框架){加载treeview
            if (!$.fn || !$.fn.tree) {
                //将treeview代码加入，这是ace的代码
                (function(a, c) {
                    var b = function(e, d) {
                        this.$element = a(e);
                        this.options = a.extend({},
                        a.fn.tree.defaults, d);
                        this.$element.on("click", ".tree-item", a.proxy(function(f) {
                            this.selectItem(f.currentTarget)
                        },
                        this));
                        this.$element.on("click", ".tree-folder-header", a.proxy(function(f) {
                            this.selectFolder(f.currentTarget)
                        },
                        this));
                        this.$element.on("open", ".tree-folder-header", a.proxy(function(f, triggerConter) {
                            this.openFolder(f.currentTarget, triggerConter)
                        },
                        this));

                        this.render()
                    };
                    b.prototype = {
                        constructor: b,
                        render: function() {
                            this.populate(this.$element)
                        },
                        populate: function(f) {
                            var e = this;
                            var d = f.parent().find(".tree-loader:eq(0)");
                            d.show();
                            this.options.dataSource.data(f.data(),
                            function(g) {
                                d.hide();
                                a.each(g.data,
                                function(h, j) {
                                    var i;
                                    if (j.type === "folder") {
                                        i = e.$element.find(".tree-folder:eq(0)").clone().show();
                                        i.find(".tree-folder-name").html(j.name);
                                        i.find(".tree-loader").html(e.options.loadingHTML);
                                        var k = i.find(".tree-folder-header");
                                        k.data(j);
                                        if ("icon-class" in j) {
                                            k.find('[class*="icon-"]').addClass(j["icon-class"])
                                        }
                                    } else {
                                        if (j.type === "item") {
                                            i = e.$element.find(".tree-item:eq(0)").clone().show();
                                            i.find(".tree-item-name").html(j.name);
                                            i.data(j);
                                            if ("additionalParameters" in j && "item-selected" in j.additionalParameters && j.additionalParameters["item-selected"] == true) {
                                                i.addClass("tree-selected");
                                                i.find("i").removeClass(e.options["unselected-icon"]).addClass(e.options["selected-icon"])
                                            }
                                        }
                                    }
                                    if (f.hasClass("tree-folder-header")) {
                                        f.parent().find(".tree-folder-content:eq(0)").append(i)
                                    } else {
                                        f.append(i)
                                    }
                                });
                                e.$element.trigger("loaded")
                            })
                        },
                        selectItem: function(e) {
                            if (this.options.selectable == false) {
                                return
                            }
                            var d = a(e);
                            var g = this.$element.find(".tree-selected");
                            var f = [];
                            if (this.options.multiSelect) {
                                a.each(g,
                                function(i, j) {
                                    var h = a(j);
                                    if (h[0] !== d[0]) {
                                        f.push(a(j).data())
                                    }
                                })
                            } else {
                                if (g[0] !== d[0]) {
                                    g.removeClass("tree-selected").find("i").removeClass(this.options["selected-icon"]).addClass(this.options["unselected-icon"]);
                                    f.push(d.data())
                                }
                            }
                            if (d.hasClass("tree-selected")) {
                                d.removeClass("tree-selected");
                                d.find("i").removeClass(this.options["selected-icon"]).addClass(this.options["unselected-icon"])
                            } else {
                                d.addClass("tree-selected");
                                d.find("i").removeClass(this.options["unselected-icon"]).addClass(this.options["selected-icon"]);
                                if (this.options.multiSelect) {
                                    f.push(d.data())
                                }
                            }
                            if (f.length) {
                                this.$element.trigger("selected", {
                                    info: f
                                })
                            }
                        },
                        selectFolder: function(e) {
                            var d = a(e);
                            var f = d.parent();
                            if (d.find("." + this.options["close-icon"]).length) {
                                if (f.find(".tree-folder-content").children().length) {
                                    f.find(".tree-folder-content:eq(0)").show()
                                } else {
                                    this.populate(d)
                                }
                                f.find("." + this.options["close-icon"] + ":eq(0)").removeClass(this.options["close-icon"]).addClass(this.options["open-icon"]);
                                this.$element.trigger("opened", d.data())
                            } else {
                                if (this.options.cacheItems) {
                                    f.find(".tree-folder-content:eq(0)").hide()
                                } else {
                                    f.find(".tree-folder-content:eq(0)").empty()
                                }
                                f.find("." + this.options["open-icon"] + ":eq(0)").removeClass(this.options["open-icon"]).addClass(this.options["close-icon"]);
                                this.$element.trigger("closed", d.data())
                            }
                            this.$element.trigger("selected", {
                                info: [d.data()]
                            })
                        },
                        openFolder: function(e, triggerConter) {
                            var d = a(e);
                            var f = d.parent();
                            if (d.find("." + this.options["close-icon"]).length) {
                                if (f.find(".tree-folder-content").children().length) {
                                    f.find(".tree-folder-content:eq(0)").show()
                                } else {
                                    this.populate(d)
                                }
                                f.find("." + this.options["close-icon"] + ":eq(0)").removeClass(this.options["close-icon"]).addClass(this.options["open-icon"]);
                                this.$element.trigger("opened", d.data())
                            }

                            triggerConter && this.$element.trigger("selected", {
                                info: [d.data()]
                            });
                        },
                        selectedItems: function() {
                            var e = this.$element.find(".tree-selected");
                            var d = [];
                            a.each(e,
                            function(f, g) {
                                d.push(a(g).data())
                            });
                            return d
                        }
                    };
                    a.fn.tree = function(e, g) {
                        var f;
                        var d = this.each(function() {
                            var j = a(this);
                            var i = j.data("tree");
                            var h = typeof e === "object" && e;
                            if (!i) {
                                j.data("tree", (i = new b(this, h)))
                            }
                            if (typeof e === "string") {
                                f = i[e](g)
                            }
                        });
                        return (f === c) ? d: f
                    };
                    a.fn.tree.defaults = {
                        multiSelect: false,
                        loadingHTML: "<div>Loading...</div>",
                        cacheItems: true
                    };
                    a.fn.tree.Constructor = b
                })(window.jQuery);
            }
            //}
            //声明数据对象
            //--点击后下一层数据也在这里
            var _this = this;
            this.MY.DataSourceTree = function(options) {
                this._data = options.data;
                this._delay = options.delay;
            }

            this.MY.DataSourceTree.prototype.data = function(options, callback) {
                var self = this;
                var $data = null;

                if (! ("name" in options) && !("type" in options)) {
                    $data = this._data;
                    callback({
                        data: $data
                    });
                    return;
                } else if ("type" in options && options.type == "folder") {
                    if (_this.MY.getData) {
                        var childrenData = _this.MY.getData(options);
                        options['additionalParameters'] = {
                            'children': _this.API.private("changeData", childrenData)
                        }
                    }
                    if ("additionalParameters" in options && "children" in options.additionalParameters) $data = options.additionalParameters.children;
                    else $data = {}

                }

                if ($data != null) {
                    callback({
                        data: $data
                    });
                }
            }
        },
        "public": {
            /**
            *@function
            *@memberOf treeView
            *@name public$setEventCall
            *@description [功能]设置目录树的点击事件的回调函数
            *[思路]先取消节点原来的事件，然后用jquery的bind方法重新绑定
            *[接口.this.MY.treeDom]当前绑定节点的dom包装器
            *@param eventfun 回调函数名
            function(e,o){
            e为jquery的x-event对象
            o为被选中节点结构如下：
            {
            info:[//多选时是选中的节点数组
            {
            被选中节点数据
            }
            ]
            }
            }
            *@param eventName 事件名，不填缺省为selected
            */
            "setEventCall": function(eventfun, eventName) {
                //获取最终的绑定事件名
                if (eventName == null) {
                    eventName = "selected";
                }
                //移除dom上原来绑定事件
                this.MY.treeDom.unbind(eventName);
                //绑定新事件
                this.MY.treeDom.bind(eventName, eventfun);
            },
            /**
            *@function
            *@memberOf treeView
            *@name public$setDataCallback
            *@description [功能]设置数据回调，即有些数据是按照层次逐步读取的，不是开始在init一口气设置的。这时，inti只设置第一层数据，在这个接口中，可以每次点击后的数据响应。
            *[思路]预先设置好一个内部变量，在初始化处理数据时就将这个回调机制设置进去，每次初始化后，都要再调用一次这个函数进行设置。
            *[接口.this.MY.getData]处理数据的回调函数
            *@param getDataFun 一个回调函数
            function(item){
            item:是当前点击中的那个节点
            return 返回的数据，其格式为{
            name:xxxx
            type:"item/folder"
            其他自定义参数
            }
            }
            */
            "setDataCallback": function(getDataFun) {
                //设置绑定事件回调函数到内部变量中
                this.MY.getData = getDataFun;
            },
            /**
            *@function
            *@memberOf treeView
            *@name public$init
            *@description [功能]初始化一棵树
            *[思路]将输入的数据转换成约定格式的数据
            *[接口.转换后树数据]{
            *            name: "基本信息",
            *            type: "item",
            *           其他自定义属性
            *        },
            *        "baseInfo2": {
            *            name: "第二个菜单",
            *            type: "folder",
            *            'additionalParameters': {
            *                 'children': {
            *                      'motorcycles': {
            *                                 name: 'Motorcycles',
            *                                 type: 'item'
            *                                 其他自定义属性
            *                       },
            *                      'boats': {
            *                                 name: 'Boats',
            *                                 type: 'item'
            *                                 其他自定义属性
            *                      }
            *                 }
            *             },
            *             其他自定义属性
            *        }
            *[接口.this.MY.treeDom]当前绑定节点的dom包装器
            *[接口.this.MY.getData]处理数据的回调函数
            *[接口.this.MY.DataSourceTree]treeview组件需要的一个数据对象onCreate中声明
            *@param data 目录树数据:
            [
            {
            name:"显示名称",
            type:"item/folder",
            icon-class:"添加的icon的class样式",
            icon-img:"图标地址",
            icon:"icon的样式内容，比如icon-music blue"，
            dir:所在目录,
            其他自定义属性,
            children:[儿子的内容，循环上面父亲的结构
            ]
            }
            ]
            *@param initParam 初始化的参数，结构如下：
            {
            multiSelect: false,提供默认设置
            loadingHTML: '<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',提供默认设置
            'open-icon': 'icon-minus',提供默认设置
            'close-icon': 'icon-plus',提供默认设置
            'selectable': true,提供默认设置
            'selected-icon': 'icon-ok',提供默认设置
            'unselected-icon': 'icon-remove',提供默认设置
            }
            *@param target 放置目录树的节点id值，不填则为当前gadget的绑定对象
            *@return 返回首目录要处理成的数据内容
            */
            "init": function(data, initParam, target) {
                //初始化获取事件回调的全局变量
                this.MY.getData = null;
                //确定绑定目录树的dom
                this.API.show("treeView");
                if (target != null) {
                    this.MY.treeDom = this.API.find("#" + target);
                } else {
                    this.MY.treeDom = this.API.find("#mainTree");
                }
                //转换数据
                var treeData = this.API.private('changeData', data);
                //合成数据
                var showData = new this.MY.DataSourceTree({
                    data: treeData
                });
                //进行初TreeView的始化
                if (initParam == null) {
                    initParam = {};
                }
                this.MY.treeDom.html("");
                this.MY.treeDom.ace_tree({
                    dataSource: showData,
                    multiSelect: (initParam.multiSelect == null) ? this.param.multiSelect: initParam.multiSelect,
                    loadingHTML: initParam.loadingHTML || this.param.loadingHTML,
                    'open-icon': initParam['open-icon'] || this.param["open-icon"],
                    'close-icon': initParam['close-icon'] || this.param["close-icon"],
                    'selectable': (initParam.selectable == null) ? this.param.selectable: initParam.selectable,
                    'selected-icon': (initParam['selected-icon'] == null) ? this.param['selected-icon'] : initParam['selected-icon'],
                    'unselected-icon': (initParam['unselected-icon'] == null) ? this.param['unselected-icon'] : initParam['unselected-icon']
                });
                //返回首页数据
                var initDir = this.MY.initDir = (data && data[0] && data[0].dir) || "/";

                return {
                    info: [{
                        name: "",
                        realName: "",
                        dir: initDir,
                        type: "folder",
                        additionalParameters: {
                            children: treeData
                        }
                    }]
                }
            },
            /**
            *@function
            *@memberOf treeView
            *@name public$expDir
            *@description [功能]自动展开文件路径,注意，展开的目录会和初始目录进行比较，然后刨去初始部分
            *[思路]参考ace的目录树的展开原理，从顶层开始逐步判断展开
            *@param dir 文件路径，用/或者\做间隔符，例如：abc/sdf/dd
            */
            "expDir": function(dir) {
                //block(内部函数){输入一个顶级dom，将下一级展开
                var expOne = function(dom, name, openContent) {
                    //找到要展开的目录名
                    var objDom = null;
                    dom.children(".tree-folder").children(".tree-folder-header").children(".tree-folder-name:contains('" + name + "')").each(function() {
                        if (this.innerHTML == name) {
                            objDom = $(this);
                        }
                    });
                    if (objDom == null || objDom.length != 1) {
                        return null;
                    }
                    var headDom = objDom.parent(".tree-folder-header");
                    //展开目录
                    headDom.trigger("open", openContent);
                    //返回儿子
                    var next = headDom.parent(".tree-folder").children(".tree-folder-content");
                    if (next.length != 1) {
                        return null;
                    }
                    return next;
                }
                //}
                //分裂目录
                var allDir = dir.replace(/(^[\\\/]+)|([\\\/]+$)/g, "").split(/[\\\/]+/);
                var initDir = this.MY.initDir.replace(/(^[\\\/]+)|([\\\/]+$)/g, "").split(/[\\\/]+/);
                if (initDir != null && initDir.length == 1 && initDir[0] == "") {
                    initDir = [];
                }
                var sameRoot = true;
                var parentDom = this.MY.treeDom;
                //while(每一个分类内容){逐个调用
                for (var i = 0; i < allDir.length; i++) {
                    if (sameRoot && allDir[i] == initDir[i]) {
                        continue;
                    } else {
                        sameRoot = false;
                    }
                    var curr = allDir[i];
                    //if (不是最后一个原始){展开但不调用内容
                    if (i != allDir.length - 1) {
                        //展开
                        parentDom = expOne(parentDom, curr, false);
                        if (parentDom == null) {
                            alert("目录展开失败:" + dir);
                            return;
                        }
                    }
                    //}
                    //else{展开并调用内容
                    else {
                        //展开
                        expOne(parentDom, curr, true);
                    }
                    //}
                }
                //}
            }
        },
        "private": {
            /**
            *@function
            *@memberOf treeView
            *@name private$changeData
            *@description [功能]转换数据
            *@param data 转换前数据
            [
            {
            name:"显示名称",
            type:"item/folder",
            icon-class:"添加的icon的class样式",
            icon-img:"图标地址",
            icon:"icon的样式内容，比如icon-music blue"，
            其他自定义属性,
            children:[儿子的内容，循环上面父亲的结构
            ]
            }
            ]
            *@return {
            name: "基本信息",
            type: "item",
            其他自定义属性
            },
            "baseInfo2": {
            name: "第二个菜单",
            type: "folder",
            'additionalParameters': {
            'children': {
            'motorcycles': {
            name: 'Motorcycles',
            type: 'item'
            其他自定义属性
            },
            'boats': {
            name: 'Boats',
            type: 'item'
            其他自定义属性
            }
            }
            },
            其他自定义属性
            }
            */
            "changeData": function(data) {
                //block(独立递归函数){做一个解析转换的递归函数
                var parseDataFun = function(srcArr, objData) {
                    //while(当前每个被解析层){针对每个进行赋值
                    for (var i = 0; i < srcArr.length; i++) {
                        //循环所有属性给目标进行赋值
                        var tmp = objData["data" + i] = {}
                        for (var n in srcArr[i]) {
                            if (n == "children") {
                                continue;
                            } else if (n == "icon" || n == "icon-img") {
                                continue;
                            } else {
                                tmp[n] = srcArr[i][n];
                            }
                        }
                        //处理样式icon和icon-img
                        if (srcArr[i].icon) {
                            tmp.name = "<i class='" + srcArr[i].icon + "'></i>" + tmp.name;
                        }
                        if (srcArr[i]["icon-img"]) {
                            tmp.name = "<img src='" + srcArr[i]["icon-img"] + "'></i>" + tmp.name;
                        }
                        //if(有儿子情况){递归调用
                        if (srcArr[i].children && srcArr[i].children.length && srcArr[i].children.length > 0) {
                            //挂接要递归的变量
                            tmp.additionalParameters = {
                                children: {}
                            }
                            //递归调用函数对儿子进行解析
                            parseDataFun(srcArr[i].children, tmp.additionalParameters.children);
                        }
                        //}
                    }
                    //}
                    var nothing = null;
                }
                //}
                //初始化第一层数据并调用递归函数
                var treeData = {};
                parseDataFun(data, treeData);
                //然后数据
                return treeData;
            }
        },
        view: {
            'treeView': require("./resource/treeView/treeView.tpl")
        }

    },
    module);
    return FW;
});