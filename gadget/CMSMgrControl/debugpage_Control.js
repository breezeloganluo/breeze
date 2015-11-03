/**
* @namespace
* @name debugpage_Control 
* @description  这个control打开一个编辑当前congtrol相关信息的页面    
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "debugpage_Control",
        "extends": ["CMSMgrControl"],
        /**
        *@function
        *@memberOf debugpage_Control
        *@name onCreate$onCreate
        *@description undefined
        */
        "onCreate": function() {
            //获取上一个堆栈信息
            var control = FW.page.getLastControl();
            //获取type和alias
            var type = control && control.type || "list";
            var alias = control && control.alias || "";
            if (this.param.forward) {
                type = this.param.type;
                alias = this.param.alias;
            }
            //获取gadget
            var gadgetName = "CMSMgrDefaultListControl";
            if (type == "single") {
                gadgetName = "CMSMgrDefaultSingleControl";
            } else if (type != null && type != "" && type != "list") {
                gadgetName = type + "_Control";
            }
            var gadget = FW.getGadget(gadgetName);
            var gadgetDir = gadget && gadget._uri;
            //初始化显示数据
            var showData = {
                alias: alias,
                type: type,
                gadgetName: gadgetName,
                gadgetDir: ""
            }
            //if(存在gadget情况){设置该gadget相关的显示
            if (gadget) {
                //将gadgetdir的前端前缀去掉
                var execResult = /https?:\/\/[^\/]+\/([^\/]+)\/(.*)/i.exec(gadgetDir);
                if (execResult != null) {
                    var prefix = execResult[1];
                    var dir = execResult[2];
                    if (prefix == Cfg.baseUrl.replace(/\//i, "")) {
                        showData.gadgetDir = "/" + dir;
                    } else {
                        showData.gadgetDir = "/" + prefix + "/" + dir;
                    }
                }
                //显示页面
                this.API.show("debugView", showData);
            }
            //}
            //else{
            else {
                this.API.show("debug4new", showData);
            }
            //}
        },
        "FireEvent": {
            /**
            *@function
            *@memberOf debugpage_Control
            *@name FireEvent$editControl
            *@description 根据页面传入的路径参数，跳转到gadget编辑器上编辑
            *@param dir 传入的gadget参数名
            */
            "editControl": function(dir) {
                //进行url编码
                var f = encodeURIComponent(dir);
                //合成url
                var url = Cfg.baseUrl + "/" + "manager_auxiliary/gadgetCreator.jsp?fileUrl=" + f
                //跳转编辑
                window.open(url);
            },
            /**
            *@function
            *@memberOf debugpage_Control
            *@name FireEvent$newControl
            *@description 新建一个control，用已有默认的类
            *@param name 传入的gadget名
            */
            "newControl": function(name) {
                //整理dir
                dir = "/servicegadget/" + $('#debugdir').val() + "/" + name + ".js";
                //进行url编码
                var f = encodeURIComponent(dir);
                //合成url
                var url = Cfg.baseUrl + "/" + "manager_auxiliary/gadgetCreator.jsp?fileUrl=" + f
                //跳转编辑
                window.open(url);
            }
        }
    },
    module);
    return FW;
});